import type { AdminContactsSuccessResponse } from '@devflow/shared';
import { desc } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';

import { db } from '../../db/client';
import { contacts } from '../../db/schema';
import { requireAdmin } from '../../middleware/admin-auth';

type AdminContactsQuery = {
  limit?: string;
};

function safeLimit(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 20;
  return Math.min(100, Math.max(1, Math.floor(n)));
}

export async function adminRoutes(app: FastifyInstance) {
  app.get<{ Querystring: AdminContactsQuery }>(
    '/admin/contacts',
    { preHandler: requireAdmin },
    async (req, reply) => {
      const limit = safeLimit(req.query.limit);

      const items = await db
        .select()
        .from(contacts)
        .orderBy(desc(contacts.createdAt))
        .limit(limit);

      const body: AdminContactsSuccessResponse = { ok: true, items };
      return reply.send(body);
    },
  );
}
