import { z } from 'zod';

export const ContactRequestSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  message: z.string().min(10).max(2000),

  // Honeypot: humans won't fill it, bots often do.
  company: z.string().max(200).optional(),
});

export type ContactRequestDTO = z.infer<typeof ContactRequestSchema>;
