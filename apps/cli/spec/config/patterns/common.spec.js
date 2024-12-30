import { describe, it, expect } from 'vitest'
import { commonPatterns } from '../../../src/config/patterns/common'

describe('Common Patterns', () => {
	it('should include all keys', () => {
		expect(Object.keys(commonPatterns)).toEqual(['year', 'cleanup'])
		expect(Object.keys(commonPatterns.cleanup)).toEqual(['title'])
	})
	describe('Year', () => {
		commonPatterns.year.forEach(({ pattern, description, example, expected }) => {
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
