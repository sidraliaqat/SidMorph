import { VoiceProfile } from '../../types';
import { splitIntoSentences, tokenizeWords } from './tokenizer';

export function analyzeVoiceProfile(sampleText: string): VoiceProfile {
  if (!sampleText || sampleText.trim().length < 20) {
    return {
      sampleLength: 0,
      avgSentenceLength: 18,
      vocabularyComplexity: 'Moderate',
      formality: 'Professional',
      activeVoiceRatio: 80,
      toneCharacteristics: ['Clear', 'Direct', 'Informative'],
      punctuationHabits: 'Standard commas and terminal periods.',
      extractedGuidelines: [
        'Maintain direct syntactic construction with balanced compound clauses.',
        'Preserve domain terminology without forced colloquial substitutions.',
      ],
    };
  }

  const sentences = splitIntoSentences(sampleText);
  const words = tokenizeWords(sampleText);
  const sentenceCount = Math.max(sentences.length, 1);
  const avgSentenceLength = Math.round((words.length / sentenceCount) * 10) / 10;

  // Vocabulary complexity based on average word length and long words ratio
  const longWords = words.filter(w => w.length > 7);
  const longWordRatio = words.length > 0 ? longWords.length / words.length : 0.15;

  let vocabularyComplexity: 'Simple' | 'Moderate' | 'Advanced' | 'Scholarly' = 'Moderate';
  if (longWordRatio > 0.28) vocabularyComplexity = 'Scholarly';
  else if (longWordRatio > 0.2) vocabularyComplexity = 'Advanced';
  else if (longWordRatio < 0.1) vocabularyComplexity = 'Simple';

  // Formality based on personal pronouns vs scholarly passive/neutral pronouns
  const personalPronouns = (sampleText.match(/\b(i|me|my|we|us|our|you|your)\b/gi) || []).length;
  const formality: 'Conversational' | 'Professional' | 'Academic' | 'Rigorous' =
    personalPronouns > 5 ? 'Conversational' : longWordRatio > 0.24 ? 'Rigorous' : avgSentenceLength > 22 ? 'Academic' : 'Professional';

  // Punctuation habits
  const semiColons = (sampleText.match(/;/g) || []).length;
  const emDashes = (sampleText.match(/[—–]|--/g) || []).length;
  const colons = (sampleText.match(/:/g) || []).length;
  const commas = (sampleText.match(/,/g) || []).length;

  let punctuationHabits = 'Predominantly uses standard commas and periods.';
  if (semiColons > 1) punctuationHabits += ' Frequent use of semicolons for compound balance.';
  if (emDashes > 0) punctuationHabits += ' Employs em-dashes for parenthetical emphasis.';
  if (colons > 1) punctuationHabits += ' Uses colons for explanatory introductions.';

  // Tone characteristics
  const toneCharacteristics: string[] = [];
  if (avgSentenceLength > 24) toneCharacteristics.push('Deliberate & Expansive');
  else if (avgSentenceLength < 16) toneCharacteristics.push('Crisp & Direct');
  else toneCharacteristics.push('Balanced & Measured');

  if (vocabularyComplexity === 'Scholarly' || vocabularyComplexity === 'Advanced') {
    toneCharacteristics.push('Intellectual Precision');
  } else {
    toneCharacteristics.push('Accessible Clarity');
  }

  if (formality === 'Academic' || formality === 'Rigorous') {
    toneCharacteristics.push('Objective Authoritative');
  } else {
    toneCharacteristics.push('Engaged Professional');
  }

  const guidelines: string[] = [
    `Target average sentence length around ${Math.round(avgSentenceLength)} words per sentence.`,
    `Adopt a ${formality.toLowerCase()} formality level with ${vocabularyComplexity.toLowerCase()} diction.`,
    `Reflect user's rhythm: ${toneCharacteristics.join(', ')}.`,
  ];

  return {
    sampleLength: words.length,
    avgSentenceLength,
    vocabularyComplexity,
    formality,
    activeVoiceRatio: 82,
    toneCharacteristics,
    punctuationHabits,
    extractedGuidelines: guidelines,
  };
}
