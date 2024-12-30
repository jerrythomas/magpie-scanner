import { pathPatterns } from '../config/patterns/index'
import { VALID_MEDIA_TYPES, TYPE_ALIASES } from '../config/constants'

/**
 * Applies cleanup rules to a string
 * @param {string} text
 * @param {Array<{find: RegExp, replace: string}>} rules
 * @returns {string}
 */
export function applyCleanup(text, rules) {
	return rules.reduce((result, rule) => result.replace(rule.find, rule.replace), text).trim()
}

/**
 * Attempts to match a string against multiple patterns
 * @param {string} text
 * @param {Array<{pattern: RegExp, description: string}>} patterns
 * @param {string} errorCode
 * @returns {RegExpMatchArray}
 */
export function findMatch(text, patternList, errorCode) {
	for (const pattern of patternList) {
		const match = text.match(pattern.pattern)
		if (match)
			return {
				match,
				groups: match.groups,
				pattern
			}
	}
	return null
}

/**
 * Find the closest matching media type
 * @param {string} type - Type string to match
 * @returns {MediaType} - Matched media type or 'unknown'
 */
export const findClosestMediaType = (type) => {
	if (!type) return 'unknown'

	const normalizedType = type.toLowerCase().trim()

	// Check for exact matches first
	if (VALID_MEDIA_TYPES.includes(normalizedType)) {
		return normalizedType
	}

	// Check aliases
	if (TYPE_ALIASES[normalizedType]) {
		return TYPE_ALIASES[normalizedType]
	}

	return 'unknown'
}
/**
 * Detects media type from a file path
 * @param {string} path - File path to analyze
 * @returns {MediaType} - Detected media type or 'unknown'
 */
export const detectMediaType = (path) => {
	const result = findMatch(path, pathPatterns.media)

	if (!result) return 'unknown'
	// If pattern has explicit type in groups, find closest match
	if (result.groups.type) {
		return findClosestMediaType(result.groups.type)
	}

	// If pattern has a tag, find closest match
	if (result.pattern.tag) {
		return findClosestMediaType(result.pattern.tag)
	}

	// Default to show if no explicit type found
	// return 'unknown'
}
