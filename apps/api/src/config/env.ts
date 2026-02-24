import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { z } from 'zod';

// Resolve apps/api as the base (no matter where the process is started)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// apps/api/src/config -> apps/api
const apiRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(apiRoot, '.env') });

function parseEnvBoolean(value: unknown): boolean | undefined {
  if (typeof value !== 'string') return undefined;

  const v = value.trim().toLowerCase();

  if (v === 'true' || v === '1' || v === 'yes' || v === 'y' || v === 'on') return true;
  if (v === 'false' || v === '0' || v === 'no' || v === 'n' || v === 'off') return false;

  return undefined;
}

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z
    .preprocess(
      (v) => (typeof v === 'string' ? Number(v) : v),
      z.number().int().positive(),
    )
    .default(3001),

  WEB_ORIGIN: z.string().url(),
  ADMIN_TOKEN: z.string().min(1),
  DATABASE_URL: z.string().startsWith('file:'),

  // Dev-only admin panel toggle. Keep false in production unless you have real auth.
  ENABLE_ADMIN: z.preprocess((v) => parseEnvBoolean(v) ?? v, z.boolean()).default(false),

  /**
   * How to interpret X-Forwarded-For / X-Real-IP.
   * - none: ignore forwarded headers
   * - private: trust forwarded headers only when the immediate peer is private/loopback
   * - all: always trust forwarded headers (useful behind known proxies)
   */
  TRUST_PROXY: z.enum(['none', 'private', 'all']).default('private'),
});

type Env = z.infer<typeof EnvSchema>;

function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    throw new Error(`Invalid environment configuration: ${message}`);
  }

  return parsed.data;
}

export const env = loadEnv();
