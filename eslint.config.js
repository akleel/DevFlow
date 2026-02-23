// FILE: eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

const JS_TS_FILES = ['**/*.{js,mjs,cjs,ts,tsx,mts,cts}'];

const NODE_TOOLING_FILES = [
  'scripts/**/*.{js,mjs,cjs,ts,mts,cts}',
  '**/*.{config,conf}.{js,mjs,cjs,ts,mts,cts}',
  '**/*.config.{js,mjs,cjs,ts,mts,cts}',
];

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.turbo/**',
      'packages/config/**',
      'eslint.config.*',
      '.prettierrc.*',
      'package-lock.json',
    ],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Ensure modern parsing defaults for all JS/TS files.
  {
    files: JS_TS_FILES,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // ✅ Node environment for repo tooling scripts/config files.
  {
    files: NODE_TOOLING_FILES,
    languageOptions: {
      globals: globals.node,
    },
  },

  prettier,

  {
    files: JS_TS_FILES,
    plugins: { import: importPlugin },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
];
