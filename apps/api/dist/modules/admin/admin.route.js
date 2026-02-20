import { desc } from 'drizzle-orm';
import { db } from '../../db/client';
import { contacts } from '../../db/schema';
import { requireAdmin } from '../../middleware/admin-auth';
function safeLimit(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 20;
  return Math.min(100, Math.max(1, Math.floor(n)));
}
export async function adminRoutes(app) {
  app.get('/admin/contacts', { preHandler: requireAdmin }, async (req, reply) => {
    const limit = safeLimit(req.query.limit);
    const items = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt))
      .limit(limit);
    const body = { ok: true, items };
    return reply.send(body);
  });
}
