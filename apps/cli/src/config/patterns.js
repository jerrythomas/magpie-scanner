export const patterns = {
	series: [
		{
			pattern: /^(.+?)(?:\s*-\s*)[Ss]?\d+[Ee]\d+/,
			description: 'Series Name - S01E01',
			example: 'The Office - S01E01'
		},
		{
			pattern: /^(.+?)(?:\.)[Ss]?\d+[Ee]\d+/,
			description: 'Series.Name.S01E01',
			example: 'The.Office.S01E01'
		},
		{
			pattern: /^(.+?)(?:\s*)\d+x\d+/,
			description: 'Series Name 1x01',
			example: 'The Office 1x01'
		}
	],

	episode: [
		{
			pattern: /[Ss](\d{1,2})[Ee](\d{1,2})/,
			description: 'S01E01 format',
			example: 'S01E01'
		},
		{
			pattern: /(\d{1,2})x(\d{1,2})/,
			description: '1x01 format',
			example: '1x01'
		},
		{
			pattern: /(\d{1})(\d{2})/,
			description: '101 format',
			example: '101'
		}
	],

	title: [
		{
			pattern: /(?:[Ss]\d+[Ee]\d+)[\s|-]*?(.+?)$/,
			description: 'After S01E01 - Title',
			example: 'S01E01 - Pilot'
		},
		{
			pattern: /(?:\d{1,2}x\d{1,2})[\s|-]*?(.+?)$/,
			description: 'After 1x01 - Title',
			example: '1x01 - Pilot'
		},
		{
			pattern: /(?:\d{3,})[\s|-]+?(.+?)$/,
			description: 'After 101 - Title',
			example: '101 - Pilot'
		}
	],

	format: {
		pattern: /\.([^/.]+)$/,
		description: 'File extension',
		example: '.mp4'
	},

	cleanup: {
		series: [
			{ find: /[\s|-]+$/g, replace: '' }, // Remove trailing spaces and hyphens
			{ find: /\./g, replace: ' ' }, // Replace dots with spaces
			{ find: /\s+/g, replace: ' ' } // Normalize spaces
		],
		title: [
			{ find: /^[\s|-]+/g, replace: '' },
			{ find: /^\(/, replace: '' }, // Remove leading parenthesis
			{ find: /\)$/, replace: '' }, // Remove trailing parenthesis
			{ find: /\./g, replace: ' ' } // Replace dots with spaces
		],
		file: [
			{ find: /\s*[_|\+|\.|\-]+\s*/g, replace: ' - ' } // Normalize separators
		]
	}
}
