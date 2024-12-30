import { describe, it, expect } from 'vitest'
import { pathPatterns } from '../src/path'

describe('Path Patterns', () => {
	it('should include all keys', () => {
		expect(Object.keys(pathPatterns)).toEqual(['media'])
	})

	describe('Media', () => {
		pathPatterns.media.forEach(({ pattern, description, example, expected }) => {
			it(`should match "${description}"`, () => {
				expect(example).toMatch(pattern)
			})
			it('should extract media correctly', () => {
				const match = example.match(pattern)
				expect(match.groups).toEqual(expected)
			})
		})
	})
})
