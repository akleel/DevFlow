import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
  }
}

export function registerRequestId(app: FastifyInstance) {
  // Use Fastify's built-in request id (matches the logger's reqId)
  app.addHook('onRequest', async (req: FastifyRequest) => {
    req.requestId = req.id;
  });

  // Guarantee the header on every response
  app.addHook(
    'onSend',
    async (req: FastifyRequest, reply: FastifyReply, payload: unknown) => {
      reply.header('x-request-id', req.requestId);
      return payload;
    },
  );
}
