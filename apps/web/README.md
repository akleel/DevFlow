# DevFlow Web (`apps/web`)

Frontend for **DevFlow** — a production-minded consulting/portfolio site built to demonstrate clean architecture, type-safe fullstack communication, and pragmatic engineering decisions.

This app is part of a monorepo:

- `apps/web` → Next.js frontend (this app)
- `apps/api` → Fastify API
- `packages/shared` → shared TypeScript contracts

---

## What this frontend demonstrates

- **Next.js App Router** with route handlers (`/app/api/*`) used as server-side proxies
- **Type-safe request/response contracts** shared with the API via `@devflow/shared`
- **Production-minded proxy behavior** (timeouts, controlled upstream error responses)
- **Clean internal API boundaries** between UI, route handlers, and backend API
- **Accessibility polish** in form UX (labels, live regions, status/error announcements)
- **Pragmatic code quality** (no `any`, reduced duplication, small focused utilities)

---

## Features

- Marketing/landing pages
- Contact form with:
  - client-side form validation
  - honeypot spam protection (server-side enforced in API)
  - rate-limit feedback handling
  - robust error display with request IDs when available
- Optional admin UI (`/admin`) controlled by environment flags
- Internal Next.js proxy routes for backend communication:
  - `POST /api/contact`
  - `GET /api/admin/contacts` (gated)

---

## Tech stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- Shared contracts from `@devflow/shared`

---

## Environment variables

Create:

- `apps/web/.env.local`

You can start from:

- `apps/web/.env.local.example`

Example values:

```env
API_URL=http://localhost:3001
ADMIN_TOKEN=change-me
ENABLE_ADMIN=false
ADMIN_GATE=change-me
NEXT_PUBLIC_ENABLE_ADMIN=false
```
