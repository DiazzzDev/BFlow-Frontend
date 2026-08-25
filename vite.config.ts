import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		sitemap({
			hostname: 'https://www.bflow-studio.com',
			dynamicRoutes: ['/', '/terms', '/privacy', '/cookies'],
			exclude: ['/app/**', '/auth/**'],
			robots: [{ userAgent: '*', disallow: ['/app/', '/auth/'], allow: ['/'] }],
			generateRobotsTxt: false,
			changefreq: 'weekly',
			priority: 0.8,
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
})