import rateLimit from '@fastify/rate-limit';
import { env } from '../config/env';
function normalizeIp(ip) {
  // Fastify/Node can surface IPv4-as-IPv6 like ::ffff:127.0.0.1
  return ip.startsWith('::ffff:') ? ip.slice('::ffff:'.length) : ip;
}
function isPrivateOrLoopbackV4(ip) {
  const parts = ip.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return false;
  }
  // With noUncheckedIndexedAccess, even after length checks TS treats indexes as possibly undefined.
  const a = parts[0];
  const b = parts[1];
  if (a === 127) return true; // loopback
  if (a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}
function isPrivateOrLoopbackV6(ip) {
  const v = ip.toLowerCase();
  if (v === '::1') return true; // loopback
  // Unique local addresses: fc00::/7
  if (v.startsWith('fc') || v.startsWith('fd')) return true;
  return false;
}
function isPrivateOrLoopback(ip) {
  const n = normalizeIp(ip);
  if (n.includes('.')) return isPrivateOrLoopbackV4(n);
  return isPrivateOrLoopbackV6(n);
}
function firstForwardedIp(value) {
  // X-Forwarded-For: client, proxy1, proxy2
  const first = value.split(',')[0]?.trim();
  if (!first) return null;
  // Some proxies wrap IPv6 in quotes or brackets
  return first.replace(/^\[|\]$/g, '').replace(/^"|"$/g, '');
}
function getClientIp(req) {
  const remoteRaw = req.raw.socket.remoteAddress;
  const remote = remoteRaw ? normalizeIp(remoteRaw) : '';
  const trustMode = env.TRUST_PROXY;
  const shouldTrustForwarded =
    trustMode === 'all' ||
    (trustMode === 'private' && remote && isPrivateOrLoopback(remote));
  if (shouldTrustForwarded) {
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string') {
      const ip = firstForwardedIp(xff);
      if (ip) return ip;
    }
    const xReal = req.headers['x-real-ip'];
    if (typeof xReal === 'string' && xReal.trim()) return xReal.trim();
  }
  // Fall back to Fastify's computed ip (usually the peer's IP)
  return req.ip;
}
export async function registerRateLimit(app) {
  await app.register(rateLimit, {
    global: true,
    max: 300,
    timeWindow: '1 minute',
    keyGenerator: (req) => getClientIp(req),
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
  });
  app.log.info('rate-limit plugin registered (global: 300/min)');
}
