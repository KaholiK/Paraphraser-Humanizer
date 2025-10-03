import { getReadability } from './readability';

describe('getReadability', () => {
  it('should return 0 for empty text', () => {
    expect(getReadability('')).toBe(0);
    expect(getReadability('   ')).toBe(0);
  });

  it('should calculate Flesch Reading Ease for simple text', () => {
    const simpleText = 'The cat sat on the mat. It was a sunny day.';
    const score = getReadability(simpleText);
    // Simple, short sentences with simple words should score high (easy to read)
    expect(score).toBeGreaterThan(70);
  });

  it('should calculate lower score for complex text', () => {
    const complexText =
      'The multifaceted paradigm of contemporary epistemological frameworks necessitates comprehensive investigation.';
    const score = getReadability(complexText);
    // Complex words and long sentence should score lower (harder to read)
    expect(score).toBeLessThan(50);
  });

  it('should handle text with multiple sentences', () => {
    const text =
      'This is a sentence. Here is another one. And a third for good measure.';
    const score = getReadability(text);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should handle text with abbreviations', () => {
    const text = 'Dr. Smith works at the lab. He studies DNA.';
    const score = getReadability(text);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should return value between 0 and 100', () => {
    const texts = [
      'Hi.',
      'The quick brown fox jumps over the lazy dog.',
      'Notwithstanding the aforementioned considerations, the implementation of systematically comprehensive methodological approaches remains paramount.',
    ];

    texts.forEach((text) => {
      const score = getReadability(text);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
