import { Container } from './Container';

type LinkItem = { href: string; label: string };

const links: LinkItem[] = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#components', label: 'Components' },
  { href: '#engineering', label: 'Engineering' },
  { href: '#faq', label: 'FAQ' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-black" />
          Dewflow
        </a>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-gray-700 hover:text-black"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Book a call
          </a>
        </div>
      </Container>
    </header>
  );
}
