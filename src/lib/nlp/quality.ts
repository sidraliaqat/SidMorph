import { WritingMetric } from '../../types';
import { splitIntoSentences, tokenizeWords } from './tokenizer';

// Estimate syllables in a word
function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  // Replace common suffixes
  const stripped = clean.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  const syllables = stripped.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(syllables.length, 1) : 1;
}

// Common passive voice patterns in English (auxiliary be/get + past participle)
const PASSIVE_VOICE_REGEX = /\b(am|is|are|was|were|been|being|be|get|gets|got|gotten)\s+([a-z]+ed|[a-z]+en|shown|written|built|made|seen|found|given|taken|held|known|drawn|understood)\b/gi;

// Unnecessary filler phrases that reduce clarity
const FILLER_PHRASES = [
  'in order to',
  'due to the fact that',
  'at this point in time',
  'for the purpose of',
  'in the event that',
  'it is interesting to note that',
  'all things being equal',
  'as a matter of fact',
  'in spite of the fact that',
  'it goes without saying that'
];

export function analyzeWritingQuality(text: string, documentId: string = 'doc-current'): WritingMetric {
  if (!text || text.trim().length === 0) {
    return {
      documentId,
      wordCount: 0,
      characterCount: 0,
      sentenceCount: 0,
      averageSentenceLength: 0,
      readabilityScore: 0,
      readingGradeLevel: 'N/A',
      passiveVoicePercentage: 0,
      passiveVoiceOccurrences: [],
      repetitionScore: 0,
      repeatedPhrases: [],
      clarityScore: 0,
      academicToneScore: 0,
      fillerWordsFound: [],
      createdAt: new Date().toISOString(),
    };
  }

  const sentences = splitIntoSentences(text);
  const words = tokenizeWords(text);
  const characterCount = text.length;
  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);
  const averageSentenceLength = Math.round((wordCount / sentenceCount) * 10) / 10;

  // Syllables count
  let totalSyllables = 0;
  let complexWordsCount = 0; // 3+ syllables
  for (const w of words) {
    const syl = countSyllables(w);
    totalSyllables += syl;
    if (syl >= 3) complexWordsCount++;
  }

  // Flesch Reading Ease: 206.835 - 1.015 * (total_words / total_sentences) - 84.6 * (total_syllables / total_words)
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = wordCount > 0 ? totalSyllables / wordCount : 1;
  const rawReadability = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  const readabilityScore = Math.min(Math.max(Math.round(rawReadability), 10), 100);

  // Flesch-Kincaid Grade Level: 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
  const gradeLevelNum = Math.round(0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59);
  const readingGradeLevel = gradeLevelNum <= 8 ? 'General Audience' : gradeLevelNum <= 12 ? `Grade ${gradeLevelNum}` : 'Scholarly / Graduate';

  // Passive voice detection
  const passiveMatches: string[] = [];
  const passiveRegex = new RegExp(PASSIVE_VOICE_REGEX);
  let match: RegExpExecArray | null;
  while ((match = passiveRegex.exec(text)) !== null) {
    if (!passiveMatches.includes(match[0].toLowerCase())) {
      passiveMatches.push(match[0].toLowerCase());
    }
  }
  const passiveVoicePercentage = Math.min(Math.round((passiveMatches.length / sentenceCount) * 100), 100);

  // Repetition analysis (3-word repeated phrases)
  const phraseCounts: Record<string, number> = {};
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    // Skip very common stop word triplets
    if (!phrase.startsWith('and the ') && !phrase.startsWith('of the ') && !phrase.startsWith('in the ')) {
      phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
    }
  }

  const repeatedPhrases = Object.entries(phraseCounts)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phrase, count]) => ({ phrase, count }));

  const repetitionScore = Math.min(Math.round(repeatedPhrases.reduce((acc, curr) => acc + curr.count, 0) * 3), 100);

  // Filler phrases check
  const lowerText = text.toLowerCase();
  const fillerWordsFound: { word: string; count: number }[] = [];
  for (const filler of FILLER_PHRASES) {
    const count = (lowerText.match(new RegExp(filler, 'g')) || []).length;
    if (count > 0) {
      fillerWordsFound.push({ word: filler, count });
    }
  }

  // Clarity Score (0-100)
  // Penalize extreme sentence length (>28 words), excessive passive voice (>30%), and high filler words
  let clarity = 88;
  if (averageSentenceLength > 28) clarity -= 14;
  else if (averageSentenceLength > 22) clarity -= 6;
  if (passiveVoicePercentage > 35) clarity -= 12;
  if (fillerWordsFound.length > 2) clarity -= 10;
  if (repetitionScore > 25) clarity -= 8;
  const clarityScore = Math.min(Math.max(clarity, 35), 98);

  // Academic Tone Score
  let tone = 70;
  if (complexWordsCount / (wordCount || 1) > 0.18) tone += 15;
  if (lowerText.includes('hypothesis') || lowerText.includes('methodology') || lowerText.includes('empirical') || lowerText.includes('significant')) tone += 10;
  const academicToneScore = Math.min(Math.max(tone, 40), 96);

  return {
    documentId,
    wordCount,
    characterCount,
    sentenceCount,
    averageSentenceLength,
    readabilityScore,
    readingGradeLevel,
    passiveVoicePercentage,
    passiveVoiceOccurrences: passiveMatches.slice(0, 6),
    repetitionScore,
    repeatedPhrases,
    clarityScore,
    academicToneScore,
    fillerWordsFound,
    createdAt: new Date().toISOString(),
  };
}
