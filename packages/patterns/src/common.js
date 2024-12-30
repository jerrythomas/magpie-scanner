export const commonPatterns = {
	year: [
		{
			pattern: /\((?<year>\d{4})\)/,
			description: 'Year in parentheses',
			example: '(2023)',
			expected: { year: '2023' }
		},
		{
			pattern: /[\s.](?<year>\d{4})(?:[\s.]|$)/,
			description: 'Year with separators',
			example: ' 2023',
			expected: { year: '2023' }
		}
	],

	cleanup: {
		title: [
			{ find: /\./g, replace: ' ' },
			{ find: /\s+/g, replace: ' ' },
			{ find: /_/g, replace: ' ' },
			{ find: /\[.*?\]/g, replace: '' }
		]
	}
}
