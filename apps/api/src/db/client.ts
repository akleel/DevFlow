import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { env } from '../config/env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// apps/api/src/db -> apps/api
const apiRoot = path.resolve(__dirname, '../..');

// DATABASE_URL example: file:./storage/devflow.db
function resolveSqliteFile(databaseUrl: string) {
  if (!databaseUrl.startsWith('file:')) {
    throw new Error('DATABASE_URL must start with file: for SQLite');
  }
  const p = databaseUrl.replace('file:', '');
  // relative paths resolve from apps/api
  return path.isAbsolute(p) ? p : path.join(apiRoot, p);
}

const sqliteFile = resolveSqliteFile(env.DATABASE_URL);
const sqlite = new Database(sqliteFile);

export const db = drizzle(sqlite);
