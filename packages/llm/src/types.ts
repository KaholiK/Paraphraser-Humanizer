import { ReviseControls, StyleProfile } from '@paraphraser-humanizer/shared';

/**
 * Input to the rewrite function
 */
export interface RewriteInput {
  original_text: string;
  controls: ReviseControls;
  profile?: StyleProfile;
}

/**
 * Output from the rewrite function
 */
export interface RewriteOutput {
  revised_text: string;
  notes: string[];
  summary: string;
}

/**
 * LLM Provider interface
 */
export interface LLMProvider {
  rewrite(input: RewriteInput): Promise<RewriteOutput>;
}

/**
 * Configuration for OpenAI provider
 */
export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

/**
 * Citation span (for citation locking)
 */
export interface CitationSpan {
  start: number;
  end: number;
  text: string;
}
