export * from './citationLock';
export * from './systemPrompt';
export * from './types';
export { MockProvider } from './providers/mock';
export { OpenAIProvider } from './providers/openai';

import { MockProvider } from './providers/mock';
import { OpenAIProvider } from './providers/openai';
import { LLMProvider, RewriteInput, RewriteOutput } from './types';

/**
 * Factory function to create LLM provider
 */
export function createProvider(
  providerType: 'openai' | 'mock',
  config?: { apiKey?: string; model?: string; maxTokens?: number },
): LLMProvider {
  if (providerType === 'mock') {
    return new MockProvider();
  }

  if (providerType === 'openai') {
    if (!config?.apiKey) {
      throw new Error('OpenAI API key is required');
    }
    return new OpenAIProvider({
      apiKey: config.apiKey,
      model: config.model,
      maxTokens: config.maxTokens,
    });
  }

  throw new Error(`Unknown provider type: ${providerType}`);
}

/**
 * Main rewrite function
 */
export async function rewrite(input: RewriteInput, provider: LLMProvider): Promise<RewriteOutput> {
  return provider.rewrite(input);
}
