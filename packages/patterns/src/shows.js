import { commonPatterns } from './common.js'

export const showPatterns = {
	series: [
		{
			pattern:
				/^(?<series>.+?)(?:\s*-\s*)[Ss]?(?<season>\d+)[Ee](?<episode>\d+)(?:\s*-\s*)?(?<title>.*)/,
			description: 'Series Name - S01E01 - Title',
			example: 'The Office - S01E01 - Pilot',
			expected: { series: 'The Office', season: '01', episode: '01', title: 'Pilot' }
		},
		{
			pattern: /^(?<series>.+?)(?:\s+)[Ss]?(?<season>\d+)[Ee](?<episode>\d+)(?:\s*)(?<title>.*)/,
			description: 'Series S01E01',
			example: 'The Office S01E01 Pilot',
			expected: { series: 'The Office', season: '01', episode: '01', title: 'Pilot' }
		},
		{
			pattern: /^(?<series>.+?)(?:\s+)(?<season>\d+)x(?<episode>\d+)(?:\s*)(?<title>.*)/,
			description: 'series 1x01 title',
			example: 'The Office 1x01 Pilot',
			expected: { series: 'The Office', season: '1', episode: '01', title: 'Pilot' }
		}
	],

	episode: [
		{
			pattern: /[Ss](?<season>\d{1,2})[Ee](?<episode>\d{1,2})(?:\s*)(?<title>.*)/,
			description: 'S01E01 format',
			example: 'S01E01 Pilot',
			expected: { season: '01', episode: '01', title: 'Pilot' }
		},
		{
			pattern: /(?<season>\d+)x(?<episode>\d+)(?:\s*)(?<title>.*)/,
			description: '1x01 format',
			example: '1x01 Pilot',
			expected: { season: '1', episode: '01', title: 'Pilot' }
		}
	],

	year: commonPatterns.year,
	cleanup: commonPatterns.cleanup
}
