import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['**/*.{spec,spec.svelte}.?(c|m)[jt]s?(x)'],
		coverage: {
			reporter: ['text', 'html', 'lcov'],
			all: true,
			include: ['src'],
			exclude: ['spec']
		}
	}
})
