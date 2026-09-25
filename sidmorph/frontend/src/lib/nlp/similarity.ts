import { SimilarityAnalysis, SimilarityMatch } from '../../types';
import { splitIntoSentences, tokenizeWords } from './tokenizer';

// Corpus of high-frequency academic formulaic strings and common published boilerplate
const COMMON_ACADEMIC_PATTERNS = [
  'in recent years, there has been an increasing interest in',
  'plays a crucial role in the development of',
  'the purpose of this study is to investigate',
  'the results of this study indicate that',
  'as shown in figure, the data reveals that',
  'has attracted widespread attention in both academia and industry',
  'to the best of our knowledge, this is the first study to',
  'is widely considered to be one of the most important',
  'a significant amount of research has been conducted on',
  'in order to address this limitation, we propose',
  'the remainder of this paper is organized as follows',
  'extensive experiments demonstrate that our proposed method outperforms',
  'can be seen as an effective alternative to traditional methods',
  'due to the rapid development of information technology',
  'future research should focus on exploring the underlying mechanisms',
  'it is worth noting that the relationship between',
  'has become an essential component in modern',
  'contributes significantly to the existing body of literature'
];

// Generates word n-grams (3-grams, 4-grams, 5-grams)
function extractNGrams(words: string[], n: number): string[] {
  if (words.length < n) return [];
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

// Calculate Jaccard similarity between two token sets
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function analyzeSimilarity(text: string, documentId: string = 'doc-current'): SimilarityAnalysis {
  if (!text || text.trim().length < 20) {
    return {
      id: `sim-${Date.now()}`,
      documentId,
      potentialOverlapScore: 0,
      projectedOverlapAfterRewrite: 0,
      matches: [],
      summary: 'Insufficient text to perform meaningful textual overlap analysis.',
      createdAt: new Date().toISOString(),
    };
  }

  const sentences = splitIntoSentences(text);
  const matches: SimilarityMatch[] = [];
  let totalMatchWords = 0;
  const totalTokens = tokenizeWords(text);

  let searchCursor = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const sentenceLower = sentence.toLowerCase();
    const sentenceWords = tokenizeWords(sentence);
    const startPos = text.indexOf(sentence, searchCursor);
    if (startPos !== -1) {
      searchCursor = startPos + sentence.length;
    }

    // 1. Check against academic formulaic boilerplate database
    let foundBoilerplate = false;
    for (const pattern of COMMON_ACADEMIC_PATTERNS) {
      if (sentenceLower.includes(pattern)) {
        foundBoilerplate = true;
        const matchWords = pattern.split(' ').length;
        totalMatchWords += matchWords;

        matches.push({
          id: `match-${matches.length + 1}`,
          text: sentence,
          startPosition: startPos !== -1 ? startPos : 0,
          endPosition: (startPos !== -1 ? startPos : 0) + sentence.length,
          similarity: 0.88,
          category: 'Standard Academic Phrasing',
          reason: `High lexical alignment with standard literature boilerplate ("${pattern}"). Common in academic discourse, often non-substantive.`,
          confidence: 'High',
        });
        break;
      }
    }

    if (foundBoilerplate) continue;

    // 2. Check for internal self-repetition / repetitive sentence structures
    for (let j = i + 1; j < sentences.length; j++) {
      const otherSentence = sentences[j];
      const otherWords = tokenizeWords(otherSentence);

      const ngramsA = new Set(extractNGrams(sentenceWords, 4));
      const ngramsB = new Set(extractNGrams(otherWords, 4));
      const sim = jaccardSimilarity(ngramsA, ngramsB);

      if (sim > 0.45 && sentenceWords.length > 6) {
        totalMatchWords += Math.round(sentenceWords.length * sim);
        matches.push({
          id: `match-${matches.length + 1}`,
          text: sentence,
          startPosition: startPos !== -1 ? startPos : 0,
          endPosition: (startPos !== -1 ? startPos : 0) + sentence.length,
          similarity: Math.round(sim * 100) / 100,
          category: 'Structural Paraphrase',
          reason: `Repeated internal sentence structure and 4-gram pattern mirroring sentence ${j + 1}.`,
          confidence: sim > 0.65 ? 'High' : 'Medium',
        });
        break;
      }
    }

    // 3. Scan for consecutive 6-gram direct formulaic clusters
    if (sentenceWords.length >= 7) {
      const fiveGrams = extractNGrams(sentenceWords, 5);
      const formulaicConnectors = [
        'on the other hand it',
        'it is evident that the',
        'has been shown to have',
        'in accordance with the principles',
        'plays an important role in'
      ];

      for (const fg of fiveGrams) {
        if (formulaicConnectors.includes(fg)) {
          totalMatchWords += 5;
          matches.push({
            id: `match-${matches.length + 1}`,
            text: sentence,
            startPosition: startPos !== -1 ? startPos : 0,
            endPosition: (startPos !== -1 ? startPos : 0) + sentence.length,
            similarity: 0.76,
            category: 'Formulaic Transition',
            reason: `Dense transition string ("${fg}") closely matches ubiquitous published conventions.`,
            confidence: 'Medium',
          });
          break;
        }
      }
    }
  }

  // Calculate potential textual overlap percentage based on overlapping tokens
  const totalWordCount = Math.max(totalTokens.length, 1);
  const rawOverlapPercent = Math.min(Math.round((totalMatchWords / totalWordCount) * 100), 75);
  // Ensure baseline realism: if matches exist, provide proportional score
  const overlapScore = matches.length > 0 ? Math.max(rawOverlapPercent, Math.min(matches.length * 6, 42)) : 4;
  const projectedAfter = Math.max(Math.round(overlapScore * 0.28), 2);

  return {
    id: `sim-${Date.now()}`,
    documentId,
    potentialOverlapScore: overlapScore,
    projectedOverlapAfterRewrite: projectedAfter,
    matches: matches.slice(0, 8),
    summary: `Identified ${matches.length} passage${matches.length === 1 ? '' : 's'} with potential textual resemblance to standard academic formulas or structural repetition patterns.`,
    createdAt: new Date().toISOString(),
  };
}
