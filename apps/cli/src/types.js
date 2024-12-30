/**
 * @typedef {'movie'|'show'|'book'|'comic'|'gallery'|'music'|'audio-book'|'unknown'} MediaType
 */

/**
 * @typedef {Object} FileInfo
 * @property {string} path
 * @property {string} filename
 * @property {string} extension
 * @property {number} size
 */

/**
 * @typedef {Object} MediaGroup
 * @property {string} name - Name of the group (folder name)
 * @property {string} path - Full path to the group (folder path)
 * @property {number} size - Total size of all files in group
 * @property {FileInfo[]} items - Files in the group, sorted with metadata first
 */

/**
 * @typedef {Object} EpisodeInfo
 * @property {string} title
 * @property {number} season
 * @property {number} episode
 * @property {string} series
 * @property {string} format
 * @property {string} path
 * @property {string} [cover]
 * @property {string} [description]
 * @property {string} [rating]
 * @property {string} [genre]
 */
