import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['**/*.{spec,spec.svelte}.[jt]s'],
		coverage: {
			all: true,
			reporter: ['text', 'html', 'lcov', 'json'],
			include: ['**/src/**'],
			exclude: ['**/spec/**', '**/node_modules/**', '**/dist/**']
		}
	}
})
