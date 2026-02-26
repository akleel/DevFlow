import { timingSafeEqual } from 'node:crypto';

import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '../config/env';
import { readHeader } from '../utils/headers';

function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  const len = Math.max(aBuf.length, bBuf.length);

  const aPadded = Buffer.alloc(len);
  const bPadded = Buffer.alloc(len);

  aBuf.copy(aPadded);
  bBuf.copy(bPadded);

  return timingSafeEqual(aPadded, bPadded) && aBuf.length === bBuf.length;
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const token = readHeader(req, 'x-admin-token') ?? '';

  if (!timingSafeEqualString(token, env.ADMIN_TOKEN)) {
    return reply.status(401).send({
      ok: false,
      error: 'Unauthorized',
      requestId: req.requestId,
    });
  }
}
