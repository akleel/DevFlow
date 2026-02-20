import { env } from '../config/env';
export async function requireAdmin(req, reply) {
  const token = req.headers['x-admin-token'] ?? '';
  if (token !== env.ADMIN_TOKEN) {
    return reply.status(401).send({
      ok: false,
      error: 'Unauthorized',
      requestId: req.requestId,
    });
  }
}
