import { describe, it, expect } from 'vitest'
import {
	applyCleanup,
	findMatch,
	findClosestMediaType,
	detectMediaType
} from '../../src/utils/parser'

describe('Parser Utils', () => {
	describe('applyCleanup', () => {
		it('should apply multiple cleanup patterns in order', () => {
			const cleanupPatterns = [
				{ find: /\./g, replace: ' ' },
				{ find: /\s+/g, replace: ' ' },
				{ find: /\s*-\s*/g, replace: ' - ' }
			]

			expect(applyCleanup('The.Movie.-.2020', cleanupPatterns)).toBe('The Movie - 2020')
			expect(applyCleanup('Show.Name.S01E01', cleanupPatterns)).toBe('Show Name S01E01')
		})

		it('should return original string if no patterns match', () => {
			const cleanupPatterns = [{ find: /\[.*?\]/g, replace: '' }]
			expect(applyCleanup('Simple Text', cleanupPatterns)).toBe('Simple Text')
		})
	})
	describe('findMatch', () => {
		it('should return first matching pattern result with groups', () => {
			const patterns = [
				{
					pattern: /^(?<series>.+?)\.S(?<season>\d{2})E(?<episode>\d{2})/,
					tag: 'show',
					example: 'Series.Name.S01E02',
					expected: { series: 'Series.Name', season: '01', episode: '02' }
				}
			]

			const result = findMatch('Series.Name.S01E02', patterns)
			expect(result).toEqual({
				match: expect.any(Array),
				groups: { series: 'Series.Name', season: '01', episode: '02' },
				pattern: patterns[0]
			})
		})

		it('should return null if no pattern matches', () => {
			const patterns = [
				{
					pattern: /^(?<series>.+?)\.S(?<season>\d{2})E(?<episode>\d{2})/,
					tag: 'show'
				}
			]

			expect(findMatch('invalid string', patterns)).toBe(null)
		})

		it('should return pattern metadata along with match', () => {
			const patterns = [
				{
					pattern: /^(?<series>.+?)\.S(?<season>\d{2})E(?<episode>\d{2})/,
					tag: 'show',
					description: 'Show pattern'
				}
			]

			const result = findMatch('Series.Name.S01E02', patterns)
			expect(result.pattern).toBe(patterns[0])
		})
	})

	describe('findClosestMediaType', () => {
		const validTypes = ['movie', 'show', 'book', 'comic', 'gallery', 'music', 'audio-book']

		it('should return exact matches', () => {
			expect(findClosestMediaType('movie')).toBe('movie')
			expect(findClosestMediaType('show')).toBe('show')
			expect(findClosestMediaType('book')).toBe('book')
		})

		it('should handle case variations', () => {
			expect(findClosestMediaType('MOVIE')).toBe('movie')
			expect(findClosestMediaType('Show')).toBe('show')
			expect(findClosestMediaType('Book')).toBe('book')
		})

		it('should find closest matches', () => {
			expect(findClosestMediaType('movies')).toBe('movie')
			expect(findClosestMediaType('tv-shows')).toBe('show')
			expect(findClosestMediaType('ebooks')).toBe('book')
			expect(findClosestMediaType('audiobooks')).toBe('audio-book')
			expect(findClosestMediaType('comics')).toBe('comic')
			expect(findClosestMediaType('galleries')).toBe('gallery')
			expect(findClosestMediaType('songs')).toBe('music')
		})

		it('should return unknown for non-matching types', () => {
			expect(findClosestMediaType('random')).toBe('unknown')
			expect(findClosestMediaType('')).toBe('unknown')
			expect(findClosestMediaType(null)).toBe('unknown')
			expect(findClosestMediaType(undefined)).toBe('unknown')
		})

		it('should handle similar but different words', () => {
			expect(findClosestMediaType('moving')).toBe('unknown')
			expect(findClosestMediaType('showing')).toBe('unknown')
			expect(findClosestMediaType('booking')).toBe('unknown')
		})
	})
	describe('detectMediaType', () => {
		it('should detect movies from path', () => {
			expect(detectMediaType('/movies/The.Movie.2020.mp4')).toBe('movie')
			expect(detectMediaType('D:/media/movies/Avatar 2009.mkv')).toBe('movie')
		})

		it('should detect shows from path', () => {
			expect(detectMediaType('/shows/Series.S01E02.mp4')).toBe('show')
			expect(detectMediaType('/tv/Breaking Bad/Season 1/E01.mp4')).toBe('show')
		})

		it('should detect books from path', () => {
			expect(detectMediaType('/books/Book by Author.pdf')).toBe('book')
			expect(detectMediaType('/library/ebooks/Author - Book Title.epub')).toBe('book')
		})

		it('should infer show type from episode pattern', () => {
			expect(detectMediaType('/downloads/Series/S01/E02.mp4')).toBe('show')
			expect(detectMediaType('/media/Show/season 1/1x02.mp4')).toBe('show')
		})
		it('should return unknown for unrecognized paths', () => {
			expect(detectMediaType('/random/file.txt')).toBe('unknown')
			expect(detectMediaType('invalid-path')).toBe('unknown')
		})
	})
})
