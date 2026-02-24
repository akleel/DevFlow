'use client';

import type { ContactRequest } from '@devflow/shared';
import { useEffect, useRef, useState } from 'react';

import { isRecord } from '../../lib/guards';

type Status = 'idle' | 'sending' | 'success' | 'error';

type ErrorPayload = {
  error?: string;
  requestId?: string;
};

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
    if (status === 'sending') return;

    setStatus('sending');
    setError('');

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    const formElement = e.currentTarget;
    const form = new FormData(formElement);

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

      const raw: unknown = await res.json().catch(() => ({}));
      const errPayload = readErrorPayload(raw);

      if (!res.ok) {
        if (res.status === 429) {
          const reset = res.headers.get('x-ratelimit-reset');

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
      formElement.reset();

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
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="space-y-2">
        <label htmlFor="contact-name" className="block text-sm font-medium text-zinc-200">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          required
          minLength={2}
          maxLength={80}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/20"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-zinc-200"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/20"
          placeholder="you@company.com"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-zinc-200"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/20"
          placeholder="Tell us what you need help with…"
          rows={6}
        />
      </div>

      <button
        disabled={status === 'sending'}
        className="inline-flex items-center justify-center rounded-xl border border-sky-200/20 bg-sky-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'success' && (
        <p role="status" aria-live="polite" className="text-sm text-emerald-300">
          ✅ Message sent. We’ll get back to you.
        </p>
      )}

      {status === 'error' && (
        <p role="alert" aria-live="polite" className="text-sm text-rose-300">
          ❌ {error}
        </p>
      )}
    </form>
  );
}
