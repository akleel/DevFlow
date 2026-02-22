import Link from 'next/link';

import { Container } from './Container';

type LinkItem = { href: string; label: string };

const links: LinkItem[] = [
  { href: '/#services', label: 'Services' },
  { href: '/#process', label: 'Process' },
  { href: '/#components', label: 'Components' },
  { href: '/#faq', label: 'FAQ' },
];

function NavLinks({ className }: { className?: string }) {
  return (
    <nav className={['flex items-center gap-6', className].filter(Boolean).join(' ')}>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="text-sm font-medium text-white/80 hover:text-white transition"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      {/* Full-width bar */}
      <div className="border-b border-white/10 bg-black/45 backdrop-blur">
        {/* Use Container but remove max-width so it reaches “corners” */}
        <Container className="max-w-none px-6 sm:px-8 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            {/* Left corner: brand */}
            <Link href="/" className="text-white font-semibold tracking-tight">
              DevFlow
            </Link>

            {/* Right corner group: links + CTA */}
            <div className="flex items-center gap-4">
              {/* Desktop links sit next to CTA */}
              <NavLinks className="hidden md:flex" />

              <Link
                href="/#contact"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 transition"
              >
                Book a call
              </Link>

              {/* Mobile menu (no JS) */}
              <details className="relative md:hidden">
                <summary className="cursor-pointer rounded-full border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition [&::-webkit-details-marker]:hidden">
                  Menu
                </summary>

                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-black/80 p-2 shadow-lg backdrop-blur">
                  <div className="flex flex-col">
                    {links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
                      >
                        {l.label}
                      </Link>
                    ))}
                    <Link
                      href="/#contact"
                      className="mt-1 rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}