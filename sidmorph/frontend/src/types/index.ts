export type WritingMode =
  | 'Academic'
  | 'Research'
  | 'Technical'
  | 'Professional'
  | 'Natural'
  | 'Simple'
  | 'Concise';

export type RewriteIntensity = 'Light' | 'Balanced' | 'Deep';

export interface Workspace {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  label?: string;
  content: string;
  wordCount: number;
  createdAt: string;
}

export interface Document {
  id: string;
  workspaceId: string;
  title: string;
  currentVersionId?: string;
  content: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  versions?: DocumentVersion[];
}

export interface SimilarityMatch {
  id: string;
  text: string;
  startPosition: number;
  endPosition: number;
  similarity: number; // e.g. 0.82
  category: 'Standard Academic Phrasing' | 'Direct Lexical Overlap' | 'Structural Paraphrase' | 'Formulaic Transition';
  reason: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface SimilarityAnalysis {
  id: string;
  documentId: string;
  versionId?: string;
  potentialOverlapScore: number; // percentage (e.g. 18%)
  projectedOverlapAfterRewrite?: number; // e.g. 6%
  matches: SimilarityMatch[];
  summary: string;
  createdAt: string;
}

export interface AIIndicator {
  id: string;
  text: string;
  paragraphIndex?: number;
  startPosition: number;
  endPosition: number;
  score: number; // 0 - 100
  indicatorType: 'Sentence Uniformity' | 'Low Perplexity / Predictability' | 'Vocabulary Repetition' | 'Structural Uniformity' | 'Formulaic Transition';
  explanation: string;
}

export interface AIAnalysis {
  id: string;
  documentId: string;
  versionId?: string;
  aiLikeness: number; // percentage (e.g. 58%)
  confidence: 'High' | 'Medium' | 'Low';
  model: string;
  indicators: {
    sentenceUniformity: 'High' | 'Medium' | 'Low';
    predictability: 'High' | 'Medium' | 'Low';
    vocabularyVariation: 'High' | 'Medium' | 'Low';
    structuralRepetition: 'High' | 'Medium' | 'Low';
    stylisticVariation: 'High' | 'Medium' | 'Low';
  };
  indicatorItems: AIIndicator[];
  paragraphs: {
    index: number;
    text: string;
    aiLikeness: 'Low' | 'Medium' | 'High';
    score: number;
    reason: string;
  }[];
  createdAt: string;
  disclaimer: string;
}

export interface WritingMetric {
  id?: string;
  documentId?: string;
  versionId?: string;
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  readabilityScore: number; // Flesch Reading Ease
  readingGradeLevel: string; // e.g. "Grade 11"
  passiveVoicePercentage: number;
  passiveVoiceOccurrences: string[];
  repetitionScore: number; // 0-100 (lower repetition is better)
  repeatedPhrases: { phrase: string; count: number }[];
  clarityScore: number; // 0-100
  academicToneScore: number; // 0-100
  fillerWordsFound: { word: string; count: number }[];
  createdAt?: string;
}

export interface Citation {
  id: string;
  documentId?: string;
  citationText: string;
  citationStyle: 'APA' | 'MLA' | 'IEEE' | 'Numbered' | 'Author-Year';
  position: number;
  preserved: boolean;
}

export interface CitationIntegrityReport {
  detectedCount: number;
  preservedCount: number;
  potentialMissingClaims: {
    claimText: string;
    reason: string;
    suggestion: string;
  }[];
  citations: Citation[];
}

export type TransformationStatus =
  | 'GENUINE_TRANSFORMATION'       // 3. Genuine linguistic transformation
  | 'IDENTICAL'                    // 1. Identical output
  | 'MINOR_FORMATTING_ONLY'        // 2. Minor formatting-only change
  | 'MEANING_DRIFT';               // 4. Meaning-changing transformation

export interface VerificationResult {
  meaningScore: number; // percentage e.g. 96%
  coreClaimPreserved: boolean;
  keyInformationPreserved: boolean;
  numbersPreserved: boolean;
  technicalTermsPreserved: boolean;
  citationPreserved: boolean;
  driftLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  driftDetails?: string;
  transformationStatus: TransformationStatus;
  transformationDetails: string;
  preservedEntities: string[];
  preservedNumbers: string[];
  preservedTerms: string[];
}

export interface RewriteResult {
  id: string;
  originalText: string;
  rewrittenText: string;
  mode: WritingMode;
  intensity: RewriteIntensity;
  verification: VerificationResult;
  transformationStatus: TransformationStatus;
  transformationDetails: string;
  changes: {
    id: string;
    original: string;
    replacement: string;
    type: 'substitution' | 'addition' | 'deletion';
    accepted?: boolean;
  }[];
  createdAt: string;
}

export interface VoiceProfile {
  id?: string;
  sampleLength: number;
  avgSentenceLength: number;
  vocabularyComplexity: 'Simple' | 'Moderate' | 'Advanced' | 'Scholarly';
  formality: 'Conversational' | 'Professional' | 'Academic' | 'Rigorous';
  activeVoiceRatio: number;
  toneCharacteristics: string[];
  punctuationHabits: string;
  extractedGuidelines: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contextSnippet?: string;
  createdAt: string;
}
