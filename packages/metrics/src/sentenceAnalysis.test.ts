import { getSentenceLengths, getLengthVariance } from './sentenceAnalysis';

describe('getSentenceLengths', () => {
  it('should return empty array for empty text', () => {
    expect(getSentenceLengths('')).toEqual([]);
    expect(getSentenceLengths('   ')).toEqual([]);
  });

  it('should calculate sentence lengths correctly', () => {
    const text = 'This is five words. This sentence has six words total.';
    const lengths = getSentenceLengths(text);
    expect(lengths).toEqual([4, 6]);
  });

  it('should handle single sentence', () => {
    const text = 'One two three four.';
    const lengths = getSentenceLengths(text);
    expect(lengths).toEqual([4]);
  });

  it('should handle different punctuation', () => {
    const text = 'Is this a question? Yes! This is an exclamation.';
    const lengths = getSentenceLengths(text);
    expect(lengths.length).toBe(3);
  });

  it('should handle abbreviations correctly', () => {
    const text = 'Dr. Smith works here. He is a scientist.';
    const lengths = getSentenceLengths(text);
    expect(lengths).toEqual([4, 4]);
  });
});

describe('getLengthVariance', () => {
  it('should return 0 for empty array', () => {
    expect(getLengthVariance([])).toBe(0);
  });

  it('should return 0 for single value', () => {
    expect(getLengthVariance([5])).toBe(0);
  });

  it('should return 0 for uniform lengths', () => {
    expect(getLengthVariance([5, 5, 5, 5])).toBe(0);
  });

  it('should calculate variance for varying lengths', () => {
    const lengths = [5, 10, 15];
    const variance = getLengthVariance(lengths);
    // Variance of [5, 10, 15] with mean 10 = ((5-10)^2 + (10-10)^2 + (15-10)^2) / 3 = 50/3 ≈ 16.67
    expect(variance).toBeCloseTo(16.67, 1);
  });

  it('should handle larger variance', () => {
    const lengths = [1, 20, 1, 20];
    const variance = getLengthVariance(lengths);
    expect(variance).toBeGreaterThan(50);
  });
});
