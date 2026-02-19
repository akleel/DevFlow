# Dewflow (DevFlow repo)

Consulting site + fullstack reference implementation.

## Stack
- Web: Next.js App Router (apps/web)
- API: Fastify + Drizzle ORM + SQLite (apps/api)
- Shared: TypeScript contracts (packages/shared)

## Repo layout
- `apps/web` — marketing site + route handler proxies
- `apps/api` — contact + admin endpoints
- `packages/shared` — shared request/response types

## Local dev
1) Install:
```bash
npm ci
