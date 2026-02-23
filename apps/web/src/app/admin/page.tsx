'use client';

import type { AdminContactItem, AdminContactsResponse } from '@devflow/shared';
import { useEffect, useState } from 'react';

import { isRecord } from '../../lib/guards';

function isAdminContactItem(value: unknown): value is AdminContactItem {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.message === 'string'
  );
}

function parseAdminContactsResponse(value: unknown): AdminContactsResponse {
  if (!isRecord(value)) {
    return { ok: false, error: 'Invalid response' };
  }

  if (value.ok === true) {
    const itemsRaw = value.items;
    const items = Array.isArray(itemsRaw) ? itemsRaw.filter(isAdminContactItem) : [];
    return { ok: true, items };
  }

  if (value.ok === false) {
    const error = typeof value.error === 'string' ? value.error : 'Request failed';
    const requestId = typeof value.requestId === 'string' ? value.requestId : undefined;
    return { ok: false, error, requestId };
  }

  return { ok: false, error: 'Invalid response' };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function AdminPage() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN === 'true';

  // Hooks must always be called in the same order on every render.
  const [gate, setGate] = useState<string>('');
  const [items, setItems] = useState<AdminContactItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!enabled) return;

    const saved = sessionStorage.getItem('devflow_admin_gate');
    if (saved) setGate(saved);
  }, [enabled]);

  async function load() {
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/admin/contacts?limit=50', {
        headers: {
          Accept: 'application/json',
          'x-admin-gate': gate,
        },
        cache: 'no-store',
      });

      const raw: unknown = await res.json().catch(() => ({}));
      const data = parseAdminContactsResponse(raw);

      if (!res.ok || data.ok === false) {
        const msg =
          data.ok === false
            ? data.error
            : `Request failed (${res.status} ${res.statusText})`;

        const reqId =
          (data.ok === false ? data.requestId : undefined) ??
          res.headers.get('x-request-id') ??
          undefined;

        throw new Error(reqId ? `${msg} (requestId: ${reqId})` : msg);
      }

      setItems(data.items);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  function unlock() {
    sessionStorage.setItem('devflow_admin_gate', gate);
    void load();
  }

  const isLocked = !gate;

  if (!enabled) {
    return (
      <main className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="rounded-md border p-4">
          <p className="text-sm">
            Admin is disabled. Set <code>NEXT_PUBLIC_ENABLE_ADMIN=true</code> (and{' '}
            <code>ENABLE_ADMIN=true</code> for the server proxy) to enable it locally.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-gray-600">Dev-only admin panel</p>
      </header>

      <section className="rounded-md border p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-medium">Admin gate</label>
          <input
            value={gate}
            onChange={(e) => setGate(e.target.value)}
            placeholder="Enter gate"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <button
            onClick={unlock}
            className="rounded-md border px-4 py-2 font-medium disabled:opacity-50"
            disabled={!gate || status === 'loading'}
          >
            {status === 'loading' ? 'Loading…' : 'Unlock'}
          </button>

          <button
            onClick={load}
            className="rounded-md border px-4 py-2 font-medium disabled:opacity-50"
            disabled={isLocked || status === 'loading'}
          >
            Refresh
          </button>
        </div>

        <p className="text-xs text-gray-600">
          Stored in sessionStorage as <code>devflow_admin_gate</code>.
        </p>
      </section>

      {status === 'error' && (
        <div className="rounded-md border p-4">
          <p className="text-sm">❌ {error}</p>
        </div>
      )}

      <section className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-md border p-4">
            <p className="text-sm">
              {isLocked ? 'Locked. Enter gate to load items.' : 'No submissions yet.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-md border p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">
                    {item.name}{' '}
                    <span className="text-gray-600 font-normal">({item.email})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                <p className="text-sm whitespace-pre-wrap">{item.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
