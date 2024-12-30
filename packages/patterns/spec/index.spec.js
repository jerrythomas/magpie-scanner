import { describe, it, expect } from 'vitest'
// skipcq: JS-C1003 - Importing all components for verification
import * as patterns from '../src/index.js'

describe('patterns', () => {
	it('should contain all exported actions', () => {
		expect(Object.keys(patterns)).toEqual([
			'commonPatterns',
			'filePatterns',
			'pathPatterns',
			'showPatterns',
			'moviePatterns',
			'bookPatterns'
		])
	})
})
