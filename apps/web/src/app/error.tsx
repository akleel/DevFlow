'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Container } from '../components/layout/Container';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('app error', { digest: error.digest, message: error.message });
  }, [error]);

  return (
    <main className="py-20">
      <Container>
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.24)] backdrop-blur-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Try again. If it keeps happening, include the error digest when reporting it.
          </p>

          {error.digest ? (
            <p className="mt-4 text-xs text-zinc-500">
              Digest: <code className="text-zinc-300">{error.digest}</code>
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-xl border border-sky-200/20 bg-sky-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
            >
              Retry
            </button>

            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/6"
            >
              Back home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}