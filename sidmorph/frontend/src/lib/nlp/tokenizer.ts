// Sentence and token analysis utilities

export function splitIntoSentences(text: string): string[] {
  if (!text || !text.trim()) return [];
  // Clean newlines but preserve paragraph cues
  const normalized = text.replace(/\r\n/g, '\n');
  // Match sentence boundaries while respecting common abbreviations (e.g. Dr., et al., e.g., i.e.)
  const regex = /(?<!\b(?:e\.g|i\.e|et al|vs|Dr|Prof|Mr|Mrs|Ms|Fig|Vol|No|p)\.)(?<=[.?!])\s+(?=[A-Z0-9])/g;
  const rawSentences = normalized.split(regex);
  return rawSentences
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

export function splitIntoParagraphs(text: string): string[] {
  if (!text || !text.trim()) return [];
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

export function tokenizeWords(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

export function extractNumbers(text: string): string[] {
  // Extract digits, percentages, decimals, years
  const matches = text.match(/\b\d+(?:\.\d+)?%?|\b\d{4}\b/g);
  return matches ? Array.from(new Set(matches)) : [];
}

export function extractEntitiesAndTerms(text: string): string[] {
  // Capitalized multi-word phrases, acronyms, and technical terms
  const terms: string[] = [];
  
  // Acronyms (e.g., DNA, BERT, LSTM, NLP, API)
  const acronyms = text.match(/\b[A-Z]{2,}\b/g);
  if (acronyms) terms.push(...acronyms);

  // Capitalized proper nouns / technical names
  const properNouns = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
  if (properNouns) {
    const stopWords = new Set(['The', 'In', 'This', 'These', 'Although', 'However', 'Therefore', 'Furthermore', 'Moreover', 'According', 'While']);
    for (const pn of properNouns) {
      if (!stopWords.has(pn) && pn.length > 2) {
        terms.push(pn);
      }
    }
  }

  return Array.from(new Set(terms));
}
