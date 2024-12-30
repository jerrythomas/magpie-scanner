import { globSync } from 'glob'
import { basename, extname } from 'path'
import { statSync } from 'fs'
import { ALL_SUPPORTED_EXTENSIONS } from './constants'
import { groupImagesByFolder, groupVideoContent } from './groupers'

/**
 * Scan a folder recursively and extract the following information for each file:
 *
 * @param {string} folderPath - Path to the folder to scan
 * @returns {import('./types').FileInfo[]} - Array of file information objects
 */
export function scanFolder(folderPath) {
	const files = globSync(`${folderPath}/**/*`, { dot: true })
		.map((file) => ({
			path: file,
			filename: basename(file),
			extension: extname(file).slice(1).toLowerCase()
		}))
		.filter(({ extension }) => ALL_SUPPORTED_EXTENSIONS.includes(extension))
		.map((file) => ({ ...file, size: statSync(file.path).size }))
	return files
}

/**
 * Scan folder and group files where applicable
 * @param {string} folderPath - Path to the folder to scan
 * @returns {Array<import('./types').FileInfo|import('./types').MediaGroup>}
 */
export function scanAndGroup(folderPath) {
	// Get all files
	const files = scanFolder(folderPath)
	const result = []
	const processed = new Set()

	// First, try to group images with metadata
	const imageGroups = groupImagesByFolder(files)
	imageGroups.forEach((group) => {
		result.push(group)
		group.items.forEach((file) => processed.add(file.path))
	})

	// Then, try to group videos with subtitles
	const videoGroups = groupVideoContent(files.filter((file) => !processed.has(file.path)))
	videoGroups.forEach((group) => {
		result.push(group)
		group.items.forEach((file) => processed.add(file.path))
	})

	// Add remaining unprocessed files
	files.filter((file) => !processed.has(file.path)).forEach((file) => result.push(file))

	return result
}
