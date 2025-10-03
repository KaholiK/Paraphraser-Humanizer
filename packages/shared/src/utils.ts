/**
 * Site-safe string utilities
 */

/**
 * Sanitize a string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Check if text contains any banned phrases (case-insensitive)
 */
export function containsBannedPhrase(text: string, bannedPhrases: readonly string[]): boolean {
  const lowerText = text.toLowerCase();
  return bannedPhrases.some((phrase) => lowerText.includes(phrase.toLowerCase()));
}

/**
 * Truncate string to a maximum length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Parse CSV string into array
 */
export function parseCsv(csv: string): string[] {
  return csv
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') return date;
  return date.toISOString();
}
