export const SUPPORTED_EXTENSIONS = {
	// Video formats
	video: ['mp4', 'mkv', 'avi', 'webm', 'mov'],
	// Audio formats
	audio: ['mp3', 'm4a', 'm4p', 'flac', 'wav'],
	// Book formats
	book: ['pdf', 'epub', 'mobi'],
	// Comic formats
	comic: ['cbr', 'cbz'],
	// Image formats
	image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff'],
	// Subtitle formats
	subtitle: ['srt', 'vtt', 'sub', 'ass'],
	// Metadata formats
	metadata: ['json', 'db']
}

export const ALL_SUPPORTED_EXTENSIONS = Object.values(SUPPORTED_EXTENSIONS).flat()

export const METADATA_FILES = ['metadata.json', 'metadata.db', '.metadata.json']

export const VALID_MEDIA_TYPES = [
	'movie',
	'show',
	'book',
	'comic',
	'gallery',
	'music',
	'audio-book'
]

export const TYPE_ALIASES = {
	movies: 'movie',
	'tv-show': 'show',
	'tv-shows': 'show',
	shows: 'show',
	television: 'show',
	series: 'show',
	ebooks: 'book',
	books: 'book',
	comics: 'comic',
	galleries: 'gallery',
	photos: 'gallery',
	images: 'gallery',
	songs: 'music',
	audio: 'music',
	audiobooks: 'audio-book',
	'audio-books': 'audio-book'
}
