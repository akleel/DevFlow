import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { env } from '../config/env';

const BASE_HEADERS: Array<[string, string]> = [
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'DENY'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  // Avoid caching API responses by default.
  ['Cache-Control', 'no-store'],
];

const PROD_HEADERS: Array<[string, string]> = [
  ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains'],
];

export function registerSecurityHeaders(app: FastifyInstance) {
  app.addHook(
    'onSend',
    async (_req: FastifyRequest, reply: FastifyReply, payload: unknown) => {
      for (const [key, value] of BASE_HEADERS) {
        if (!reply.hasHeader(key)) reply.header(key, value);
      }

      if (env.NODE_ENV === 'production') {
        for (const [key, value] of PROD_HEADERS) {
          if (!reply.hasHeader(key)) reply.header(key, value);
        }
      }

      return payload;
    },
  );
}
