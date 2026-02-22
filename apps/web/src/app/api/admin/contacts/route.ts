import { NextResponse } from 'next/server';

import {
  buildPassthroughHeaders,
  fetchWithTimeout,
  forwardSelectedHeaders,
  isTimeoutLikeError,
} from '../../_lib/proxy';

export const dynamic = 'force-dynamic';

const FORWARDED_HEADERS = ['x-request-id'] as const;

function safeLimit(value: string | null): number {
  const n = Number(value);

  if (!Number.isFinite(n)) return 20;

  return Math.min(100, Math.max(1, Math.floor(n)));
}

function buildUpstreamUrl(apiUrl: string, limit: number): string | null {
  try {
    const url = new URL('/api/admin/contacts', apiUrl);
    url.searchParams.set('limit', String(limit));
    return url.toString();
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const enabled = process.env.ENABLE_ADMIN === 'true';

  // Hide the endpoint entirely unless explicitly enabled.
  if (!enabled) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }

  const apiUrl = process.env.API_URL;
  const adminToken = process.env.ADMIN_TOKEN;
  const gate = process.env.ADMIN_GATE;

  if (!apiUrl || !adminToken || !gate) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Server misconfigured: missing API_URL, ADMIN_TOKEN, or ADMIN_GATE',
      },
      { status: 500 },
    );
  }

  const providedGate = req.headers.get('x-admin-gate') ?? '';

  if (providedGate !== gate) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const requestUrl = new URL(req.url);
  const limit = safeLimit(requestUrl.searchParams.get('limit'));

  const upstreamUrl = buildUpstreamUrl(apiUrl, limit);

  if (!upstreamUrl) {
    return NextResponse.json(
      { ok: false, error: 'Server misconfigured: invalid API_URL' },
      { status: 500 },
    );
  }

  const passthroughHeaders = buildPassthroughHeaders(req);

  let upstream: Response;

  try {
    upstream = await fetchWithTimeout(upstreamUrl, {
      method: 'GET',
      headers: {
        'x-admin-token': adminToken,
        Accept: 'application/json',
        ...passthroughHeaders,
      },
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
