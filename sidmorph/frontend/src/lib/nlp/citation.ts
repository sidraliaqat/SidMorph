import { Citation, CitationIntegrityReport } from '../../types';
import { splitIntoSentences } from './tokenizer';

// Regex patterns for academic and scientific citation formats
const APA_PATTERN = /\((?:[A-Z][a-zA-Z]+(?:,\s*(?:[A-Z]\.?\s*)*|\s+et\s+al\.?)?,\s*(?:19|20)\d{2}(?:;\s*[A-Z][a-zA-Z]+(?:,\s*(?:[A-Z]\.?\s*)*|\s+et\s+al\.?)?,\s*(?:19|20)\d{2})*)\)/g;
const AUTHOR_YEAR_PATTERN = /\b([A-Z][a-zA-Z]+(?:\s+et\s+al\.)?)\s+\(((?:19|20)\d{2})\)/g;
const IEEE_PATTERN = /\[(?:\d+(?:[–-]\d+)?(?:,\s*\d+(?:[–-]\d+)?)*)\]/g;
const NUMBERED_SUPERSCRIPT = /\[(\d+)\]/g;

export function detectCitations(text: string): Citation[] {
  if (!text) return [];
  const citations: Citation[] = [];
  let idCounter = 1;

  // 1. APA Parenthetical (e.g. (Smith et al., 2024))
  let match: RegExpExecArray | null;
  const apaRegex = new RegExp(APA_PATTERN);
  while ((match = apaRegex.exec(text)) !== null) {
    citations.push({
      id: `cite-${idCounter++}`,
      citationText: match[0],
      citationStyle: 'APA',
      position: match.index,
      preserved: true,
    });
  }

  // 2. Author (Year) narrative citations (e.g. Johnson et al. (2023))
  const authorYearRegex = new RegExp(AUTHOR_YEAR_PATTERN);
  while ((match = authorYearRegex.exec(text)) !== null) {
    citations.push({
      id: `cite-${idCounter++}`,
      citationText: match[0],
      citationStyle: 'Author-Year',
      position: match.index,
      preserved: true,
    });
  }

  // 3. IEEE / Numbered citations (e.g. [12], [3-5])
  const ieeeRegex = new RegExp(IEEE_PATTERN);
  while ((match = ieeeRegex.exec(text)) !== null) {
    // Avoid double counting if already matched
    if (!citations.some(c => c.position === match!.index)) {
      citations.push({
        id: `cite-${idCounter++}`,
        citationText: match[0],
        citationStyle: 'IEEE',
        position: match.index,
        preserved: true,
      });
    }
  }

  return citations;
}

export function evaluateCitationPreservation(
  originalCitations: Citation[],
  rewrittenText: string
): { preservedCount: number; lostCitations: Citation[] } {
  let preservedCount = 0;
  const lostCitations: Citation[] = [];

  for (const cite of originalCitations) {
    // Check if the citation text or its core reference exists in rewritten text
    const cleanCite = cite.citationText.replace(/[()\[\]]/g, '').trim();
    if (rewrittenText.includes(cite.citationText) || (cleanCite.length > 3 && rewrittenText.includes(cleanCite))) {
      preservedCount++;
    } else {
      lostCitations.push(cite);
    }
  }

  return { preservedCount, lostCitations };
}

// Scans for empirical statements or strong statistical claims that lack citations
export function scanUncitedClaims(text: string): { claimText: string; reason: string; suggestion: string }[] {
  const sentences = splitIntoSentences(text);
  const uncitedClaims: { claimText: string; reason: string; suggestion: string }[] = [];

  const empiricalPatterns = [
    {
      regex: /\b(?:studies have shown|research shows|recent findings indicate|it has been proven|data demonstrates|experiments confirm)\b/i,
      reason: 'General appeal to research or studies without specific citation.',
      suggestion: 'Add an author-year citation (e.g. Smith, 2023) to attribute this empirical claim.',
    },
    {
      regex: /\b\d+(?:\.\d+)?%\s+(?:increase|decrease|growth|reduction|improvement|decline)\b/i,
      reason: 'Specific statistical measurement presented without source attribution.',
      suggestion: 'Provide reference for the origin of this statistical metric.',
    },
    {
      regex: /\b(?:widely recognized as the primary cause|unequivocally established that|universally accepted)\b/i,
      reason: 'Categorical attribution without scholarly authority reference.',
      suggestion: 'Attribute this consensus to a foundational paper or literature review.',
    }
  ];

  for (const s of sentences) {
    const hasCite = APA_PATTERN.test(s) || IEEE_PATTERN.test(s) || AUTHOR_YEAR_PATTERN.test(s);
    if (!hasCite) {
      for (const pattern of empiricalPatterns) {
        if (pattern.regex.test(s)) {
          uncitedClaims.push({
            claimText: s,
            reason: pattern.reason,
            suggestion: pattern.suggestion,
          });
          break;
        }
      }
    }
  }

  return uncitedClaims.slice(0, 4); // Limit to top actionable claims
}

export function generateCitationReport(text: string): CitationIntegrityReport {
  const citations = detectCitations(text);
  const potentialMissingClaims = scanUncitedClaims(text);

  return {
    detectedCount: citations.length,
    preservedCount: citations.length,
    potentialMissingClaims,
    citations,
  };
}
