import { TransformationStatus, VerificationResult } from '../../types';
import { extractEntitiesAndTerms, extractNumbers, tokenizeWords } from './tokenizer';
import { detectCitations, evaluateCitationPreservation } from './citation';

export function verifySemanticIntegrity(
  originalText: string,
  rewrittenText: string
): VerificationResult {
  const normOrig = originalText.trim().replace(/\s+/g, ' ');
  const normRew = rewrittenText.trim().replace(/\s+/g, ' ');

  // 1. Extract factual anchors from original text
  const originalNumbers = extractNumbers(originalText);
  const originalEntities = extractEntitiesAndTerms(originalText);
  const originalCitations = detectCitations(originalText);

  // 2. Check preservation in rewritten text
  const preservedNumbers: string[] = [];
  const missingNumbers: string[] = [];
  for (const num of originalNumbers) {
    if (rewrittenText.includes(num)) {
      preservedNumbers.push(num);
    } else {
      missingNumbers.push(num);
    }
  }

  const preservedEntities: string[] = [];
  const missingEntities: string[] = [];
  for (const ent of originalEntities) {
    if (rewrittenText.toLowerCase().includes(ent.toLowerCase())) {
      preservedEntities.push(ent);
    } else {
      missingEntities.push(ent);
    }
  }

  const { preservedCount, lostCitations } = evaluateCitationPreservation(originalCitations, rewrittenText);

  // 3. Evaluate boolean gates
  const numbersPreserved = originalNumbers.length === 0 || missingNumbers.length === 0;
  const technicalTermsPreserved = originalEntities.length === 0 || (preservedEntities.length / originalEntities.length) >= 0.75;
  const citationPreserved = originalCitations.length === 0 || lostCitations.length === 0;

  // 4. Compute composite meaning preservation score (0 - 100%)
  let baseScore = 96;

  if (!numbersPreserved) {
    baseScore -= missingNumbers.length * 14;
  }
  if (!technicalTermsPreserved) {
    baseScore -= missingEntities.length * 8;
  }
  if (!citationPreserved) {
    baseScore -= lostCitations.length * 20;
  }

  // Length anomaly check: if rewrite is <40% or >250% length of original, penalize
  const origLen = originalText.trim().length;
  const rewLen = rewrittenText.trim().length;
  if (origLen > 0 && (rewLen < origLen * 0.4 || rewLen > origLen * 2.2)) {
    baseScore -= 12;
  }

  const meaningScore = Math.min(Math.max(baseScore, 42), 99);

  // 5. Determine drift level
  let driftLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let driftDetails = 'Meaning, core claim, entities, and citations are intact.';

  if (meaningScore < 75 || !citationPreserved || missingNumbers.length > 0) {
    driftLevel = 'HIGH';
    driftDetails = `Potential critical drift detected: ${
      missingNumbers.length > 0 ? `Missing numbers (${missingNumbers.join(', ')}). ` : ''
    }${lostCitations.length > 0 ? `Unpreserved citations (${lostCitations.map(c => c.citationText).join(', ')}). ` : ''}${
      missingEntities.length > 0 ? `Key terms omitted (${missingEntities.join(', ')}).` : ''
    }`;
  } else if (meaningScore < 88 || missingEntities.length > 0) {
    driftLevel = 'MEDIUM';
    driftDetails = `Minor lexical nuance variation. ${
      missingEntities.length > 0 ? `Please verify entity phrasing for: ${missingEntities.join(', ')}.` : ''
    }`;
  }

  // 6. MORPH OUTPUT VALIDATION & CLASSIFICATION
  // Distinguish between:
  // 1. Identical output
  // 2. Minor formatting-only change
  // 3. Genuine linguistic transformation
  // 4. Meaning-changing transformation
  let transformationStatus: TransformationStatus = 'GENUINE_TRANSFORMATION';
  let transformationDetails = 'Genuine linguistic and syntactic transformation successfully achieved.';

  const wordsOrig = tokenizeWords(originalText);
  const wordsRew = tokenizeWords(rewrittenText);

  // Check 1: Identical output
  if (normOrig === normRew || originalText.trim() === rewrittenText.trim()) {
    transformationStatus = 'IDENTICAL';
    transformationDetails = 'No textual changes detected. The generated output is verbatim identical to the input draft.';
  }
  // Check 2: Minor formatting-only change (only whitespace, case, or minimal punctuation change)
  else if (wordsOrig.join(' ') === wordsRew.join(' ')) {
    transformationStatus = 'MINOR_FORMATTING_ONLY';
    transformationDetails = 'Only minor formatting, casing, or punctuation adjustments detected without syntactic re-articulation.';
  } else {
    // Calculate word difference ratio
    let matchedWordCount = 0;
    const rewWordsSet = new Set(wordsRew);
    for (const w of wordsOrig) {
      if (rewWordsSet.has(w)) matchedWordCount++;
    }
    const overlapRatio = wordsOrig.length > 0 ? matchedWordCount / wordsOrig.length : 1;
    const editRatio = Math.abs(wordsOrig.length - wordsRew.length) / Math.max(wordsOrig.length, 1);

    // If less than 6% words changed and length is essentially unchanged
    if (overlapRatio > 0.96 && editRatio < 0.05) {
      transformationStatus = 'MINOR_FORMATTING_ONLY';
      transformationDetails = 'Trivial superficial word substitution detected without genuine linguistic transformation.';
    }
    // Check 4: Meaning-changing transformation (critical drift)
    else if (driftLevel === 'HIGH' || !numbersPreserved || !citationPreserved) {
      transformationStatus = 'MEANING_DRIFT';
      transformationDetails = 'The rewrite altered factual metrics, numbers, or scholarly attribution.';
    }
    // Check 3: Genuine linguistic transformation
    else {
      transformationStatus = 'GENUINE_TRANSFORMATION';
      transformationDetails = 'Substantive syntactic reconstruction and lexical refinement achieved with meaning preserved.';
    }
  }

  return {
    meaningScore,
    coreClaimPreserved: meaningScore >= 75 && transformationStatus !== 'MEANING_DRIFT',
    keyInformationPreserved: meaningScore >= 80 && transformationStatus !== 'MEANING_DRIFT',
    numbersPreserved,
    technicalTermsPreserved,
    citationPreserved,
    driftLevel,
    driftDetails,
    transformationStatus,
    transformationDetails,
    preservedEntities,
    preservedNumbers,
    preservedTerms: preservedEntities,
  };
}
