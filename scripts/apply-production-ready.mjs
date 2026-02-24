/**
 * FILE: scripts/apply-production-ready.mjs
 *
 * Applies a small set of production-minded housekeeping changes to the repo.
 * Safe to run multiple times (idempotent).
 *
 * NOTE: Save this file as UTF-8 (no BOM).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @returns {string} */
function resolveRepoRoot() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '..');
}

const ROOT = resolveRepoRoot();

/** @param {...string} parts @returns {string} */
function filePath(...parts) {
  return path.join(ROOT, ...parts);
}

/** @param {string} p @returns {boolean} */
function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

/** @param {string} text @returns {'\n' | '\r\n'} */
function detectEol(text) {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

/** @param {string} p @returns {{ text: string, eol: '\n' | '\r\n' }} */
function readText(p) {
  const text = fs.readFileSync(p, 'utf8');
  return { text, eol: detectEol(text) };
}

/** @param {string} p @param {string} content @param {'\n' | '\r\n'} [eolHint] */
function writeText(p, content, eolHint = '\n') {
  const normalized = content.replace(/\r?\n/g, eolHint);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, normalized, 'utf8');
}

/**
 * @param {string} p
 * @param {string[]} lines
 * @returns {boolean}
 */
function ensureLines(p, lines) {
  const { text, eol } = readText(p);
  const existing = new Set(text.split(/\r?\n/));
  const toAdd = lines.filter((l) => !existing.has(l));
  if (toAdd.length === 0) return false;

  const hasTrailingNewline = text.endsWith('\n') || text.endsWith('\r\n');
  const next = text + (hasTrailingNewline ? '' : eol) + toAdd.join(eol) + eol;

  writeText(p, next, eol);
  return true;
}

/**
 * @param {string} p
 * @param {string} content
 * @returns {boolean}
 */
function upsertFile(p, content) {
  if (exists(p)) return false;
  writeText(p, content, '\n');
  return true;
}

/** @param {string} p @param {(text: string) => string} replacer @returns {boolean} */
function replaceAll(p, replacer) {
  const { text, eol } = readText(p);
  const next = replacer(text);
  if (next === text) return false;
  writeText(p, next, eol);
  return true;
}

function ensureGitAttributes() {
  const p = filePath('.gitattributes');
  if (!exists(p)) {
    const content = [
      '# Normalize line endings',
      '* text=auto eol=lf',
      '',
      '# Ensure common text formats use LF',
      '*.sh text eol=lf',
      '*.mjs text eol=lf',
      '*.cjs text eol=lf',
      '*.js text eol=lf',
      '*.ts text eol=lf',
      '*.tsx text eol=lf',
      '*.json text eol=lf',
      '*.yml text eol=lf',
      '*.yaml text eol=lf',
      '*.md text eol=lf',
      '',
    ].join('\n');
    writeText(p, content, '\n');
    return true;
  }

  return ensureLines(p, [
    '# Normalize line endings',
    '* text=auto eol=lf',
    '',
    '# Ensure common text formats use LF',
    '*.sh text eol=lf',
    '*.mjs text eol=lf',
    '*.cjs text eol=lf',
    '*.js text eol=lf',
    '*.ts text eol=lf',
    '*.tsx text eol=lf',
    '*.json text eol=lf',
    '*.yml text eol=lf',
    '*.yaml text eol=lf',
    '*.md text eol=lf',
  ]);
}

function ensureEditorConfig() {
  const p = filePath('.editorconfig');
  return upsertFile(
    p,
    [
      'root = true',
      '',
      '[*]',
      'charset = utf-8',
      'end_of_line = lf',
      'insert_final_newline = true',
      'trim_trailing_whitespace = true',
      'indent_style = space',
      'indent_size = 2',
      '',
      '[*.md]',
      'trim_trailing_whitespace = false',
      '',
    ].join('\n'),
  );
}

function ensureVsCodeSettings() {
  const p = filePath('.vscode', 'settings.json');

  if (!exists(p)) {
    const content =
      JSON.stringify(
        {
          'editor.formatOnSave': true,
          'editor.defaultFormatter': 'esbenp.prettier-vscode',
          'editor.codeActionsOnSave': { 'source.fixAll.eslint': 'explicit' },
          'files.eol': '\n',
        },
        null,
        2,
      ) + '\n';

    writeText(p, content, '\n');
    return true;
  }

  return replaceAll(p, (text) => {
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return text;
    }

    const next = {
      ...json,
      'editor.formatOnSave': true,
      'files.eol': '\n',
      'editor.codeActionsOnSave': {
        ...(json['editor.codeActionsOnSave'] ?? {}),
        'source.fixAll.eslint': 'explicit',
      },
    };

    return JSON.stringify(next, null, 2) + '\n';
  });
}

