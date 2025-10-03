import { LLMProvider, RewriteInput, RewriteOutput } from '../types';

/**
 * Mock provider for testing
 * Performs deterministic transformations
 */
export class MockProvider implements LLMProvider {
  /**
   * Deterministic rewrite for testing
   */
  async rewrite(input: RewriteInput): Promise<RewriteOutput> {
    const { original_text, controls } = input;

    // Simple transformation: add prefix based on formality
    const formalityPrefixes = ['Hey! ', 'Here is ', 'Consider: ', 'Note that '];
    const prefix = formalityPrefixes[controls.formality] || '';

    // Apply concision by truncating (very crude)
    let revised = prefix + original_text;
    if (controls.concision > 2) {
      // Simulate concision by taking first 80% of text
      revised = revised.substring(0, Math.floor(revised.length * 0.8)) + '...';
    }

    // Generate notes
    const notes = [
      `Applied formality level ${controls.formality}`,
      `Applied concision level ${controls.concision}`,
      `Applied variation level ${controls.variation}`,
      'This is a mock transformation for testing',
    ];

    if (controls.lockCitations) {
      notes.push('Citations were preserved (mock)');
    }

    const summary = `Mock revision with formality=${controls.formality}, concision=${controls.concision}, variation=${controls.variation}`;

    return {
      revised_text: revised,
      notes,
      summary,
    };
  }
}
