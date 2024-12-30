import { commonPatterns } from './common.js'

export const moviePatterns = {
	title: [
		{
			pattern: /^(?<title>.+?)\s*\((?<year>\d{4})\).*$/,
			description: 'Title (Year)',
			example: 'The Matrix (1999)',
			expected: { title: 'The Matrix', year: '1999' }
		}
		// ... other title patterns
	],

	quality: [
		{
			pattern: /(?<quality>2160p|1080p|720p|480p)/i,
			description: 'Resolution',
			example: '1080p',
			expected: { quality: '1080p' }
		}
		// ... other quality patterns
	],

	year: commonPatterns.year,
	cleanup: commonPatterns.cleanup
}
