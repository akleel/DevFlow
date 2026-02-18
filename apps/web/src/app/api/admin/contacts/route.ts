import { NextResponse } from "next/server";

function safeLimit(value: string | null) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 20;
  return Math.min(100, Math.max(1, Math.floor(n)));
}

export async function GET(req: Request) {
  const apiUrl = process.env.API_URL;
  const adminToken = process.env.ADMIN_TOKEN;

  const gate = process.env.ADMIN_GATE;
  if (!gate) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const provided = req.headers.get("x-admin-gate") ?? "";
  if (provided !== gate) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!apiUrl || !adminToken) {
    return NextResponse.json(
      {
        ok: false,
        error: "Server misconfigured: missing API_URL or ADMIN_TOKEN",
      },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const limit = safeLimit(url.searchParams.get("limit"));

  const upstream = await fetch(`${apiUrl}/api/admin/contacts?limit=${limit}`, {
    headers: {
      "x-admin-token": adminToken,
      Accept: "application/json",
    },
    // Don’t cache admin data in Next
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => ({}));

  const res = NextResponse.json(data, { status: upstream.status });

  // Forward request id for debugging (if present)
  const requestId = upstream.headers.get("x-request-id");
  if (requestId) res.headers.set("x-request-id", requestId);

  return res;
}
