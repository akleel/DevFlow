/**
 * scripts/apply-production-ready.mjs
 *
 * Applies a small set of production-minded housekeeping changes to the repo.
 * Safe to run multiple times (idempotent).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function filePath(...parts) {
  return path.join(ROOT, ...parts);
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function detectEol(text) {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

function readText(p) {
  const text = fs.readFileSync(p, 'utf8');
  return { text, eol: detectEol(text) };
}

function writeText(p, content, eolHint = '\n') {
  const normalized = content.replace(/\r?\n/g, eolHint);
  fs.writeFileSync(p, normalized, 'utf8');
}

function ensureLines(p, lines) {
  const { text, eol } = readText(p);
  const existing = new Set(text.split(/\r?\n/));
  const toAdd = lines.filter((l) => !existing.has(l));
  if (toAdd.length === 0) return false;

  const needsTrailingNewline = !text.endsWith('\n') && !text.endsWith('\r\n');
  const next = text + (needsTrailingNewline ? eol : '') + toAdd.join(eol) + eol;

  writeText(p, next, eol);
  return true;
}

function upsertFile(p, content) {
  if (exists(p)) return false;
  fs.mkdirSync(path.dirname(p), { recursive: true });
  writeText(p, content, '\n');
  return true;
}

function updatePackageJson() {
  const p = filePath('package.json');
  const raw = fs.readFileSync(p, 'utf8');
  const pkg = JSON.parse(raw);

  pkg.scripts ??= {};

  pkg.scripts['format'] ??= 'prettier . --write';
  pkg.scripts['format:check'] = 'prettier . --check';
  pkg.scripts['postinstall'] = 'npm run build -w packages/shared';
  pkg.scripts['typecheck'] =
    'npm run build -w packages/shared && npm run typecheck -w apps/web && npm run typecheck -w apps/api && npm run typecheck -w packages/shared';

  const next = JSON.stringify(pkg, null, 2) + '\n';
  fs.writeFileSync(p, next, 'utf8');
  return true;
}

function insertCiFormatCheck() {
  const p = filePath('.github', 'workflows', 'ci.yml');
  if (!exists(p)) return false;

  const { text, eol } = readText(p);
  if (text.includes('npm run format:check') || text.includes('name: Format check')) {
    return false;
  }

  const re = /^(\s*)- name:\s*Install\s*\r?\n(\s*)run:\s*npm ci\s*\r?\n/m;
  const match = text.match(re);
  if (!match) {
    throw new Error('Could not find the Install step in .github/workflows/ci.yml');
  }

  const itemIndent = match[1];
  const runIndent = match[2];

  const insert =
    `${itemIndent}- name: Format check${eol}` +
    `${runIndent}run: npm run format:check${eol}${eol}`;

  const next = text.replace(re, (m) => m + insert);
  writeText(p, next, eol);
  return true;
}

function updateGitignore() {
  const p = filePath('.gitignore');
  if (!exists(p)) return false;
  return ensureLines(p, ['**/.next/**', '**/out/**', '**/dist/**', '**/build/**']);
}

function ensurePrettierIgnore() {
  const p = filePath('.prettierignore');
  if (!exists(p)) {
    writeText(
      p,
      [
        'node_modules',
        '**/dist',
        '**/build',
        '**/.next',
        '**/out',
        'coverage',
        '.turbo',
        '.cache',
        '',
      ].join('\n'),
      '\n',
    );
    return true;
  }
  return ensureLines(p, [
    'node_modules',
    '**/dist',
    '**/build',
    '**/.next',
    '**/out',
    'coverage',
    '.turbo',
    '.cache',
  ]);
}

function addApiReadmeIfMissing() {
  const p = filePath('apps', 'api', 'README.md');
  return upsertFile(
    p,
    `# DevFlow API (\`apps/api\`)

Backend for **DevFlow** — a small but production-minded Fastify service that demonstrates:

- **Route modules** (contact + optional admin endpoints)
- **Validation at the edge** (Zod)
- **Rate limiting** (\`@fastify/rate-limit\`)
- **Request IDs** propagated end-to-end
- **SQLite via Drizzle ORM** (simple, portable, easy to demo)

## Endpoints

- \`GET /health\` — health check
- \`POST /api/contact\` — contact form submission
- \`GET /api/admin/contacts?limit=50\` — list recent submissions (dev-only)

## Environment variables

Create \`apps/api/.env\` from \`apps/api/.env.example\`.

Required:

- \`WEB_ORIGIN\` — allowed CORS origin for the web app
- \`ADMIN_TOKEN\` — static admin token (dev-only)
- \`DATABASE_URL\` — SQLite file URL (\`file:./storage/devflow.db\`)
- \`PORT\` — server port (default 3001)

Optional:

- \`ENABLE_ADMIN=true\` — enables \`/api/admin/*\` (dev-only)
- \`TRUST_PROXY=none|private|all\` — controls whether forwarded IP headers are trusted

## Development

From repo root:

\`\`\`bash
npm run dev:api
\`\`\`

## Database

Migrations are managed with Drizzle:

\`\`\`bash
npm run db:generate -w apps/api
npm run db:migrate -w apps/api
\`\`\`

## Tests

\`\`\`bash
npm test -w apps/api
\`\`\`

Tests use Fastify's \`app.inject()\` with Node's built-in test runner.
`,
  );
}

