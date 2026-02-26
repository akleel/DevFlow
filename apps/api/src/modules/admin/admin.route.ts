import { safeLimit, type AdminContactsSuccessResponse } from '@devflow/shared';
import { desc } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';

import { db } from '../../db/client';
import { contacts } from '../../db/schema';
import { requireAdmin } from '../../middleware/admin-auth';

type AdminContactsQuery = {
  limit?: string;
};

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
