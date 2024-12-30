import { patterns } from './config/patterns/index.js'
import { basename, extname } from 'path'

export function parseSeries(filename) {
	const withoutExt = filename.replace(/\.[^/.]+$/, '')
	const match = findMatch(withoutExt, patterns.series, 'INVALID_SERIES')
	return applyCleanup(match[1], patterns.cleanup.series)
}

export function parseEpisodeNumbers(filename) {
	const match = findMatch(filename, patterns.episode, 'INVALID_EPISODE_NUMBERS')
	return {
		season: parseInt(match[1], 10),
		episode: parseInt(match[2], 10)
	}
}

export function parseTitle(filename) {
	const withoutExt = filename.replace(/\.[^/.]+$/, '')
	const match = findMatch(withoutExt, patterns.title, 'INVALID_TITLE')
	return applyCleanup(match[1], patterns.cleanup.title)
}

export function parseFormat(filename) {
	return extname(filename).slice(1).toLowerCase()
}

export function parseFilename(filepath) {
	let filename = basename(filepath)
	filename = filename.replace(extname(filename), '')
	filename = applyCleanup(filename, patterns.cleanup.file)
	return filename
}

export function parseEpisode(filepath) {
	try {
		const format = parseFormat(filepath)
		const filename = parseFilename(filepath)
		const series = parseSeries(filename)
		const { season, episode } = parseEpisodeNumbers(filename)
		const title = parseTitle(filename)

		return {
			series,
			season,
			episode,
			title,
			format
		}
	} catch (error) {
		if (error instanceof MediaParseError) {
			throw error
		}
		throw new MediaParseError('Failed to parse episode information', 'PARSE_FAILED', {
			filename: filepath,
			originalError: error.message
		})
	}
}
