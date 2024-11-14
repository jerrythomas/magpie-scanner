import fs from 'fs'
import path from 'path'
import { parseEpisode } from './parser'

export function scanFolder(folderPath, separator) {
  const files = fs.readdirSync(folderPath)
  const episodes = []
  const renameCommands = []

  files
    .filter((file) => !file.startsWith('._'))
    .forEach((file) => {
      try {
        const episode = parseEpisode(file, 2, separator)
        episodes.push(episode)
        renameCommands.push({
          oldName: file,
          newName: `S${episode.season
            .toString()
            .padStart(2, '0')}E${episode.episode
            .toString()
            .padStart(2, '0')} - ${episode.title}.${episode.format}`,
        })
      } catch (error) {
        // Ignore the error and continue
      }
    })
  console.log(renameCommands)
  console.log(episodes)
  const commands = [
    '#!/bin/bash',
    ...renameCommands.map(
      ({ oldName, newName }) => `mv "${oldName}" "${newName}"`
    ),
  ].join('\n')
  fs.writeFileSync(path.join(folderPath, 'rename.sh'), commands)
  fs.writeFileSync(
    path.join(folderPath, 'episodes.json'),
    JSON.stringify(episodes, null, 2)
  )
}
