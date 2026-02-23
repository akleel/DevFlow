/**
 * apps/web/src/lib/cn.ts
 *
 * Tiny className joiner to avoid repeated `filter(Boolean).join(' ')`.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
