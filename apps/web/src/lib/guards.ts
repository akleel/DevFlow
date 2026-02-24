/**
 * apps/web/src/lib/guards.ts
 *
 * Small runtime type guards for parsing unknown JSON safely.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
