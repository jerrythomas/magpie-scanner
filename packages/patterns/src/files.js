export const filePatterns = {
	metadata: [
		{
			pattern: /(?<metadata>^metadata\.(json|db))$/,
			description: 'Standard metadata JSON',
			example: 'metadata.json',
			expected: { metadata: 'metadata.json' }
		},
		{
			pattern: /(?<metadata>^\.metadata\.(json|db))$/,
			description: 'Hidden metadata file',
			example: '.metadata.json',
			expected: { metadata: '.metadata.json' }
		}
	]
}
