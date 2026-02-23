import type { FastifyInstance } from 'fastify';

import { env } from '../config/env';
import { adminRoutes } from '../modules/admin/admin.route';
import { contactRoutes } from '../modules/contact/contact.route';

export async function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ ok: true }));

  await app.register(contactRoutes, { prefix: '/api' });

  if (env.ENABLE_ADMIN) {
    await app.register(adminRoutes, { prefix: '/api' });
  } else {
    app.log.warn('admin routes disabled (set ENABLE_ADMIN=true to enable)');
  }
}
