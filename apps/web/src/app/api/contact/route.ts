import { NextResponse } from 'next/server';

import {
  buildPassthroughHeaders,
  fetchWithTimeout,
  forwardSelectedHeaders,
  isTimeoutLikeError,
} from '../_lib/proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FORWARDED_HEADERS = [
  'x-request-id',
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
] as const;

const MAX_BODY_BYTES = 32_768;

function readContentLength(req: Request): number | null {
  const v = req.headers.get('content-length');
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.floor(n);
}

export async function POST(req: Request) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { ok: false, error: 'Server misconfigured: missing API_URL' },
      { status: 500 },
    );
  }

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json(
      { ok: false, error: 'Expected application/json' },
      { status: 415 },
    );
  }

  const len = readContentLength(req);
  if (len !== null && len > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'Request body too large' },
      { status: 413 },
    );
  }

  const body: unknown = await req.json().catch(() => null);

  if (body === null) {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const passthroughHeaders = buildPassthroughHeaders(req);

  let upstream: Response;

  try {
    upstream = await fetchWithTimeout(`${apiUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...passthroughHeaders,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch (error: unknown) {
    if (isTimeoutLikeError(error)) {
      return NextResponse.json(
        { ok: false, error: 'Upstream API timeout' },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { ok: false, error: 'Upstream API unavailable' },
      { status: 502 },
    );
  }

  const data: unknown = await upstream.json().catch(() => ({
    ok: false,
    error: 'Invalid upstream response',
  }));

  const res = NextResponse.json(data, { status: upstream.status });
  forwardSelectedHeaders(upstream, res, FORWARDED_HEADERS);

  return res;
}
