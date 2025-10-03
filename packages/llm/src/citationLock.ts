import { CitationSpan } from './types';

/**
 * Citation patterns to detect
 */
const CITATION_PATTERNS = [
  /\[\d+\]/g, // [1], [23], etc.
  /\(\w+,?\s+\d{4}\)/g, // (Author, 2020), (Smith 2020)
  /\(\w+\s+et\s+al\.,?\s+\d{4}\)/g, // (Smith et al., 2020)
  /\(\w+\s+&\s+\w+,?\s+\d{4}\)/g, // (Smith & Jones, 2020)
  /\b(ibid\.|op\.\s*cit\.|loc\.\s*cit\.)\b/gi, // Latin citation abbreviations
  /\^\d+/g, // Superscript footnote markers like ^1
];

/**
 * Extract citation spans from text
 */
export function extractCitations(text: string): CitationSpan[] {
  const citations: CitationSpan[] = [];

  for (const pattern of CITATION_PATTERNS) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      citations.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }
  }

  // Sort by start position
  citations.sort((a, b) => a.start - b.start);

  // Remove duplicates (overlapping citations)
  const uniqueCitations: CitationSpan[] = [];
  for (const citation of citations) {
    const isOverlapping = uniqueCitations.some(
      (existing) =>
        (citation.start >= existing.start && citation.start < existing.end) ||
        (citation.end > existing.start && citation.end <= existing.end),
    );
    if (!isOverlapping) {
      uniqueCitations.push(citation);
    }
  }

  return uniqueCitations;
}

/**
 * Verify that citations are preserved in revised text
 * Returns list of missing citations
 */
export function verifyCitations(originalCitations: CitationSpan[], revisedText: string): string[] {
  const missingCitations: string[] = [];

  for (const citation of originalCitations) {
    if (!revisedText.includes(citation.text)) {
      missingCitations.push(citation.text);
    }
  }

  return missingCitations;
}

/**
 * Restore citations in revised text if they were altered
 * This is a simple implementation that tries to restore citations by context
 */
export function restoreCitations(
  originalText: string,
  revisedText: string,
  citations: CitationSpan[],
): string {
  let restored = revisedText;

  for (const citation of citations) {
    if (!restored.includes(citation.text)) {
      // Try to find the context around the citation in the original
      const contextBefore = originalText.substring(
        Math.max(0, citation.start - 20),
        citation.start,
      );
      const contextAfter = originalText.substring(
        citation.end,
        Math.min(originalText.length, citation.end + 20),
      );

      // Look for similar context in revised text
      const contextPattern = new RegExp(
        contextBefore.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
          '.*?' +
          contextAfter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        's',
      );

      const match = contextPattern.exec(restored);
      if (match) {
        // Insert citation back into the matched context
        const insertPoint = match.index + contextBefore.length;
        restored =
          restored.substring(0, insertPoint) + citation.text + restored.substring(insertPoint);
      } else {
        // If we can't find context, append at the end with a note
        // This is a fallback and should be rare
        restored += ` ${citation.text}`;
      }
    }
  }

  return restored;
}
