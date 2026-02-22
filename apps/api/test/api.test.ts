import assert from 'node:assert/strict';
import test from 'node:test';

process.env.WEB_ORIGIN = 'http://localhost:3000';
process.env.ADMIN_TOKEN = 'test-admin-token';
process.env.DATABASE_URL = 'file:./storage/test.db';
process.env.ENABLE_ADMIN = 'true';

const { buildApp } = await import('../src/app');

test('GET /health returns ok', async (t) => {
  const app = await buildApp({ logger: false });
  t.after(() => app.close());

  const res = await app.inject({ method: 'GET', url: '/health' });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.payload), { ok: true });
});

test('POST /api/contact invalid body returns 400', async (t) => {
  const app = await buildApp({ logger: false });
  t.after(() => app.close());

  const res = await app.inject({
    method: 'POST',
    url: '/api/contact',
    payload: { email: 'not-an-email' },
  });

  assert.equal(res.statusCode, 400);

  const body = JSON.parse(res.payload) as { ok: boolean; error?: string };
  assert.equal(body.ok, false);
  assert.ok(typeof body.error === 'string');
});

test('POST /api/contact honeypot returns 200 ok', async (t) => {
  const app = await buildApp({ logger: false });
  t.after(() => app.close());

  const res = await app.inject({
    method: 'POST',
    url: '/api/contact',
    payload: {
      name: 'Bot McBotface',
      email: 'bot@example.com',
      message: 'hello hello hello hello',
      company: 'i-am-a-bot',
    },
  });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.payload), { ok: true });
});

test('GET /api/admin/contacts without token is 401', async (t) => {
  const app = await buildApp({ logger: false });
  t.after(() => app.close());

  const res = await app.inject({ method: 'GET', url: '/api/admin/contacts' });

  assert.equal(res.statusCode, 401);
});
