import { extractCitations, verifyCitations, restoreCitations } from './citationLock';

describe('extractCitations', () => {
  it('should extract bracketed number citations', () => {
    const text = 'This is a claim [1] and another claim [23].';
    const citations = extractCitations(text);
    expect(citations).toHaveLength(2);
    expect(citations[0].text).toBe('[1]');
    expect(citations[1].text).toBe('[23]');
  });

  it('should extract author-year citations', () => {
    const text = 'Research shows (Smith, 2020) that this is true (Jones 2019).';
    const citations = extractCitations(text);
    expect(citations).toHaveLength(2);
    expect(citations[0].text).toBe('(Smith, 2020)');
    expect(citations[1].text).toBe('(Jones 2019)');
  });

  it('should extract et al citations', () => {
    const text = 'Studies indicate (Smith et al., 2020) this finding.';
    const citations = extractCitations(text);
    expect(citations).toHaveLength(1);
    expect(citations[0].text).toBe('(Smith et al., 2020)');
  });

  it('should extract ampersand citations', () => {
    const text = 'According to research (Smith & Jones, 2020).';
    const citations = extractCitations(text);
    expect(citations).toHaveLength(1);
    expect(citations[0].text).toBe('(Smith & Jones, 2020)');
  });

  it('should extract superscript footnotes', () => {
    const text = 'This is a claim^1 and another^2.';
    const citations = extractCitations(text);
    expect(citations).toHaveLength(2);
    expect(citations[0].text).toBe('^1');
    expect(citations[1].text).toBe('^2');
  });

  it('should return empty array for text without citations', () => {
    const text = 'This is plain text without any citations.';
    const citations = extractCitations(text);
    expect(citations).toHaveLength(0);
  });

  it('should handle mixed citation styles', () => {
    const text = 'Some research [1] shows (Smith, 2020) that claims^2 are true.';
    const citations = extractCitations(text);
    expect(citations.length).toBeGreaterThan(0);
  });
});

describe('verifyCitations', () => {
  it('should return empty array if all citations are preserved', () => {
    const originalCitations = [
      { start: 10, end: 13, text: '[1]' },
      { start: 30, end: 43, text: '(Smith, 2020)' },
    ];
    const revisedText = 'This is a claim [1] and research (Smith, 2020) confirms it.';
    const missing = verifyCitations(originalCitations, revisedText);
    expect(missing).toHaveLength(0);
  });

  it('should identify missing citations', () => {
    const originalCitations = [
      { start: 10, end: 13, text: '[1]' },
      { start: 30, end: 43, text: '(Smith, 2020)' },
    ];
    const revisedText = 'This is a claim and research confirms it.';
    const missing = verifyCitations(originalCitations, revisedText);
    expect(missing).toHaveLength(2);
    expect(missing).toContain('[1]');
    expect(missing).toContain('(Smith, 2020)');
  });

  it('should identify partially missing citations', () => {
    const originalCitations = [
      { start: 10, end: 13, text: '[1]' },
      { start: 30, end: 43, text: '(Smith, 2020)' },
    ];
    const revisedText = 'This is a claim [1] and research confirms it.';
    const missing = verifyCitations(originalCitations, revisedText);
    expect(missing).toHaveLength(1);
    expect(missing).toContain('(Smith, 2020)');
  });
});

describe('restoreCitations', () => {
  it('should restore missing citations in context', () => {
    const originalText = 'This is a claim [1] that is important.';
    const revisedText = 'This is a claim that is important.';
    const citations = [{ start: 16, end: 19, text: '[1]' }];

    const restored = restoreCitations(originalText, revisedText, citations);
    expect(restored).toContain('[1]');
  });

  it('should not modify text if citations are present', () => {
    const originalText = 'This is a claim [1] that is important.';
    const revisedText = 'This is a claim [1] that matters.';
    const citations = [{ start: 16, end: 19, text: '[1]' }];

    const restored = restoreCitations(originalText, revisedText, citations);
    expect(restored).toBe(revisedText);
  });

  it('should handle multiple missing citations', () => {
    const originalText = 'First claim [1] and second claim [2].';
    const revisedText = 'First claim and second claim.';
    const citations = [
      { start: 12, end: 15, text: '[1]' },
      { start: 33, end: 36, text: '[2]' },
    ];

    const restored = restoreCitations(originalText, revisedText, citations);
    expect(restored).toContain('[1]');
    expect(restored).toContain('[2]');
  });
});