function updateApiRoutesWarn() {
  const p = filePath('apps', 'api', 'src', 'routes', 'index.ts');
  if (!exists(p)) return false;

  const { text, eol } = readText(p);
  if (text.includes('admin routes disabled')) return false;

  const re =
    /if\s*\(\s*env\.ENABLE_ADMIN\s*\)\s*\{\s*\r?\n([\s\S]*?)await\s+app\.register\s*\(\s*adminRoutes\s*,\s*\{\s*prefix:\s*'\/api'\s*\}\s*\)\s*;\s*\r?\n([\s\S]*?)\}\s*/m;

  if (!re.test(text)) {
    // fallback: only handle the most common exact block
    const exact =
      "if (env.ENABLE_ADMIN) {\n    await app.register(adminRoutes, { prefix: '/api' });\n  }\n";
    if (text.includes(exact)) {
      const next = text.replace(
        exact,
        "if (env.ENABLE_ADMIN) {\n    await app.register(adminRoutes, { prefix: '/api' });\n  } else {\n    app.log.warn('admin routes disabled (set ENABLE_ADMIN=true to enable)');\n  }\n",
      );
      writeText(p, next, eol);
      return true;
    }
    throw new Error(
      'Could not safely locate adminRoutes registration block in apps/api/src/routes/index.ts',
    );
  }

  const next = text.replace(
    /if\s*\(\s*env\.ENABLE_ADMIN\s*\)\s*\{\s*\r?\n([\s\S]*?)await\s+app\.register\s*\(\s*adminRoutes\s*,\s*\{\s*prefix:\s*'\/api'\s*\}\s*\)\s*;\s*\r?\n([\s\S]*?)\}\s*/m,
    (m) => {
      // Preserve indentation based on the existing block.
      const indentMatch = m.match(/^(\s*)if/m);
      const base = indentMatch ? indentMatch[1] : '';
      const inner = base + '  ';
      return (
        `${base}if (env.ENABLE_ADMIN) {${eol}` +
        `${inner}await app.register(adminRoutes, { prefix: '/api' });${eol}` +
        `${base}} else {${eol}` +
        `${inner}app.log.warn('admin routes disabled (set ENABLE_ADMIN=true to enable)');${eol}` +
        `${base}}${eol}`
      );
    },
  );

  writeText(p, next, eol);
  return true;
}

function addWebImportOrderRule() {
  const p = filePath('apps', 'web', 'eslint.config.mjs');
  if (!exists(p)) return false;

  const { text, eol } = readText(p);
  if (text.includes("'import/order'") || text.includes('"import/order"')) return false;

  const marker = ']);';
  const idx = text.lastIndexOf(marker);
  if (idx === -1)
    throw new Error("Could not find closing ']);' in apps/web/eslint.config.mjs");

  const insert =
    `${eol}  {${eol}` +
    `    plugins: { import: importPlugin },${eol}` +
    `    rules: {${eol}` +
    `      'import/order': [${eol}` +
    `        'warn',${eol}` +
    `        {${eol}` +
    `          'newlines-between': 'always',${eol}` +
    `          alphabetize: { order: 'asc', caseInsensitive: true },${eol}` +
    `        },${eol}` +
    `      ],${eol}` +
    `    },${eol}` +
    `  },${eol}`;

  const next = text.slice(0, idx) + insert + text.slice(idx);
  writeText(p, next, eol);
  return true;
}

function main() {
  const changes = [];

  if (updateGitignore()) changes.push('.gitignore');
  if (ensurePrettierIgnore()) changes.push('.prettierignore');
  if (updatePackageJson()) changes.push('package.json');
  if (insertCiFormatCheck()) changes.push('.github/workflows/ci.yml');
  if (addApiReadmeIfMissing()) changes.push('apps/api/README.md');
  if (updateApiRoutesWarn()) changes.push('apps/api/src/routes/index.ts');
  if (addWebImportOrderRule()) changes.push('apps/web/eslint.config.mjs');

  console.log('Applied changes to:');
  for (const c of changes) console.log(' -', c);
  if (changes.length === 0) console.log(' - (nothing; already up to date)');
  console.log('\nNext: review with `git diff`, then run lint/typecheck/tests.');
}

main();
