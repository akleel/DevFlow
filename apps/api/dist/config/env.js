import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
// Resolve apps/api as the base (no matter where the process is started)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// apps/api/src/config -> apps/api
const apiRoot = path.resolve(__dirname, '../..');
dotenv.config({ path: path.join(apiRoot, '.env') });
function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}
export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3001),
  WEB_ORIGIN: required('WEB_ORIGIN'),
  ADMIN_TOKEN: required('ADMIN_TOKEN'),
  DATABASE_URL: required('DATABASE_URL'),
  /**
   * How to interpret X-Forwarded-For / X-Real-IP.
   * - none: ignore forwarded headers
   * - private: trust forwarded headers only when the immediate peer is private/loopback
   * - all: always trust forwarded headers (useful behind known proxies)
   */
  TRUST_PROXY: process.env.TRUST_PROXY ?? 'private',
};
