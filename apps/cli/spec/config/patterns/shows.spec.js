import { describe, it, expect } from 'vitest'
import { showPatterns } from '../../../src/config/patterns/shows'

describe('Show Patterns', () => {
	it('should include all keys', () => {
		expect(Object.keys(showPatterns)).toEqual(['series', 'episode', 'year', 'cleanup'])
	})

	describe('Series', () => {
		showPatterns.series.forEach(({ pattern, description, example, expected }) => {
			it(`should match "${description}"`, () => {
				expect(example).toMatch(pattern)
			})
			it('should extract author correctly', () => {
				const match = example.match(pattern)
				expect(match.groups).toEqual(expected)
			})
		})
	})
	describe('Episode', () => {
		showPatterns.episode.forEach(({ pattern, description, example, expected }) => {
			it(`should match "${description}"`, () => {
				expect(example).toMatch(pattern)
			})
			it('should extract episode correctly', () => {
				const match = example.match(pattern)
				expect(match.groups).toEqual(expected)
			})
		})
	})

	describe('Year', () => {
		showPatterns.year.forEach(({ pattern, description, example, expected }) => {
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
