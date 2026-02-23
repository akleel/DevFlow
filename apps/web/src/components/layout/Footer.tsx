import Link from 'next/link';

import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container className="max-w-none px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-400">
            © {new Date().getFullYear()} DevFlow. Built like production.
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-4 text-sm sm:justify-end"
          >
            <Link className="text-zinc-300 transition hover:text-white" href="/#services">
              Services
            </Link>
            <Link
              className="text-zinc-300 transition hover:text-white"
              href="/engineering"
            >
              Engineering
            </Link>
            <Link className="text-zinc-300 transition hover:text-white" href="/#contact">
              Contact
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
