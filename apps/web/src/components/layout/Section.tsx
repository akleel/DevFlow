import type { ReactNode } from 'react';

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
    <section id={id} className={['py-14 sm:py-20', className].filter(Boolean).join(' ')}>
      <Container>
        {(eyebrow || title || subtitle) && (
          <header className="mb-8 sm:mb-10">
            {eyebrow && (
              <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                {eyebrow}
              </div>
            )}

            {title && (
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                {title}
              </h2>
            )}

            {subtitle && <p className="mt-3 max-w-2xl text-gray-600">{subtitle}</p>}
          </header>
        )}

        {children}
      </Container>
    </section>
  );
}
