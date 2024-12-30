import { describe, it, expect } from 'vitest'
import { filePatterns } from '../src/files'

describe('File Patterns', () => {
	it('should include all keys', () => {
		expect(Object.keys(filePatterns)).toEqual(['metadata'])
	})

	describe('Media', () => {
		filePatterns.metadata.forEach(({ pattern, description, example, expected }) => {
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
