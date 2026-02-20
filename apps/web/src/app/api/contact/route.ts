import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FORWARDED_HEADERS = [
  'x-request-id',
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
] as const;

const PASSTHROUGH_HEADERS = [
  'x-forwarded-for',
  'x-real-ip',
  'cf-connecting-ip',
  'x-request-id',
  'user-agent',
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

  const passthrough: Record<string, string> = {};
  for (const h of PASSTHROUGH_HEADERS) {
    const v = req.headers.get(h);
    if (v) passthrough[h] = v;
  }

  const upstream = await fetch(`${apiUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...passthrough,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = (await upstream.json().catch(() => ({}))) as unknown;
  const res = NextResponse.json(data, { status: upstream.status });

  for (const key of FORWARDED_HEADERS) {
    const v = upstream.headers.get(key);
    if (v) res.headers.set(key, v);
  }

  return res;
}
