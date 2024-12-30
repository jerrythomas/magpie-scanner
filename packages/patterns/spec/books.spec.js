import { describe, it, expect } from 'vitest'
import { bookPatterns } from '../src/books'

describe('Book Patterns', () => {
	it('should include all keys', () => {
		expect(Object.keys(bookPatterns)).toEqual(['title', 'author', 'year', 'cleanup'])
	})

	describe('Author', () => {
		bookPatterns.author.forEach(({ pattern, description, example, expected }) => {
			it(`should match "${description}"`, () => {
				expect(example).toMatch(pattern)
			})
			it('should extract author correctly', () => {
				const match = example.match(pattern)
				expect(match.groups).toEqual(expected)
			})
		})
	})
	describe('Title', () => {
		bookPatterns.title.forEach(({ pattern, description, example, expected }) => {
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
		bookPatterns.year.forEach(({ pattern, description, example, expected }) => {
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
