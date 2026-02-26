import cors from '@fastify/cors';
import Fastify from 'fastify';

import { env } from './config/env';
import { registerErrorHandler } from './middleware/error-handler';
import { registerRateLimit } from './middleware/rate-limit';
import { registerRequestId } from './middleware/request-id';
import { registerSecurityHeaders } from './middleware/security-headers';
import { registerRoutes } from './routes/index';

export async function buildApp(options?: { logger?: boolean }) {
  const app = Fastify({ logger: options?.logger ?? true });

  await app.register(cors, {
    origin: [env.WEB_ORIGIN],
    credentials: true,
    methods: ['GET', 'POST'],
  });

  registerErrorHandler(app);
  registerRequestId(app);
  registerSecurityHeaders(app);
  await registerRateLimit(app);

  await app.register(registerRoutes);

  return app;
}
