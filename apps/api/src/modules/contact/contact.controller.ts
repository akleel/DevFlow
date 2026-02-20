import type { ContactErrorResponse, ContactSuccessResponse } from '@devflow/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { ContactRequestSchema } from './contact.schema';
import { ContactService } from './contact.service';

const service = new ContactService();

export async function submitContactController(req: FastifyRequest, reply: FastifyReply) {
  const parsed = ContactRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    const body: ContactErrorResponse = {
      ok: false,
      error: 'Invalid request',
      requestId: req.requestId,
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    };

    return reply.status(400).send(body);
  }

  // Honeypot: if filled, pretend success (don't teach bots)
  if (parsed.data.company) {
    req.log.info({ requestId: req.requestId }, 'honeypot triggered');

    const body: ContactSuccessResponse = { ok: true };
    return reply.status(200).send(body);
  }

  const domain = parsed.data.email.split('@')[1] ?? 'unknown';

  req.log.info(
    {
      requestId: req.requestId,
      emailDomain: domain,
      messageLength: parsed.data.message.length,
    },
    'contact submitted',
  );

  const result = await service.submitContact(parsed.data);
  return reply.status(200).send(result);
}
