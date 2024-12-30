import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { scanFolder } from '../src/scan'
import { groupImagesByFolder, groupVideoContent } from '../src/groupers'
import { mkdir, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import { METADATA_FILES } from '../src/config/constants'

describe('Media Groupers', () => {
	const testDir = 'apps/cli/fixtures/test-groups'
	const testContent = 'test content'

	const imageGalleryMetadata = {
		title: 'Vacation 2023',
		date: '2023-07-15'
	}

	beforeAll(async () => {
		await rm(testDir, { recursive: true, force: true })

		// Create test directory structure
		const structure = {
			gallery1: {
				'metadata.json': imageGalleryMetadata,
				'beach.jpg': testContent,
				'mountain.png': testContent
			},
			gallery2: {
				'.metadata.json': imageGalleryMetadata,
				'sunset.jpg': testContent
			},
			gallery3: {
				'metadata.json': imageGalleryMetadata,
				'metadata.db': testContent,
				'sunset.jpg': testContent
			},
			'no-metadata': {
				'photo.jpg': testContent
			},
			videos: {
				'movie.mp4': testContent,
				'movie.srt': testContent,
				'movie.vtt': testContent,
				'other.mp4': testContent,
				'other.srt': testContent
			},
			mixed: {
				'something.mp4': testContent,
				'something.pdf': testContent
			}
		}

		// Create directories and files
		for (const [dir, files] of Object.entries(structure)) {
			const dirPath = join(testDir, dir)
			await mkdir(dirPath, { recursive: true })

			for (const [file, content] of Object.entries(files)) {
				const filePath = join(dirPath, file)
				const fileContent = file.endsWith('.json') ? JSON.stringify(content, null, 2) : content
				await writeFile(filePath, fileContent)
			}
		}
	})

	afterAll(async () => {
		await rm(testDir, { recursive: true, force: true })
	})

	describe('groupImagesByFolder', () => {
		it('should list metadata.json first in group items', () => {
			const files = scanFolder(testDir)
			const groups = groupImagesByFolder(files)

			const gallery1 = groups.find((g) => g.name === 'gallery1')
			expect(gallery1.items[0].filename).toBe('metadata.json')
		})

		it('should list metadata.json first in group items', () => {
			const files = scanFolder(testDir)
			const groups = groupImagesByFolder(files)

			const gallery2 = groups.find((g) => g.name === 'gallery2')
			expect(gallery2.name).toBe('gallery2')
			expect(gallery2.path).toBe(`${testDir}/gallery2`)
			expect(gallery2.size).toBe(66)
			expect(gallery2.items).toEqual([
				{
					extension: 'json',
					filename: '.metadata.json',
					path: `${testDir}/gallery2/.metadata.json`,
					size: 54
				},
				{
					extension: 'jpg',
					filename: 'sunset.jpg',
					path: `${testDir}/gallery2/sunset.jpg`,
					size: 12
				}
			])
		})

		it('should list metadata.db first in group items', () => {
			const files = scanFolder(testDir)
			const groups = groupImagesByFolder(files)

			const gallery3 = groups.find((g) => g.name === 'gallery3')
			expect(gallery3.items[0].filename).toBe('metadata.db')
		})

		it('should handle multiple metadata files and sort them first', () => {
			const files = scanFolder(testDir)
			const groups = groupImagesByFolder(files)

			const gallery3 = groups.find((g) => g.name === 'gallery3')
			const metadataFiles = gallery3.items
				.slice(0, 2)
				.map((f) => f.filename)
				.sort()

			expect(metadataFiles).toEqual(['metadata.db', 'metadata.json'])
		})

		it('should sort non-metadata files alphabetically', () => {
			const files = scanFolder(testDir)
			const groups = groupImagesByFolder(files)

			const gallery1 = groups.find((g) => g.name === 'gallery1')
			const imageFiles = gallery1.items
				.filter((f) => !METADATA_FILES.includes(f.filename))
				.map((f) => f.filename)

			expect(imageFiles).toEqual(['beach.jpg', 'mountain.png'])
		})

		it('should calculate correct group size', () => {
			const files = scanFolder(testDir)
			const groups = groupImagesByFolder(files)

			const gallery1 = groups.find((g) => g.name === 'gallery1')
			const expectedSize = 78

			expect(gallery1.size).toBe(expectedSize)
		})

		it('should handle groups without metadata files', () => {
			const files = scanFolder(testDir)
			const groups = groupImagesByFolder(files)

			const noMetadata = groups.find((g) => g.name === 'no-metadata')
			expect(noMetadata.items).toHaveLength(1)
			expect(noMetadata.items.map((f) => f.filename)).toEqual(['photo.jpg'])
		})
	})

	describe('groupVideoContent', () => {
		it('should group videos with their subtitle files', () => {
			const files = scanFolder(testDir)
			const groups = groupVideoContent(files)

			const movieGroup = groups.find((g) => g.name === 'movie')

			expect(movieGroup).toBeDefined()
			expect(movieGroup.items).toHaveLength(3) // 1 video + 2 subtitle files
			expect(movieGroup.size).toBe(movieGroup.items.reduce((sum, file) => sum + file.size, 0))
		})

		it('should create separate groups for different videos', () => {
			const files = scanFolder(testDir)
			const groups = groupVideoContent(files)

			expect(groups).toHaveLength(2) // 'movie' and 'other'

			const otherGroup = groups.find((g) => g.name === 'other')
			expect(otherGroup).toBeDefined()
			expect(otherGroup.items).toHaveLength(2) // just the video file
		})
	})
})
