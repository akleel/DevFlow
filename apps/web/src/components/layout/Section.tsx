// apps/web/src/components/layout/Section.tsx
import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';

import { Container } from './Container';

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, subtitle, children, className }: Props) {
  return (
    <section className={cn('py-14 sm:py-20', className)}>
      {id ? <div id={id} className="scroll-mt-20" /> : null}

      <Container>
        {(eyebrow || title || subtitle) && (
          <header className="mb-8 sm:mb-10">
            {eyebrow && (
              <div className="text-xs font-semibold tracking-[0.18em] text-sky-200/90 uppercase">
                {eyebrow}
              </div>
            )}

            {title && (
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                {subtitle}
              </p>
            )}
          </header>
        )}

        {children}
      </Container>
    </section>
  );
}
