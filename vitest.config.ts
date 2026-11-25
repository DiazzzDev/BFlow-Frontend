import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		include: [
			'tests/{unit,components,integration}/**/*.{test,spec}.{ts,tsx}',
			'tests/modules/**/*.test.{ts,tsx}',
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/**/*.d.ts', 'src/main.tsx'],
			thresholds: {
				lines: 70,
				functions: 70,
				branches: 70,
				statements: 70,
			},
		},
	},
})
