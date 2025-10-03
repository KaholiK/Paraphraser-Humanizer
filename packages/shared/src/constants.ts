/**
 * Banned phrases that indicate attempts to evade detection or violate academic policies.
 * These are case-insensitive matches.
 */
export const BANNED_PHRASES = [
  'bypass detector',
  'evade detection',
  'cheat turnitin',
  'make undetectable',
  'beat ai detector',
] as const;

/**
 * Feature flags for the application
 */
export interface FeatureFlags {
  driverMode: boolean;
}

/**
 * Default rate limits
 */
export const DEFAULT_RATE_LIMITS = {
  perUserPerDay: 500,
} as const;
