import { describe, it, expect } from 'vitest'
import { moviePatterns } from '../src/movies'

describe('Movie Patterns', () => {
	it('should include all keys', () => {
		expect(Object.keys(moviePatterns)).toEqual(['title', 'quality', 'year', 'cleanup'])
	})

	describe('Title', () => {
		moviePatterns.title.forEach(({ pattern, description, example, expected }) => {
			it(`should match "${description}"`, () => {
				expect(example).toMatch(pattern)
			})
			it('should extract author correctly', () => {
				const match = example.match(pattern)
				expect(match.groups).toEqual(expected)
			})
		})
	})

	describe('Year', () => {
		moviePatterns.year.forEach(({ pattern, description, example, expected }) => {
			it(`should match "${description}"`, () => {
				expect(example).toMatch(pattern)
			})
			it('should extract year correctly', () => {
				const match = example.match(pattern)
				expect(match.groups).toEqual(expected)
			})
		})
	})
})
