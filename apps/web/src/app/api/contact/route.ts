import { NextResponse } from 'next/server';

import {
  buildPassthroughHeaders,
  fetchWithTimeout,
  forwardSelectedHeaders,
  isTimeoutLikeError,
} from '../_lib/proxy';

export const dynamic = 'force-dynamic';

const FORWARDED_HEADERS = [
  'x-request-id',
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
] as const;

export async function POST(req: Request) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { ok: false, error: 'Server misconfigured: missing API_URL' },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as unknown;

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

  const data = (await upstream.json().catch(() => ({
    ok: false,
    error: 'Invalid upstream response',
  }))) as unknown;

  const res = NextResponse.json(data, { status: upstream.status });
  forwardSelectedHeaders(upstream, res, FORWARDED_HEADERS);

  return res;
}
