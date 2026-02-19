import { ContactForm } from '../components/contact/ContactForm';
import { Section } from '../components/layout/Section';

function Card({
  title,
  body,
  bullets,
}: {
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-xl border bg-white p-6 text-gray-900 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-gray-900" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border bg-white p-6 text-gray-900 shadow-sm">
      <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
        Step {n}
      </div>
      <div className="mt-2 text-base font-semibold text-gray-900">{title}</div>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </div>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border bg-white p-6 text-gray-900 shadow-sm">
      <div className="text-base font-semibold text-gray-900">{q}</div>
      <p className="mt-2 text-sm text-gray-600">{a}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main id="top">
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Consulting • Fullstack • Production-first
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Websites that convert.
              <br />
              Extreme problems solved.
              <br />
              Components built to last.
            </h1>

            <p className="mt-5 text-base text-gray-600 sm:text-lg">
              Dewflow builds clean, maintainable web systems with senior discipline:
              strong typing, predictable architecture, and real operational hygiene.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Book a call
              </a>
              <a
                href="#services"
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                See services
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="rounded-full border px-3 py-1">Type-safe fullstack</span>
              <span className="rounded-full border px-3 py-1">CI gated</span>
              <span className="rounded-full border px-3 py-1">API-first</span>
              <span className="rounded-full border px-3 py-1">Fast iteration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <Section
        id="services"
        eyebrow="What we do"
        title="Three ways we help"
        subtitle="Simple offers, clear outcomes. No maze of pages — everything is one scroll away."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Websites that convert"
            body="Strategy + build. Clean UX, strong performance, and maintainable code."
            bullets={[
              'Landing pages & marketing sites',
              'App UI for real workflows',
              'Performance & accessibility upgrades',
            ]}
          />
          <Card
            title="Extreme problem solving"
            body="When things are on fire: stability, speed, incidents, migrations, and weird bugs."
            bullets={[
              'Production debugging & hardening',
              'Performance, memory, and reliability',
              'Migrations & refactors without downtime',
            ]}
          />
          <Card
            title="Components & systems"
            body="Reusable building blocks that keep teams fast and consistent."
            bullets={[
              'Component libraries & design systems',
              'Shared contracts & typed APIs',
              'Documentation and standards',
            ]}
          />
        </div>
      </Section>

      {/* Process */}
      <Section
        id="process"
        eyebrow="How we work"
        title="Fast, calm, and predictable"
        subtitle="Short feedback loops, strong boundaries, and a bias toward shipping."
        className="bg-gray-50"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Step
            n="01"
            title="Clarify the outcome"
            body="We define success criteria (speed, conversion, reliability, UX) before writing code."
          />
          <Step
            n="02"
            title="Build the smallest strong thing"
            body="We implement a clean foundation first, then scale features without spaghetti."
          />
          <Step
            n="03"
            title="Ship with guardrails"
            body="CI gates, typed boundaries, and tests where they prevent real regressions."
          />
        </div>
      </Section>

      {/* Components */}
      <Section
        id="components"
        eyebrow="Components"
        title="Reusable blocks, not one-off hacks"
        subtitle="We build components that behave the same everywhere — consistent UX and less maintenance."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border p-6">
            <h3 className="text-lg font-semibold tracking-tight">Deliverables</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {[
                'UI primitives (Button, Input, Card…) with predictable styling',
                'Patterns (forms, error states, loading) that don’t rot',
                'Shared types/contracts between frontend and API',
                'Docs and usage examples so teams move faster',
              ].map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-gray-900" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border p-6">
            <h3 className="text-lg font-semibold tracking-tight">Why it matters</h3>
            <p className="mt-2 text-sm text-gray-600">
              Great teams don’t move fast because they “code faster.” They move fast
              because the system stays simple.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {[
                'Fewer UI regressions',
                'Less duplicated logic',
                'Easier onboarding',
                'Cleaner code reviews',
              ].map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-gray-900" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Engineering (recruiter + trust signal) */}
      <Section
        id="engineering"
        eyebrow="Under the hood"
        title="Built like production"
        subtitle="This site is intentionally engineered to match what strong fullstack teams expect."
        className="bg-gray-50"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Card
            title="API discipline"
            body="Typed boundaries, validation at the edge, and safe defaults."
            bullets={[
              'Request IDs and consistent error shapes',
              'Rate limiting and basic abuse controls',
              'Shared contracts between web and API',
            ]}
          />
          <Card
            title="CI + quality gates"
            body="Automated checks that prevent regressions and keep shipping safe."
            bullets={[
              'Lint + build gates on PRs',
              'Dependency review + CodeQL scanning',
              'Repeatable builds in a monorepo',
            ]}
          />
          <Card
            title="Maintainability"
            body="Minimal code, readable structure, and no magic."
            bullets={[
              'No `any` creeping in',
              'Small components, clear ownership',
              'Fast local dev setup',
            ]}
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section
        id="faq"
        eyebrow="FAQ"
        title="Answers without a meeting"
        subtitle="If you still want the meeting — cool, we’ll keep it efficient."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <QA
            q="Do you only build websites?"
            a="No. We build websites, fix scary production issues, and create reusable component systems. The common theme is clean engineering with real outcomes."
          />
          <QA
            q="What does “extreme problems” mean?"
            a="Performance cliffs, reliability, migrations, incidents, and the bugs that only happen in production at 02:00."
          />
          <QA
            q="How fast can we start?"
            a="Fast. We prefer small scoped deliverables first, then expand once the foundation is solid."
          />
          <QA
            q="How do we contact you?"
            a="Use the form below. If you include context and constraints, we can respond with a plan instead of a generic reply."
          />
        </div>
      </Section>

      {/* Contact */}
      <Section
        id="contact"
        eyebrow="Contact"
        title="Tell us what you’re trying to achieve"
        subtitle="The best messages include goal, timeline, constraints, and what “done” looks like."
      >
        <div className="rounded-xl border p-6">
          <ContactForm />
        </div>
      </Section>
    </main>
  );
}
