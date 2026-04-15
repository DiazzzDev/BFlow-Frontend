import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {

      // ── Variables ──────────────────────────────────────
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',

      // ── Calidad de código ──────────────────────────────
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-shadow': 'error',                             // evita re-declarar variables de scope padre
      'no-param-reassign': 'error',                     // no mutar parámetros de funciones
      'no-nested-ternary': 'error',                     // evita ternarios anidados ilegibles
      'prefer-destructuring': ['warn', {                // prefiere const { x } = obj
        object: true,
        array: false,
      }],

      // ── Imports ────────────────────────────────────────
      'import/order': ['warn', {                        // ordena los imports
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      }],
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'warn',

      // ── React ──────────────────────────────────────────
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': 'error',  // no crear componentes dentro de renders
      'react/jsx-curly-brace-presence': ['warn', {     // evita {"texto"}, usa solo texto
        props: 'never',
        children: 'never',
      }],
      'react/hook-use-state': 'warn',                  // nombre consistente [x, setX]

      // ── Accesibilidad ──────────────────────────────────
      'jsx-a11y/alt-text': 'warn',                     // imágenes con alt
      'jsx-a11y/anchor-is-valid': 'warn',              // links válidos
      'jsx-a11y/click-events-have-key-events': 'warn', // clicks con keyboard fallback
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',

    },
  },
])