import { getLexicalDiversity } from './lexicalDiversity';

describe('getLexicalDiversity', () => {
  it('should return 0 for empty text', () => {
    expect(getLexicalDiversity('')).toBe(0);
  });

  it('should return 1 for text with all unique words', () => {
    const text = 'each word appears only once';
    const diversity = getLexicalDiversity(text);
    expect(diversity).toBe(1);
  });

  it('should return lower value for repetitive text', () => {
    const text = 'the the the the';
    const diversity = getLexicalDiversity(text);
    // 1 unique word / 4 total = 0.25
    expect(diversity).toBe(0.25);
  });

  it('should calculate diversity correctly for mixed text', () => {
    const text = 'the cat and the dog';
    const diversity = getLexicalDiversity(text);
    // Unique: the, cat, and, dog = 4
    // Total: 5 (the appears twice)
    // 4/5 = 0.8
    expect(diversity).toBe(0.8);
  });

  it('should handle contractions correctly', () => {
    const text = "I'm happy and you're happy";
    const diversity = getLexicalDiversity(text);
    expect(diversity).toBeGreaterThan(0);
    expect(diversity).toBeLessThanOrEqual(1);
  });

  it('should be case-insensitive', () => {
    const text = 'The cat and the dog';
    const diversity = getLexicalDiversity(text);
    // "The" and "the" should be counted as same word
    expect(diversity).toBe(0.8); // 4 unique / 5 total
  });

  it('should handle realistic academic text', () => {
    const text =
      'This research investigates the impact of various factors. The study examines multiple variables and their relationships.';
    const diversity = getLexicalDiversity(text);
    expect(diversity).toBeGreaterThan(0.7); // Should be fairly diverse
    expect(diversity).toBeLessThanOrEqual(1);
  });

  it('should handle very repetitive text', () => {
    const text = 'very very very very very very very very';
    const diversity = getLexicalDiversity(text);
    expect(diversity).toBe(0.125); // 1/8
  });
});
