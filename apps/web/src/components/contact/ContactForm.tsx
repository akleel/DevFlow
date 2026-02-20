'use client';

import type { ContactRequest } from '@devflow/shared';
import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

type ErrorPayload = {
  error?: string;
  requestId?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readErrorPayload(value: unknown): ErrorPayload {
  if (!isRecord(value)) return {};

  const error = typeof value.error === 'string' ? value.error : undefined;
  const requestId = typeof value.requestId === 'string' ? value.requestId : undefined;

  return { error, requestId };
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');

  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  function formatWait(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m <= 0) return `${s}s`;
    return `${m}m ${s}s`;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    // Clear any previous timer (e.g. user submits again quickly)
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    const form = new FormData(e.currentTarget);

    const payload: ContactRequest = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      message: String(form.get('message') ?? ''),
      company: String(form.get('company') ?? ''), // honeypot
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const raw = (await res.json().catch(() => ({}))) as unknown;
      const errPayload = readErrorPayload(raw);

      if (!res.ok) {
        if (res.status === 429) {
          const reset = res.headers.get('x-ratelimit-reset');

          // x-ratelimit-reset can be either:
          // - seconds until reset (e.g. "15")
          // - unix timestamp seconds (e.g. "1771404456")
          let secondsLeft: number | null = null;

          if (reset) {
            const n = Number(reset);
            if (Number.isFinite(n)) {
              if (n > 10_000_000) {
                const nowSec = Math.floor(Date.now() / 1000);
                secondsLeft = Math.max(0, Math.ceil(n - nowSec));
              } else {
                secondsLeft = Math.max(0, Math.ceil(n));
              }
            }
          }

          const msg =
            secondsLeft !== null
              ? `Too many messages sent. Try again in ${formatWait(secondsLeft)}.`
              : 'Too many messages sent. Please wait a bit and try again.';

          throw new Error(msg);
        }

        const requestId =
          errPayload.requestId ?? res.headers.get('x-request-id') ?? undefined;

        const msg =
          errPayload.error ?? `Request failed (${res.status} ${res.statusText})`;
        throw new Error(requestId ? `${msg} (requestId: ${requestId})` : msg);
      }

      setStatus('success');
      (e.target as HTMLFormElement).reset();

      resetTimerRef.current = window.setTimeout(() => {
        setStatus('idle');
        resetTimerRef.current = null;
      }, 3000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4">
      {/* Honeypot field: bots fill it, humans never see it */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="space-y-2">
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-md border px-3 py-2"
          placeholder="you@company.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Message</label>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Tell us what you need help with…"
          rows={6}
        />
      </div>

      <button
        disabled={status === 'sending'}
        className="rounded-md border px-4 py-2 font-medium disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'success' && (
        <p className="text-sm">✅ Message sent. We’ll get back to you.</p>
      )}

      {status === 'error' && <p className="text-sm">❌ {error}</p>}
    </form>
  );
}
