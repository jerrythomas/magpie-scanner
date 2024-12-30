export const pathPatterns = {
	media: [
		{
			pattern: /(?<series>[^/]+)\/season[.\s-]*(?<season>\d+)[^/]*/i,
			description: 'Series name from folder structure',
			example: '/downloads/The Office/Season 1',
			expected: { series: 'The Office', season: '1' },
			tag: 'show'
		},
		{
			pattern: /(?<series>[^/]+)\/s(?<season>\d+)(?=\/)/i,
			description: 'Series name from abbreviated folder structure',
			example: '/downloads/The Office/S01/Episode 1',
			expected: { series: 'The Office', season: '01' },
			tag: 'show'
		},
		{
			pattern: /(?<type>audio\s*book|comic|movie|show|book)s?(?=\/)/i,
			description: 'Media type from folder structure',
			example: '/show/the office/Season 1/Episode 1',
			expected: { type: 'show' }
		},
		{
			pattern: /(?<type>movie[s?])(?=\/)/i,
			description: 'Movie from movies folder',
			example: '/movies/The Matrix (1999)',
			expected: { type: 'movies' }
		},
		{
			pattern: /(?<type>gallery|memories)(?=\/)/i,
			description: 'Gallery folder structure',
			example: 'Vacation/Gallery/Beach',
			expected: { type: 'Gallery' }
		},
		{
			pattern: /(?<type>comic[s]?)(?=\/)/i,
			description: 'Comics folder structure',
			example: '/Volumes/Comics/Batman',
			expected: { type: 'Comics' }
		}
	]
}
