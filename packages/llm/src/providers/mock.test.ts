import { MockProvider } from './mock';

describe('MockProvider', () => {
  let provider: MockProvider;

  beforeEach(() => {
    provider = new MockProvider();
  });

  it('should return revised text with correct structure', async () => {
    const input = {
      original_text: 'This is a test.',
      controls: {
        formality: 1,
        concision: 1,
        variation: 1,
        lockCitations: false,
      },
    };

    const result = await provider.rewrite(input);

    expect(result).toHaveProperty('revised_text');
    expect(result).toHaveProperty('notes');
    expect(result).toHaveProperty('summary');
    expect(result.notes.length).toBeGreaterThanOrEqual(4);
  });

  it('should apply formality level', async () => {
    const input = {
      original_text: 'Test text.',
      controls: {
        formality: 0,
        concision: 0,
        variation: 0,
        lockCitations: false,
      },
    };

    const result = await provider.rewrite(input);
    expect(result.revised_text).toContain('Hey!');
  });

  it('should include citation note when lockCitations is true', async () => {
    const input = {
      original_text: 'This is a claim [1].',
      controls: {
        formality: 1,
        concision: 1,
        variation: 1,
        lockCitations: true,
      },
    };

    const result = await provider.rewrite(input);
    const hasCitationNote = result.notes.some((note) => note.includes('Citations'));
    expect(hasCitationNote).toBe(true);
  });

  it('should apply concision by truncating text', async () => {
    const longText = 'A'.repeat(100);
    const input = {
      original_text: longText,
      controls: {
        formality: 0,
        concision: 3,
        variation: 0,
        lockCitations: false,
      },
    };

    const result = await provider.rewrite(input);
    expect(result.revised_text.length).toBeLessThan(longText.length + 10);
  });

  it('should always return 4+ notes', async () => {
    const input = {
      original_text: 'Short text.',
      controls: {
        formality: 2,
        concision: 2,
        variation: 2,
        lockCitations: false,
      },
    };

    const result = await provider.rewrite(input);
    expect(result.notes.length).toBeGreaterThanOrEqual(4);
  });

  it('should include summary with control values', async () => {
    const input = {
      original_text: 'Test.',
      controls: {
        formality: 2,
        concision: 1,
        variation: 3,
        lockCitations: false,
      },
    };

    const result = await provider.rewrite(input);
    expect(result.summary).toContain('formality=2');
    expect(result.summary).toContain('concision=1');
    expect(result.summary).toContain('variation=3');
  });
});
