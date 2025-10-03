/**
 * Passive voice detection
 * Heuristic: detect "be" verb + past participle pattern
 */

/**
 * Common "be" verb forms
 */
const BE_VERBS = [
  'is',
  'are',
  'was',
  'were',
  'be',
  'being',
  'been',
  'am',
  'has been',
  'have been',
  'had been',
  'will be',
  'shall be',
];

/**
 * Common irregular past participles
 */
const IRREGULAR_PARTICIPLES = [
  'been',
  'done',
  'gone',
  'seen',
  'taken',
  'given',
  'made',
  'known',
  'written',
  'thrown',
  'broken',
  'spoken',
  'chosen',
  'driven',
  'eaten',
  'fallen',
  'forgotten',
  'hidden',
  'ridden',
  'risen',
  'shown',
  'stolen',
  'worn',
  'torn',
  'born',
  'beaten',
  'bitten',
  'drawn',
  'flown',
  'grown',
  'shaken',
  'swollen',
  'frozen',
];

/**
 * Exception patterns that might look passive but aren't
 */
const EXCEPTIONS = ['interested', 'surprised', 'concerned', 'used to', 'supposed to'];

/**
 * Check if a word is a past participle
 */
function isPastParticiple(word: string): boolean {
  const lowerWord = word.toLowerCase();

  // Check irregular participles
  if (IRREGULAR_PARTICIPLES.includes(lowerWord)) {
    return true;
  }

  // Check regular patterns (ed/en endings)
  if (/ed$|en$/.test(lowerWord)) {
    return true;
  }

  return false;
}

/**
 * Split text into sentences
 */
function splitIntoSentences(text: string): string[] {
  if (!text || text.trim().length === 0) return [];

  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return sentences;
}

/**
 * Check if a sentence contains passive voice
 */
function isPassiveVoice(sentence: string): boolean {
  const lowerSentence = sentence.toLowerCase();

  // Check for be verb
  const hasBeVerb = BE_VERBS.some((verb) => {
    const pattern = new RegExp(`\\b${verb}\\b`, 'i');
    return pattern.test(lowerSentence);
  });

  if (!hasBeVerb) return false;

  // Check for past participle after be verb
  const words = sentence.match(/\b[\w']+\b/g) || [];
  for (let i = 0; i < words.length - 1; i++) {
    const word = words[i].toLowerCase();
    const nextWord = words[i + 1];

    if (BE_VERBS.includes(word) && isPastParticiple(nextWord)) {
      // Check exceptions
      const isException = EXCEPTIONS.some((exc) =>
        lowerSentence.includes(exc.toLowerCase()),
      );
      if (!isException) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Calculate percentage of passive voice sentences
 */
export function getPassiveVoicePct(text: string): number {
  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) return 0;

  const passiveSentences = sentences.filter(isPassiveVoice).length;
  const percentage = (passiveSentences / sentences.length) * 100;

  return Math.round(percentage * 10) / 10; // Round to 1 decimal place
}
