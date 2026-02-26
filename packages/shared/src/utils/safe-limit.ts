export type SafeLimitOptions = {
  defaultValue?: number;
  min?: number;
  max?: number;
};

export function safeLimit(value: unknown, options: SafeLimitOptions = {}): number {
  const defaultValue = options.defaultValue ?? 20;
  const min = options.min ?? 1;
  const max = options.max ?? 100;

  const n =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(n)) return defaultValue;

  return Math.min(max, Math.max(min, Math.floor(n)));
}
