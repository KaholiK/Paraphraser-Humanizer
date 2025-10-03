import OpenAI from 'openai';

import { extractCitations, restoreCitations, verifyCitations } from '../citationLock';
import { SYSTEM_PROMPT } from '../systemPrompt';
import { LLMProvider, OpenAIConfig, RewriteInput, RewriteOutput } from '../types';

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;
  private maxTokens: number;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'gpt-4';
    this.maxTokens = config.maxTokens || 2000;
  }

  /**
   * Build user prompt with controls
   */
  private buildUserPrompt(input: RewriteInput): string {
    const { original_text, controls, profile } = input;

    let prompt = `Original text:\n\n${original_text}\n\n`;
    prompt += `Instructions:\n`;

    // Formality mapping (0=casual, 1=slightly formal, 2=formal, 3=very formal)
    const formalityLevels = [
      'Keep the tone casual and conversational',
      'Use a slightly formal tone suitable for general academic writing',
      'Use a formal tone appropriate for scholarly publications',
      'Use a very formal tone for prestigious journal submissions',
    ];
    prompt += `- Formality: ${formalityLevels[controls.formality]}\n`;

    // Concision mapping (0=verbose ok, 1=slightly concise, 2=concise, 3=very concise)
    const concisionLevels = [
      'Maintain or expand on ideas; verbosity is acceptable',
      'Slightly trim unnecessary words while preserving meaning',
      'Be concise; remove redundancy and wordiness',
      'Be very concise; use minimal words to convey maximum meaning',
    ];
    prompt += `- Concision: ${concisionLevels[controls.concision]}\n`;

    // Variation mapping (0=minimal, 1=some, 2=good, 3=maximum)
    const variationLevels = [
      'Minimal structural variation is acceptable',
      'Add some variety to sentence structure and length',
      'Vary sentence structure and length significantly',
      'Maximize variation in sentence structure, length, and phrasing',
    ];
    prompt += `- Variation: ${variationLevels[controls.variation]}\n`;

    // Citation lock
    if (controls.lockCitations) {
      prompt += `- CRITICAL: Preserve all citations, references, and bracketed numbers EXACTLY as they appear. Do not modify or remove them.\n`;
    }

    // Keep terms
    if (controls.keepTermsCsv) {
      const terms = controls.keepTermsCsv.split(',').map((t) => t.trim());
      prompt += `- Keep these terms unchanged: ${terms.join(', ')}\n`;
    }

    // Profile/mode
    if (profile?.mode) {
      prompt += `- Writing mode: ${profile.mode}\n`;
    }

    prompt += `\nProvide your response in this exact format:\n\n`;
    prompt += `REVISED TEXT:\n[Your revised text here]\n\n`;
    prompt += `NOTES:\n- [Note 1]\n- [Note 2]\n...\n\n`;
    prompt += `SUMMARY:\n[One-line summary]`;

    return prompt;
  }

  /**
   * Parse LLM response
   */
  private parseResponse(responseText: string): {
    revised_text: string;
    notes: string[];
    summary: string;
  } {
    // Extract sections
    const revisedMatch = responseText.match(/REVISED TEXT:\s*([\s\S]*?)(?=\n\nNOTES:|\n\n---)/i);
    const notesMatch = responseText.match(/NOTES:\s*([\s\S]*?)(?=\n\nSUMMARY:|\n\n---)/i);
    const summaryMatch = responseText.match(/SUMMARY:\s*(.*?)(?:\n|$)/i);

    const revised_text = revisedMatch ? revisedMatch[1].trim() : '';
    const notesSection = notesMatch ? notesMatch[1].trim() : '';
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    // Parse notes (bullet points)
    const notes = notesSection
      .split('\n')
      .map((line) => line.replace(/^[\s-•*]+/, '').trim())
      .filter((line) => line.length > 0);

    return { revised_text, notes, summary };
  }

  /**
   * Map variation level to temperature
   */
  private getTemperature(variation: number): number {
    // 0 -> 0.3, 1 -> 0.5, 2 -> 0.7, 3 -> 0.9
    return 0.3 + variation * 0.2;
  }

  /**
   * Rewrite text using OpenAI
   */
  async rewrite(input: RewriteInput): Promise<RewriteOutput> {
    const { original_text, controls } = input;

    // Extract citations if lock is enabled
    const citations = controls.lockCitations ? extractCitations(original_text) : [];

    // Build prompt
    const userPrompt = this.buildUserPrompt(input);

    // Call OpenAI API
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: this.getTemperature(controls.variation),
      max_tokens: this.maxTokens,
    });

    const responseText = response.choices[0]?.message?.content || '';

    // Parse response
    const {
      revised_text: parsedText,
      notes: parsedNotes,
      summary,
    } = this.parseResponse(responseText);
    let revised_text = parsedText;
    let notes = parsedNotes;

    // Verify and restore citations if locked
    if (controls.lockCitations && citations.length > 0) {
      const missingCitations = verifyCitations(citations, revised_text);

      if (missingCitations.length > 0) {
        // Attempt to restore
        revised_text = restoreCitations(original_text, revised_text, citations);

        // Add warning note
        notes.push(
          `⚠️ Citation preservation: Some citations were altered and have been restored: ${missingCitations.join(', ')}`,
        );
      }
    }

    // Ensure we have 4-8 notes
    if (notes.length < 4) {
      notes.push('Improved overall clarity and flow');
      while (notes.length < 4) {
        notes.push('Enhanced readability');
      }
    } else if (notes.length > 8) {
      notes = notes.slice(0, 8);
    }

    return { revised_text, notes, summary };
  }
}
