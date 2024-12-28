import { describe, it, expect } from 'vitest'
import { patterns } from '../../src/config/patterns'

describe('Patterns Configuration', () => {
	describe('Series Patterns', () => {
		patterns.series.forEach(({ pattern, description, example }) => {
			it(`should match ${description}`, () => {
				expect(example).toMatch(pattern)
			})
		})
	})

	describe('Episode Patterns', () => {
		patterns.episode.forEach(({ pattern, description, example }) => {
			it(`should match ${description}`, () => {
				expect(example).toMatch(pattern)
			})
		})
	})

	describe('Title Patterns', () => {
		patterns.title.forEach(({ pattern, description, example }) => {
			it(`should match ${description}`, () => {
				expect(example).toMatch(pattern)
			})
		})
	})

	describe('Format Pattern', () => {
		it('should match file extension', () => {
			expect(patterns.format.example).toMatch(patterns.format.pattern)
		})
	})
})
