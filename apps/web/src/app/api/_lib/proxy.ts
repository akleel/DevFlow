import type { NextResponse } from 'next/server';

export const DEFAULT_UPSTREAM_TIMEOUT_MS = 8_000;

export const DEFAULT_PASSTHROUGH_HEADERS = [
  'x-forwarded-for',
  'x-real-ip',
  'cf-connecting-ip',
  'x-request-id',
  'user-agent',
] as const;

export function isTimeoutLikeError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.name === 'AbortError' || error.name === 'TimeoutError';
  }

  if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
    return error.name === 'AbortError' || error.name === 'TimeoutError';
  }

  return false;
}

export function buildPassthroughHeaders(
  req: Request,
  headerNames: readonly string[] = DEFAULT_PASSTHROUGH_HEADERS,
): Record<string, string> {
  const headers: Record<string, string> = {};

  for (const headerName of headerNames) {
    const value = req.headers.get(headerName);
    if (value) headers[headerName] = value;
  }

  return headers;
}

export function forwardSelectedHeaders(
  upstream: Response,
  res: NextResponse,
  headerNames: readonly string[],
): void {
  for (const headerName of headerNames) {
    const value = upstream.headers.get(headerName);
    if (value) res.headers.set(headerName, value);
  }
}

export async function fetchWithTimeout(
  input: string | URL,
  init: Omit<RequestInit, 'signal'>,
  timeoutMs: number = DEFAULT_UPSTREAM_TIMEOUT_MS,
): Promise<Response> {
  return fetch(input, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  });
}