import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '../config/env';
import { readHeader } from '../utils/headers';

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const token = readHeader(req, 'x-admin-token') ?? '';

  if (token !== env.ADMIN_TOKEN) {
    return reply.status(401).send({
      ok: false,
      error: 'Unauthorized',
      requestId: req.requestId,
    });
  }
}
