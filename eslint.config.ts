import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import tsparser from '@typescript-eslint/parser'

export default tseslint.config(
    {
        ignores: [
            '**/dist/**', 
            '**/node_modules/**', 
            'commitlint.config.cjs', // Esto elimina el error de la terminal
            'vite.config.ts',
            'eslint.config.ts'
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],

        extends: [
        ...tseslint.configs.recommendedTypeChecked,
        ],

        plugins: {
            react,
            import: importPlugin,
            'jsx-a11y': jsxA11y,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            // Reglas de React Hooks y Refresh (que no siempre se auto-cargan bien en flat config)
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

            // Disable JS rules that are covered by TS
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'warn',

            // Calidad de código
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'no-param-reassign': 'error',
            'no-nested-ternary': 'error',
            'prefer-destructuring': ['warn', { object: true, array: false }],

            // Imports
            'import/order': ['warn', {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'always',
            }],
            'import/no-duplicates': 'error',
            'import/no-unused-modules': 'warn',

            // React
            'react/prop-types': 'off',
            'react/self-closing-comp': 'error',
            'react/jsx-no-duplicate-props': 'error',
            'react/jsx-no-useless-fragment': 'warn',
            'react/no-array-index-key': 'warn',
            'react/no-unstable-nested-components': 'error',
            'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
            'react/hook-use-state': 'warn',

            // Accesibilidad
            'jsx-a11y/alt-text': 'warn',
            'jsx-a11y/anchor-is-valid': 'warn',
            'jsx-a11y/click-events-have-key-events': 'warn',
            'jsx-a11y/no-noninteractive-element-interactions': 'warn',
        },
    }
)