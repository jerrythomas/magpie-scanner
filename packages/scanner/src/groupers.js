import { basename, dirname } from 'path'
import { SUPPORTED_EXTENSIONS, METADATA_FILES } from './constants'

/**
 * Sort files within a group - metadata files first, then alphabetically by filename
 * @param {import('./types.js').FileInfo} a - First file
 * @param {import('./types.js').FileInfo} b - Second file
 * @returns {number}
 */
export function sortGroupFiles(a, b) {
	const aIsMetadata = METADATA_FILES.includes(a.filename)
	const bIsMetadata = METADATA_FILES.includes(b.filename)

	if (aIsMetadata && !bIsMetadata) return -1
	if (!aIsMetadata && bIsMetadata) return 1
	return a.filename.localeCompare(b.filename)
}

/**
 * Groups image files with their metadata JSON files by directory
 * @param {import('./types.js').FileInfo[]} files - Array of file information objects
 * @returns {import('./types.js').MediaGroup} Array of image groups
 */
export function groupImagesByFolder(files) {
	const imageFiles = files.filter(
		(file) =>
			SUPPORTED_EXTENSIONS.image.includes(file.extension) ||
			METADATA_FILES.some((meta) => file.filename === meta)
	)

	// Group by directory
	const groups = imageFiles.reduce((acc, file) => {
		const dirPath = dirname(file.path)
		if (!acc[dirPath]) {
			acc[dirPath] = {
				name: basename(dirPath),
				path: dirPath,
				size: 0,
				items: []
			}
		}
		acc[dirPath].items.push(file)
		acc[dirPath].size += file.size
		return acc
	}, {})

	// Sort files within each group
	return Object.values(groups).map((group) => ({
		...group,
		items: group.items.sort(sortGroupFiles)
	}))
}

/**
 * Groups video files with their subtitle files by basename
 * @param {Array<FileInfo>} files - Array of file information objects
 * @returns {Array<MediaGroup>} Array of video groups
 */
export function groupVideoContent(files) {
	const mediaFiles = files.filter(
		(file) =>
			SUPPORTED_EXTENSIONS.video.includes(file.extension) ||
			SUPPORTED_EXTENSIONS.subtitle.includes(file.extension)
	)

	// Group by basename and directory
	const groups = mediaFiles.reduce((acc, file) => {
		const dirPath = dirname(file.path)
		const baseFileName = basename(file.filename, `.${file.extension}`)
		const groupKey = `${dirPath}/${baseFileName}`

		if (!acc[groupKey]) {
			acc[groupKey] = {
				name: baseFileName,
				path: dirPath,
				size: 0,
				items: []
			}
		}
		acc[groupKey].items.push(file)
		acc[groupKey].size += file.size
		return acc
	}, {})

	// Filter out groups that don't have a video file
	return Object.values(groups)
		.filter((group) =>
			group.items.some((file) => SUPPORTED_EXTENSIONS.video.includes(file.extension))
		)
		.filter((group) => group.items.length > 1)
}
