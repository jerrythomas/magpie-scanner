import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { ALL_SUPPORTED_EXTENSIONS, SUPPORTED_EXTENSIONS } from '../src/config/constants'
import { scanFolder, scanAndGroup } from '../src/scan'
import { mkdir, writeFile, rm } from 'fs/promises'
import { join } from 'path'

describe('scan', () => {
	describe('scanFolder', () => {
		const testDir = 'apps/cli/fixtures/test-media'
		const testContent = 'test content' // consistent content for size checking

		// Setup test directory structure once before all tests
		beforeAll(async () => {
			await mkdir(testDir, { recursive: true })
			await mkdir(join(testDir, 'movies'), { recursive: true })
			await mkdir(join(testDir, 'shows/Breaking Bad'), { recursive: true })
			await mkdir(join(testDir, 'books'), { recursive: true })

			// Create test files
			const testFiles = [
				'movies/The Matrix (1999).mp4',
				'movies/Inception (2010).mkv',
				'shows/Breaking Bad/S01E01.avi',
				'books/Book.pdf',
				'books/Comic.cbr',
				'subtitle.srt',
				'audio.mp3',
				'unsupported.txt' // Should be filtered out
			]

			// Create all files with the same content for consistent size
			for (const file of testFiles) {
				await writeFile(join(testDir, file), testContent)
			}
		})

		// Cleanup test directory once after all tests
		afterAll(async () => {
			await rm(testDir, { recursive: true, force: true })
		})

		it('should find all supported files recursively', () => {
			const files = scanFolder(testDir)

			expect(files).toHaveLength(7) // All supported files except .txt
			expect(files.map((f) => f.extension)).toEqual(
				expect.arrayContaining(['mp4', 'mkv', 'avi', 'pdf', 'cbr', 'srt', 'mp3'])
			)
		})

		it('should exclude unsupported file extensions', () => {
			const files = scanFolder(testDir)

			const unsupportedFiles = files.filter((f) => f.extension === 'txt')
			expect(unsupportedFiles).toHaveLength(0)
		})

		it('should return correct file information structure', () => {
			const files = scanFolder(testDir)
			const matrixFile = files.find((f) => f.filename.includes('Matrix'))

			expect(matrixFile).toEqual({
				path: expect.stringContaining('The Matrix (1999).mp4'),
				filename: 'The Matrix (1999).mp4',
				extension: 'mp4',
				size: 12
			})
		})

		it('should handle empty directories', async () => {
			const emptyDir = join(testDir, 'empty')
			await mkdir(emptyDir, { recursive: true })

			const files = scanFolder(emptyDir)
			expect(files).toHaveLength(0)
		})

		it('should correctly identify all supported extensions', () => {
			const files = scanFolder(testDir)
			const foundExtensions = new Set(files.map((f) => f.extension))

			foundExtensions.forEach((ext) => {
				expect(ALL_SUPPORTED_EXTENSIONS).toContain(ext)
			})
		})

		it('should return correct file sizes in bytes', () => {
			const files = scanFolder(testDir)
			const expectedSize = Buffer.from(testContent).length

			files.forEach((file) => {
				expect(file.size).toBe(12)
			})
		})

		it('should handle files with no extension', async () => {
			const noExtensionPath = join(testDir, 'no-extension')
			await writeFile(noExtensionPath, testContent)

			const files = scanFolder(testDir)
			const noExtFile = files.find((f) => f.filename === 'no-extension')

			expect(noExtFile).toBeUndefined()
		})

		it('should handle special characters in filenames', async () => {
			const specialFileName = 'movies/Special & Chars (2023) [HD].mp4'
			const specialFilePath = join(testDir, specialFileName)
			await writeFile(specialFilePath, testContent)

			const files = scanFolder(testDir)
			const specialFile = files.find((f) => f.filename.includes('Special'))

			expect(specialFile).toBeDefined()
			expect(specialFile.filename).toBe('Special & Chars (2023) [HD].mp4')
			expect(specialFile.size).toBe(Buffer.from(testContent).length)
		})
	})

	describe('scanAndGroup', () => {
		const testDir = 'apps/cli/fixtures/test-scan-group'
		const testContent = 'test content'

		beforeAll(async () => {
			await rm(testDir, { recursive: true, force: true })

			const structure = {
				// Should become an image group
				photos: {
					'metadata.json': '{"type": "gallery"}',
					'image1.jpg': testContent,
					'image2.jpg': testContent
				},
				// Should become a video group
				movies: {
					'movie.mp4': testContent,
					'movie.srt': testContent
				},
				// Should remain as separate files
				mixed: {
					'standalone.mp4': testContent,
					'document.pdf': testContent,
					'audio.mp3': testContent
				}
			}

			for (const [dir, files] of Object.entries(structure)) {
				const dirPath = join(testDir, dir)
				await mkdir(dirPath, { recursive: true })

				for (const [file, content] of Object.entries(files)) {
					await writeFile(join(dirPath, file), content)
				}
			}
		})

		afterAll(async () => {
			await rm(testDir, { recursive: true, force: true })
		})

		it('should create appropriate groups and leave other files standalone', async () => {
			const results = scanAndGroup(testDir)

			// Validate results structure
			const groups = results.filter((item) => 'items' in item)
			const standalone = results.filter((item) => !('items' in item))

			expect(results).toHaveLength(5) // 2 groups + 3 standalone
			// Should have two groups (one image group, one video group)
			expect(groups).toHaveLength(2)

			// Check image group
			const imageGroup = groups.find((g) =>
				g.items.some((f) => SUPPORTED_EXTENSIONS.image.includes(f.extension))
			)
			expect(imageGroup).toBeDefined()
			expect(imageGroup.items[0].filename).toBe('metadata.json')
			expect(imageGroup.items).toHaveLength(3) // metadata + 2 images

			// Check video group
			const videoGroup = groups.find((g) =>
				g.items.some((f) => SUPPORTED_EXTENSIONS.video.includes(f.extension))
			)
			expect(videoGroup).toBeDefined()
			expect(videoGroup.items).toHaveLength(2) // video + subtitle

			// Check standalone files
			expect(standalone).toHaveLength(3) // mp4, pdf, mp3
			expect(standalone.map((f) => f.extension).sort()).toEqual(['mp3', 'mp4', 'pdf'])
		})

		it('should correctly calculate group sizes', () => {
			const results = scanAndGroup(testDir)

			const groups = results.filter((item) => 'items' in item)
			groups.forEach((group) => {
				const expectedSize = group.items.reduce((sum, file) => sum + file.size, 0)
				expect(group.size).toBe(expectedSize)
			})
		})

		it('should not process the same file in multiple groups', () => {
			const results = scanAndGroup(testDir)

			// Check that no file path appears more than once
			const allPaths = results.flatMap((item) =>
				'items' in item ? item.items.map((f) => f.path) : [item.path]
			)
			const uniquePaths = new Set(allPaths)

			expect(allPaths.length).toBe(uniquePaths.size)
		})
	})
})
