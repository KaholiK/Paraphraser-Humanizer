/**
 * Lexical diversity analysis
 * Type-Token Ratio (TTR): unique tokens / total tokens
 */

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
  const words = text.toLowerCase().match(/\b[\w']+\b/g);
  return words || [];
}

/**
 * Calculate lexical diversity (type-token ratio)
 * Returns a value between 0 and 1, where higher = more diverse vocabulary
 */
export function getLexicalDiversity(text: string): number {
  const tokens = tokenize(text);
  if (tokens.length === 0) return 0;

  const uniqueTokens = new Set(tokens);
  const ratio = uniqueTokens.size / tokens.length;

  return Math.round(ratio * 1000) / 1000; // Round to 3 decimal places
}
