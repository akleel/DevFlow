import type { FastifyRequest } from 'fastify';

export function readHeader(req: FastifyRequest, name: string): string | undefined {
  const key = name.toLowerCase();
  const value = req.headers[key];

  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0];

  return undefined;
}
