import { describe, it, expect } from 'vitest'
// skipcq: JS-C1003 - Importing all components for verification
import * as functions from '../src/index.js'

describe('functions', () => {
	it('should contain all exported actions', () => {
		expect(Object.keys(functions)).toEqual(['scanAndGroup'])
	})
})
