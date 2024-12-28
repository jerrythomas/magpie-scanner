import { describe, it, expect } from 'vitest'
import { parseEpisode, parseFilename } from '../src/parser'

describe('parser', () => {
	describe('parseFilename', () => {
		it('should parse filename', () => {
			const result = parseFilename('The Office -- S01E02 -- Diversity Day.mp4')
			expect(result).toEqual('The Office - S01E02 - Diversity Day')
		})
	})

	describe('parseEpisode', () => {
		it('should parse standard episode format', () => {
			const result = parseEpisode('The Office - S01E02 - Diversity Day.mp4')
			expect(result).toEqual({
				series: 'The Office',
				season: 1,
				episode: 2,
				title: 'Diversity Day',
				format: 'mp4'
			})
		})

		it('should parse format without spaces around separators', () => {
			const result = parseEpisode('Friends-S02E15-The One Where Ross and Rachel.mkv')
			expect(result).toEqual({
				series: 'Friends',
				season: 2,
				episode: 15,
				title: 'The One Where Ross and Rachel',
				format: 'mkv'
			})
		})

		it('should parse format without S and E prefixes', () => {
			const result = parseEpisode('Breaking Bad - 1x04 - Cancer Man.avi')
			expect(result).toEqual({
				series: 'Breaking Bad',
				season: 1,
				episode: 4,
				title: 'Cancer Man',
				format: 'avi'
			})
		})

		it('should parse format with lowercase s and e', () => {
			const result = parseEpisode('Better Call Saul -s01e05 Alpine Shepherd Boy.mp4')
			expect(result).toEqual({
				series: 'Better Call Saul',
				season: 1,
				episode: 5,
				title: 'Alpine Shepherd Boy',
				format: 'mp4'
			})
		})

		it('should handle titles with parentheses', () => {
			const result = parseEpisode('The Office - S01E03 - (Health Care).mp4')
			expect(result).toEqual({
				series: 'The Office',
				season: 1,
				episode: 3,
				title: 'Health Care',
				format: 'mp4'
			})
		})

		it('should throw error for invalid format', () => {
			expect(() => parseEpisode('Invalid Format Movie.mp4')).toThrow('No matching pattern found')
		})

		it('should handle double-digit season and episode numbers', () => {
			const result = parseEpisode('Lost - S10E22 - The End.mp4')
			expect(result).toEqual({
				series: 'Lost',
				season: 10,
				episode: 22,
				title: 'The End',
				format: 'mp4'
			})
		})
	})
})
