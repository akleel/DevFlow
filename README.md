# DevFlow

Production-minded consulting/portfolio site + fullstack reference implementation.

## Highlights

- **Strict TypeScript** + shared contracts (`packages/shared`)
- **API validation** with Zod + clear error payloads
- **Rate limiting** for contact submissions
- **Request ID propagation** end-to-end for debugging
- **SQLite + Drizzle ORM** for a portable demo DB
- **Next.js route-handler proxy** (`apps/web/app/api/*`) to the Fastify API

## Stack

- Web: Next.js App Router (`apps/web`)
- API: Fastify + Drizzle ORM + SQLite (`apps/api`)
- Shared: TypeScript contracts (`packages/shared`)

## Repo layout

- `apps/web` — marketing site + server route-handler proxies (`/app/api/*`)
- `apps/api` — contact + (optional) admin endpoints
- `packages/shared` — shared request/response types
- `packages/config` — shared TS/ESLint/Prettier baselines (file-based)
- `.github/workflows` — CI + CodeQL + dependency review

## Requirements

- Node.js 20+
- npm (workspaces)

## Local development

### 1) Install deps

```bash
npm ci
```

## Licence
- MIT