function updateGitignore() {
  const p = filePath('.gitignore');
  if (!exists(p)) return false;

  return ensureLines(p, [
    '',
    '# OS / Editor',
    '.DS_Store',
    'Thumbs.db',
    '.idea',
    '',
    '# Env (keep *.example committed)',
    '.env',
    '.env.local',
    '.env.*.local',
    '',
    '# Logs',
    '*.log',
    '',
    '# Build',
    '**/.next/**',
    '**/out/**',
    '**/dist/**',
    '**/build/**',
    'coverage',
    '.turbo',
  ]);
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

function updatePackageJson() {
  const p = filePath('package.json');
  if (!exists(p)) return false;

  const raw = fs.readFileSync(p, 'utf8');
  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch {
    console.warn('[skip] package.json is not valid JSON');
    return false;
  }

  pkg.scripts ??= {};

  /** @param {string} key @param {string} value */
  function ensureScript(key, value) {
    if (typeof pkg.scripts[key] === 'string' && pkg.scripts[key].trim().length > 0) {
      return false;
    }
    pkg.scripts[key] = value;
    return true;
  }

  let changed = false;

  changed = ensureScript('format', 'prettier . --write') || changed;
  changed = ensureScript('format:check', 'prettier . --check') || changed;
  changed = ensureScript('postinstall', 'npm run build -w packages/shared') || changed;

  changed =
    ensureScript(
      'typecheck',
      'npm run build -w packages/shared && npm run typecheck -w apps/web && npm run typecheck -w apps/api && npm run typecheck -w packages/shared',
    ) || changed;

  changed =
    ensureScript('housekeeping', 'node scripts/apply-production-ready.mjs') || changed;

  if (!changed) return false;

  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
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
    console.warn('[skip] Could not find the Install step in .github/workflows/ci.yml');
    return false;
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

function updateApiRoutesWarn() {
  const p = filePath('apps', 'api', 'src', 'routes', 'index.ts');
  if (!exists(p)) return false;

  const { text, eol } = readText(p);
  if (text.includes('admin routes disabled')) return false;

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

  console.warn(
    '[skip] Could not safely patch apps/api/src/routes/index.ts (block not found)',
  );
  return false;
}

function addWebImportOrderRule() {
  const p = filePath('apps', 'web', 'eslint.config.mjs');
  if (!exists(p)) return false;

  const { text, eol } = readText(p);
  if (text.includes("'import/order'") || text.includes('"import/order"')) return false;

  let next = text;

  if (
    !next.includes("from 'eslint-plugin-import'") &&
    !next.includes('from "eslint-plugin-import"')
  ) {
    const importBlockMatch = next.match(/^([\s\S]*?)(\r?\n\r?\n)/);
    if (!importBlockMatch) {
      console.warn('[skip] Could not locate import block to add eslint-plugin-import');
      return false;
    }
    next = next.replace(
      importBlockMatch[0],
      `${importBlockMatch[1]}${eol}import importPlugin from 'eslint-plugin-import';${eol}${eol}`,
    );
  }

  const marker = ']);';
  const idx = next.lastIndexOf(marker);
  if (idx === -1) {
    console.warn("[skip] Could not find closing ']);' in apps/web/eslint.config.mjs");
    return false;
  }

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

  next = next.slice(0, idx) + insert + next.slice(idx);

  writeText(p, next, eol);
  return true;
}

function main() {
  const changes = [];

  if (ensureGitAttributes()) changes.push('.gitattributes');
  if (ensureEditorConfig()) changes.push('.editorconfig');
  if (ensureVsCodeSettings()) changes.push('.vscode/settings.json');

  if (updateGitignore()) changes.push('.gitignore');
  if (ensurePrettierIgnore()) changes.push('.prettierignore');
  if (updatePackageJson()) changes.push('package.json');
  if (insertCiFormatCheck()) changes.push('.github/workflows/ci.yml');

  if (updateApiRoutesWarn()) changes.push('apps/api/src/routes/index.ts');
  if (addWebImportOrderRule()) changes.push('apps/web/eslint.config.mjs');

  console.log('Applied changes to:');
  for (const c of changes) console.log(' -', c);
  if (changes.length === 0) console.log(' - (nothing; already up to date)');
  console.log('\nNext: review with `git diff`, then run lint/typecheck/tests.');
}

main();
