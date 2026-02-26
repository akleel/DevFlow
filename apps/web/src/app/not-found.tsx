import Link from 'next/link';

import { Container } from '../components/layout/Container';

export default function NotFound() {
  return (
    <main className="py-20">
      <Container>
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.24)] backdrop-blur-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Page not found
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            The page you’re looking for doesn’t exist.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="rounded-xl border border-sky-200/20 bg-sky-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
            >
              Go home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}