import { buildApp } from './app';
import { closeDb } from './db/client';
import { env } from './config/env';

const app = await buildApp();

let shuttingDown = false;

function logFatalAndExit(err: unknown) {
  app.log.error(err, 'fatal error');
  // Fastify's logger may be async; give it a tick.
  setTimeout(() => process.exit(1), 0);
}

process.on('unhandledRejection', logFatalAndExit);
process.on('uncaughtException', logFatalAndExit);

async function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return;
  shuttingDown = true;

  app.log.info({ signal }, 'shutting down');

  try {
    await app.close();
  } catch (err) {
    app.log.error(err, 'error while closing server');
  } finally {
    try {
      closeDb();
    } catch (err) {
      app.log.error(err, 'error while closing database');
    }
    process.exit(0);
  }
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

await app.listen({
  port: env.PORT,
  host: '0.0.0.0',
});
