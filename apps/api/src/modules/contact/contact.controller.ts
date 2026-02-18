import type { FastifyReply, FastifyRequest } from "fastify";

import { ContactRequestSchema } from "./contact.schema";
import { ContactService } from "./contact.service";

const service = new ContactService();

export async function submitContactController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = ContactRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return reply.status(400).send({
      ok: false,
      error: "Invalid request",
      requestId: req.requestId,
      issues: parsed.error.issues,
    });
  }

  // Honeypot: if filled, pretend success (don't teach bots)
  if (parsed.data.company?.trim()) {
    req.log.info({ requestId: req.requestId }, "honeypot triggered");
    return reply.status(200).send({ ok: true });
  }
  const email = parsed.data.email.toLowerCase().trim();
  const domain = email.split("@")[1] ?? "unknown";

  req.log.info(
    {
      requestId: req.requestId,
      emailDomain: domain,
      messageLength: parsed.data.message.length,
    },
    "contact submitted",
  );

  const result = await service.submitContact(parsed.data);
  return reply.status(200).send(result);
}
