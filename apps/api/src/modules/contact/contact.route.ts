import type { FastifyInstance } from 'fastify';

import { submitContactController } from './contact.controller';

export async function contactRoutes(app: FastifyInstance) {
  app.post(
    '/contact',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '10 minutes',
        },
      },
    },
    submitContactController,
  );
}
