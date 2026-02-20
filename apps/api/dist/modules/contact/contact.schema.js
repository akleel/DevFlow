import { z } from 'zod';
export const ContactRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  message: z.string().trim().min(10).max(2000),
  // Honeypot: humans won't fill it, bots often do.
  company: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().trim().max(200).optional(),
  ),
});
