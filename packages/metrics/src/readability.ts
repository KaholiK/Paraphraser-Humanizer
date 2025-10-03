/**
 * Readability metrics
 * Formula: Flesch Reading Ease = 206.835 − 1.015*(words/sentences) − 84.6*(syllables/words)
 */

/**
 * Count syllables in a word using a simple heuristic
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;

  // Remove non-alphabetic characters
  word = word.replace(/[^a-z]/g, '');
  if (word.length === 0) return 0;

  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  let syllableCount = vowelGroups ? vowelGroups.length : 0;

  // Adjust for silent 'e' at the end
  if (word.endsWith('e') && syllableCount > 1) {
    syllableCount--;
  }

  // Ensure at least 1 syllable
  return Math.max(1, syllableCount);
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  const words = text.match(/\b[\w']+\b/g);
  return words ? words.length : 0;
}

/**
 * Count total syllables in text
 */
function countTotalSyllables(text: string): number {
  const words = text.match(/\b[\w']+\b/g);
  if (!words) return 0;
  return words.reduce((total, word) => total + countSyllables(word), 0);
}

/**
 * Calculate Flesch Reading Ease score
 * Score: 90-100 = Very Easy, 80-89 = Easy, 70-79 = Fairly Easy,
 *        60-69 = Standard, 50-59 = Fairly Difficult, 30-49 = Difficult, 0-29 = Very Confusing
 */
export function getReadability(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  const sentences = getSentenceCount(text);
  const words = countWords(text);
  const syllables = countTotalSyllables(text);

  if (sentences === 0 || words === 0) return 0;

  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Count sentences in text
 */
function getSentenceCount(text: string): number {
  // Split on sentence endings: . ! ?
  // Handle common abbreviations (Dr., Mr., Mrs., etc.)
  const sentences = text
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .filter((s) => {
      const trimmed = s.trim();
      // Filter out single letters or common abbreviations
      return trimmed.length > 0 && !/^[A-Z]\.?$/.test(trimmed);
    });

  return Math.max(1, sentences.length);
}
