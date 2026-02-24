'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
};

function isModifiedClick(event: MouseEvent<HTMLElement>): boolean {
  return (
    event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
  );
}

function parseHref(href: string): { pathname: string; hash: string } {
  if (href.startsWith('#')) return { pathname: '', hash: href };

  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return { pathname: href, hash: '' };

  const pathname = href.slice(0, hashIndex) || '/';
  const hash = href.slice(hashIndex);

  return { pathname, hash };
}

function scrollToTarget(hash: string): void {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function SmartLink({ href, className, children, ...rest }: Props) {
  const pathname = usePathname();
  const { pathname: targetPathnameRaw, hash } = parseHref(href);

  const isLocal = href.startsWith('/') || href.startsWith('#');
  const targetPathname = targetPathnameRaw || pathname;

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isLocal) return;
    if (isModifiedClick(event)) return;

    // Only hijack same-page links so they always re-scroll, even if URL/hash is unchanged.
    if (targetPathname === pathname) {
      event.preventDefault();

      scrollToTarget(hash);

      const nextUrl = hash ? `${targetPathname}${hash}` : targetPathname;
      window.history.replaceState(null, '', nextUrl);
    }
  }

  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
