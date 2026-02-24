// apps/web/src/components/layout/Header.tsx
import { cn } from '../../lib/cn';

import { cn } from '../../lib/cn';

import { Container } from './Container';
import { SmartLink } from './SmartLink';

type LinkItem = { href: string; label: string };

const links: LinkItem[] = [
  { href: '/#services', label: 'Services' },
  { href: '/#process', label: 'Process' },
  { href: '/#components', label: 'Components' },
  { href: '/#faq', label: 'FAQ' },
];

function NavLinks({ className }: { className?: string }) {
  return (
    <nav className={cn('flex items-center gap-6', className)}>
      {links.map((link) => (
        <SmartLink
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-zinc-300 transition hover:text-white"
        >
          {link.label}
        </SmartLink>
      ))}
    </nav>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-[#070b14]/70 backdrop-blur-xl">
        <Container className="max-w-none px-6 sm:px-8 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            <SmartLink
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white"
              aria-label="DevFlow home"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.75)]" />
              DevFlow
            </SmartLink>

            <div className="flex items-center gap-4">
              <NavLinks className="hidden md:flex" />

              <SmartLink
                href="/#contact"
                className="rounded-full border border-sky-200/20 bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
              >
                Book a call
              </SmartLink>

              <details className="relative md:hidden">
                <summary className="cursor-pointer rounded-full border border-white/15 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/5 [&::-webkit-details-marker]:hidden">
                  Menu
                </summary>

                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0b1220]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                  <div className="flex flex-col">
                    {links.map((link) => (
                      <SmartLink
                        key={link.href}
                        href={link.href}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        {link.label}
                      </SmartLink>
                    ))}
                    <SmartLink
                      href="/#contact"
                      className="mt-1 rounded-lg px-3 py-2 text-sm font-semibold text-sky-200 transition hover:bg-white/5"
                    >
                      Contact
                    </SmartLink>
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
