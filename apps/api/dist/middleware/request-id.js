export function registerRequestId(app) {
  // Use Fastify's built-in request id (matches the logger's reqId)
  app.addHook('onRequest', async (req) => {
    req.requestId = req.id;
  });
  // Guarantee the header on every response
  app.addHook('onSend', async (req, reply, payload) => {
    reply.header('x-request-id', req.requestId);
    return payload;
  });
}
