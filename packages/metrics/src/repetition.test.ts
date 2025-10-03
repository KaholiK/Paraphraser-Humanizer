import { getRepetitionRatio } from './repetition';

describe('getRepetitionRatio', () => {
  it('should return 1 for empty text', () => {
    expect(getRepetitionRatio('')).toBe(1);
  });

  it('should return 1 for single word', () => {
    expect(getRepetitionRatio('hello')).toBe(1);
  });

  it('should return 1 for two different words', () => {
    const ratio = getRepetitionRatio('hello world');
    expect(ratio).toBe(1); // One unique bigram "hello world"
  });

  it('should detect repetition in repeated bigrams', () => {
    const ratio = getRepetitionRatio('the cat the cat the cat');
    // Bigrams: "the cat", "cat the", "the cat", "cat the", "the cat"
    // Unique: "the cat", "cat the" = 2
    // Total: 5
    // Ratio: 2/5 = 0.4
    expect(ratio).toBeCloseTo(0.4, 1);
  });

  it('should return high ratio for diverse text', () => {
    const ratio = getRepetitionRatio('Each word appears only once here');
    // All bigrams are unique
    expect(ratio).toBe(1);
  });

  it('should handle realistic text with some repetition', () => {
    const text = 'The quick brown fox jumps over the lazy dog and the cat runs fast.';
    const ratio = getRepetitionRatio(text);
    // "the" appears multiple times, creating some repeated bigrams
    expect(ratio).toBeGreaterThan(0.7);
    expect(ratio).toBeLessThanOrEqual(1);
  });

  it('should handle very repetitive text', () => {
    const text = 'very very very very very';
    const ratio = getRepetitionRatio(text);
    // Only one unique bigram "very very" repeated 4 times
    expect(ratio).toBeCloseTo(0.25, 1);
  });
});
