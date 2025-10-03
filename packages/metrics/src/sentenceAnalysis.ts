/**
 * Sentence analysis utilities
 */

/**
 * Split text into sentences
 * Handles common edge cases like abbreviations, numbers with decimals
 */
function splitIntoSentences(text: string): string[] {
  if (!text || text.trim().length === 0) return [];

  // Replace common abbreviations with placeholders to avoid false splits
  let processed = text;
  const abbreviations = [
    'Dr.',
    'Mr.',
    'Mrs.',
    'Ms.',
    'Prof.',
    'Sr.',
    'Jr.',
    'vs.',
    'etc.',
    'e.g.',
    'i.e.',
    'Ph.D.',
  ];

  const abbrevMap: Record<string, string> = {};
  abbreviations.forEach((abbr, index) => {
    const placeholder = `__ABBR${index}__`;
    abbrevMap[placeholder] = abbr;
    processed = processed.replace(new RegExp(abbr.replace('.', '\\.'), 'g'), placeholder);
  });

  // Split on sentence boundaries
  const sentences = processed
    .split(/[.!?]+\s+/)
    .map((s) => {
      // Restore abbreviations
      let restored = s;
      Object.keys(abbrevMap).forEach((placeholder) => {
        restored = restored.replace(new RegExp(placeholder, 'g'), abbrevMap[placeholder]);
      });
      return restored.trim();
    })
    .filter((s) => s.length > 0);

  return sentences;
}

/**
 * Count words in a sentence
 */
function countWordsInSentence(sentence: string): number {
  const words = sentence.match(/\b[\w']+\b/g);
  return words ? words.length : 0;
}

/**
 * Get sentence lengths (in words) for a given text
 */
export function getSentenceLengths(text: string): number[] {
  const sentences = splitIntoSentences(text);
  return sentences.map(countWordsInSentence);
}

/**
 * Calculate variance of an array of numbers
 */
function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return 0;

  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2));
  const variance = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / numbers.length;

  return variance;
}

/**
 * Get length variance for sentence lengths
 */
export function getLengthVariance(lengths: number[]): number {
  return calculateVariance(lengths);
}
