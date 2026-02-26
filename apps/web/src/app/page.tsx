import { ContactForm } from '../components/contact/ContactForm';
import { Section } from '../components/layout/Section';

const surfaceClass =
  'rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm';

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-sky-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

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
    <div className={surfaceClass}>
      <h3 className="text-lg font-semibold tracking-tight text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
      <BulletList items={bullets} />
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className={surfaceClass}>
      <div className="text-xs font-semibold tracking-[0.16em] text-sky-200/80 uppercase">
        Step {n}
      </div>
      <div className="mt-2 text-base font-semibold text-zinc-100">{title}</div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
    </div>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className={surfaceClass}>
      <div className="text-base font-semibold text-zinc-100">{q}</div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{a}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main id="top">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-sky-200/90 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
              Consulting • Fullstack • Production-first
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
              Websites that convert.
              <br />
              Extreme problems solved.
              <br />
              Components built to last.
            </h1>

            <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
              DevFlow builds clean, maintainable web systems with senior discipline:
              strong typing, predictable architecture, and real operational hygiene.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {['Type-safe fullstack', 'CI gated', 'API-first', 'Fast iteration'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-zinc-300"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>

          <aside className="self-start rounded-2xl border border-white/10 bg-white/3 p-5 shadow-[0_12px_36px_rgba(0,0,0,0.28)] backdrop-blur-sm">
            <div className="text-xs font-semibold tracking-[0.14em] text-zinc-400 uppercase">
              Why teams hire
            </div>

            <div className="mt-4 grid gap-3">
              {[
                {
                  label: 'Architecture',
                  value: 'Clear boundaries',
                  note: 'Frontend, API, shared contracts',
                },
                {
                  label: 'Quality',
                  value: 'Guardrails included',
                  note: 'Validation, rate limits, CI checks',
                },
                {
                  label: 'Delivery',
                  value: 'Small strong increments',
                  note: 'Fast iteration without chaos',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="text-xs font-medium text-zinc-400">{item.label}</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-100">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">{item.note}</div>
                </div>
              ))}
            </div>
          </aside>
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
        className="border-y border-white/5 bg-white/2"
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
          <div className={surfaceClass}>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
              Deliverables
            </h3>
            <BulletList
              items={[
                'UI primitives (Button, Input, Card…) with predictable styling',
                'Patterns (forms, error states, loading) that don’t rot',
                'Shared types/contracts between frontend and API',
                'Docs and usage examples so teams move faster',
              ]}
            />
          </div>

          <div className={surfaceClass}>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
              Why it matters
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Great teams don’t move fast because they “code faster.” They move fast
              because the system stays simple.
            </p>
            <BulletList
              items={[
                'Fewer UI regressions',
                'Less duplicated logic',
                'Easier onboarding',
                'Cleaner code reviews',
              ]}
            />
          </div>
        </div>
      </Section>

      {/* Engineering (recruiter + trust signal) */}
      <Section
        id="engineering"
        eyebrow="Under the hood"
        title="Built like production"
        subtitle="This site is intentionally engineered to match what strong fullstack teams expect."
        className="border-y border-white/5 bg-white/2"
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
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.24)] backdrop-blur-sm">
          <ContactForm />
        </div>
      </Section>
    </main>
  );
}
