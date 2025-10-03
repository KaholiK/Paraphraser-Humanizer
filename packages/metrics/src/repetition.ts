/**
 * Repetition analysis
 */

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
  const words = text.toLowerCase().match(/\b[\w']+\b/g);
  return words || [];
}

/**
 * Generate bigrams from array of tokens
 */
function generateBigrams(tokens: string[]): string[] {
  if (tokens.length < 2) return [];

  const bigrams: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
}

/**
 * Calculate repetition ratio: unique bigrams / total bigrams (0..1)
 * Higher ratio = more diverse, lower = more repetitive
 */
export function getRepetitionRatio(text: string): number {
  const tokens = tokenize(text);
  if (tokens.length < 2) return 1; // No bigrams possible, perfect "diversity"

  const bigrams = generateBigrams(tokens);
  if (bigrams.length === 0) return 1;

  const uniqueBigrams = new Set(bigrams);
  const ratio = uniqueBigrams.size / bigrams.length;

  return ratio;
}
