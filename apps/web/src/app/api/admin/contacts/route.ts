import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PASSTHROUGH_HEADERS = [
  'x-forwarded-for',
  'x-real-ip',
  'cf-connecting-ip',
  'x-request-id',
  'user-agent',
] as const;

function safeLimit(value: string | null) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 20;
  return Math.min(100, Math.max(1, Math.floor(n)));
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

  const provided = req.headers.get('x-admin-gate') ?? '';

  if (provided !== gate) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = safeLimit(url.searchParams.get('limit'));

  const passthrough: Record<string, string> = {};
  for (const h of PASSTHROUGH_HEADERS) {
    const v = req.headers.get(h);
    if (v) passthrough[h] = v;
  }

  const upstream = await fetch(`${apiUrl}/api/admin/contacts?limit=${limit}`, {
    headers: {
      'x-admin-token': adminToken,
      Accept: 'application/json',
      ...passthrough,
    },
    cache: 'no-store',
  });

  const data = (await upstream.json().catch(() => ({}))) as unknown;
  const res = NextResponse.json(data, { status: upstream.status });

  const requestId = upstream.headers.get('x-request-id');
  if (requestId) res.headers.set('x-request-id', requestId);

  return res;
}
