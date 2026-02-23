import type { ReactNode } from 'react';

import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';

const blockClass =
  'rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={blockClass}>
      <h2 className="text-lg font-semibold tracking-tight text-zinc-100">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-zinc-300">{children}</div>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/25 p-4 text-xs text-zinc-200">
      <code>{children}</code>
    </pre>
  );
}

export default function EngineeringPage() {
  return (
    <main>
      <section className="border-b border-white/10">
        <Container className="py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-sky-200/90 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
              DevFlow • Engineering
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
              Built like production
            </h1>

            <p className="mt-4 text-base leading-7 text-zinc-400">
              Quick, honest overview of architecture, quality gates, and operational
              basics.
            </p>
          </div>
        </Container>
      </section>

      <Section
        eyebrow="Architecture"
        title="Simple monorepo, clear boundaries"
        subtitle="Fewer moving parts, stronger contracts."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Block title="Repo structure">
            <ul className="space-y-2 text-zinc-300">
              <li>
                <span className="font-medium text-zinc-100">apps/web</span> — Next.js (App
                Router)
              </li>
              <li>
                <span className="font-medium text-zinc-100">apps/api</span> — Fastify API
                (Drizzle + SQLite)
              </li>
              <li>
                <span className="font-medium text-zinc-100">packages/shared</span> —
                shared types/contracts
              </li>
            </ul>

            <p className="text-zinc-400">
              The web app proxies requests through route handlers so secrets stay
              server-side.
            </p>
          </Block>

          <Block title="Request flow">
            <ul className="space-y-2 text-zinc-300">
              <li>Browser → Next Route Handler → API</li>
              <li>API validates input and performs work</li>
              <li>Responses remain typed end-to-end</li>
            </ul>

            <p className="text-zinc-400">
              Request IDs help correlate logs and debug issues across boundaries.
            </p>
          </Block>
        </div>
      </Section>

      <Section
        eyebrow="Quality"
        title="Type-safety & defensive boundaries"
        subtitle="No `any` drift, validation at the edge."
        className="border-y border-white/5 bg-white/2"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Block title="Contracts">
            <p>
              Shared request/response types live in{' '}
              <span className="font-medium text-zinc-100">@devflow/shared</span>.
            </p>
            <p className="text-zinc-400">
              This keeps the web and API aligned without duplicating shapes.
            </p>
          </Block>

          <Block title="Validation">
            <p>API inputs are validated using Zod schemas before business logic runs.</p>
            <p className="text-zinc-400">
              Invalid inputs return structured errors with optional issue details.
            </p>
          </Block>

          <Block title="Guardrails">
            <p>Rate limiting and a honeypot reduce abuse on public forms.</p>
            <p className="text-zinc-400">
              Admin endpoints are server-to-server and gated with a token.
            </p>
          </Block>
        </div>
      </Section>

      <Section
        eyebrow="CI"
        title="Automated checks"
        subtitle="Recruiter translation: we don’t merge broken builds."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Block title="What runs">
            <ul className="space-y-2 text-zinc-300">
              <li>Lint (monorepo)</li>
              <li>Typecheck (monorepo)</li>
              <li>Build web + API + shared</li>
              <li>Dependency Review on PRs</li>
              <li>CodeQL scanning</li>
              <li>Dependabot updates</li>
            </ul>
          </Block>

          <Block title="Local dev">
            <Code>{`npm ci
npm run dev:web
npm run dev:api`}</Code>
            <p className="text-zinc-400">
              Use the provided env examples under <code>apps/web</code> and{' '}
              <code>apps/api</code>.
            </p>
          </Block>
        </div>
      </Section>
    </main>
  );
}
