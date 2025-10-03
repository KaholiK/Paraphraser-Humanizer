import { z } from 'zod';

/**
 * Controls for the revision process
 */
export const ReviseControlsSchema = z.object({
  formality: z.number().int().min(0).max(3).describe('Formality level: 0=casual, 3=formal'),
  concision: z.number().int().min(0).max(3).describe('Concision level: 0=verbose, 3=concise'),
  variation: z.number().int().min(0).max(3).describe('Variation level: 0=minimal, 3=maximal'),
  lockCitations: z.boolean().describe('Whether to preserve citations exactly'),
  keepTermsCsv: z.string().optional().describe('Comma-separated terms to keep unchanged'),
});

export type ReviseControls = z.infer<typeof ReviseControlsSchema>;

/**
 * Style profile for user preferences
 */
export const StyleProfileSchema = z.object({
  mode: z
    .string()
    .default('generic_academic')
    .describe('Style mode: generic_academic, scientific, humanities, etc.'),
  prefs: z.record(z.unknown()).optional().describe('Additional preferences as JSON'),
});

export type StyleProfile = z.infer<typeof StyleProfileSchema>;

/**
 * Request to revise text
 */
export const ReviseRequestSchema = z.object({
  original_text: z.string().min(1).max(50000).describe('Original text to revise'),
  controls: ReviseControlsSchema,
  profile: StyleProfileSchema.optional(),
});

export type ReviseRequest = z.infer<typeof ReviseRequestSchema>;

/**
 * Response from revision
 */
export const ReviseResponseSchema = z.object({
  revised_text: z.string().describe('The revised text'),
  notes: z
    .array(z.string())
    .min(4)
    .max(8)
    .describe('4-8 concise notes explaining changes'),
  summary: z.string().describe('One-line readability/variation summary'),
});

export type ReviseResponse = z.infer<typeof ReviseResponseSchema>;

/**
 * Metrics response
 */
export const MetricsResponseSchema = z.object({
  readability: z.number().describe('Flesch Reading Ease or FK Grade'),
  sentenceLengths: z.array(z.number()).describe('Array of sentence lengths in words'),
  lengthVariance: z.number().describe('Variance of sentence lengths'),
  repetitionRatio: z.number().min(0).max(1).describe('Unique bigrams / total bigrams'),
  passivePct: z.number().min(0).max(100).describe('Percentage of passive voice sentences'),
  lexicalDiversity: z.number().min(0).max(1).describe('Type-token ratio'),
});

export type MetricsResponse = z.infer<typeof MetricsResponseSchema>;

/**
 * Request to compute metrics
 */
export const MetricsRequestSchema = z.object({
  text: z.string().min(1).describe('Text to analyze'),
});

export type MetricsRequest = z.infer<typeof MetricsRequestSchema>;

/**
 * History query parameters
 */
export const HistoryQuerySchema = z.object({
  draft_id: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(100).default(10),
});

export type HistoryQuery = z.infer<typeof HistoryQuerySchema>;

/**
 * Revision entity
 */
export const RevisionSchema = z.object({
  id: z.string().uuid(),
  draft_id: z.string().uuid(),
  user_id: z.string().uuid(),
  revised_text: z.string(),
  controls_json: z.record(z.unknown()),
  metrics_json: z.record(z.unknown()),
  created_at: z.string().datetime(),
});

export type Revision = z.infer<typeof RevisionSchema>;

/**
 * Draft entity
 */
export const DraftSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  original_text: z.string(),
  created_at: z.string().datetime(),
});

export type Draft = z.infer<typeof DraftSchema>;

/**
 * Export request
 */
export const ExportRequestSchema = z.object({
  format: z.enum(['docx', 'pdf', 'json']),
  revision_ids: z.array(z.string().uuid()).optional(),
  include_metrics: z.boolean().default(true),
});

export type ExportRequest = z.infer<typeof ExportRequestSchema>;

/**
 * Diff response
 */
export const DiffResponseSchema = z.object({
  original: z.string(),
  revised: z.string(),
  changes: z.array(
    z.object({
      type: z.enum(['add', 'remove', 'unchanged']),
      value: z.string(),
    }),
  ),
});

export type DiffResponse = z.infer<typeof DiffResponseSchema>;
