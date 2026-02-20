import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '../config/env';

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const token = (req.headers['x-admin-token'] as string | undefined) ?? '';

  if (token !== env.ADMIN_TOKEN) {
    return reply.status(401).send({
      ok: false,
      error: 'Unauthorized',
      requestId: req.requestId,
    });
  }
}
