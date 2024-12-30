import { commonPatterns } from './common.js'

export const bookPatterns = {
	title: [
		{
			pattern: /^(?<title>.+?)\s*-\s*(?<author>[^-]+?)(?:\s*\((?<year>\d{4})\))?$/,
			description: 'Title - Author (Year)',
			example: 'The Great Gatsby - F. Scott Fitzgerald (1925)',
			expected: {
				title: 'The Great Gatsby',
				author: 'F. Scott Fitzgerald',
				year: '1925'
			}
		}
	],

	author: [
		{
			pattern: /\s*-\s*(?<author>[^-(]+?)(?:\s*\(|$)/,
			description: 'Author after dash',
			example: '- F. Scott Fitzgerald',
			expected: { author: 'F. Scott Fitzgerald' }
		}
	],

	year: commonPatterns.year,
	cleanup: commonPatterns.cleanup
}
