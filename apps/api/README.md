# DevFlow API (`apps/api`)

Backend for **DevFlow** — a small but production-minded Fastify service that demonstrates:

- **Route modules** (contact + optional admin endpoints)
- **Validation at the edge** (Zod)
- **Rate limiting** (`@fastify/rate-limit`)
- **Request IDs** propagated end-to-end
- **SQLite via Drizzle ORM** (simple, portable, easy to demo)

## Endpoints

- `GET /health` — health check
- `POST /api/contact` — contact form submission
- `GET /api/admin/contacts?limit=50` — list recent submissions (dev-only)

## Environment variables

Create `apps/api/.env` from `apps/api/.env.example`.

Required:

- `WEB_ORIGIN` — allowed CORS origin for the web app
- `ADMIN_TOKEN` — static admin token (dev-only)
- `DATABASE_URL` — SQLite file URL (`file:./storage/devflow.db`)
- `PORT` — server port (default 3001)

Optional:

- `ENABLE_ADMIN=true` — enables `/api/admin/*` (dev-only)
- `TRUST_PROXY=none|private|all` — controls whether forwarded IP headers are trusted

## Development

From repo root:

```bash
npm run dev:api
```

## Database

Migrations are managed with Drizzle:

```bash
npm run db:generate -w apps/api
npm run db:migrate -w apps/api
```

## Tests

```bash
npm test -w apps/api
```

Tests use Fastify's `app.inject()` with Node's built-in test runner.
