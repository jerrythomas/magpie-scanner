import { cwd } from 'process'
import sade from 'sade'
import { scanFolder } from './rename'

const prog = sade('magpie', true)

prog
  .describe('Rename episodes in a folder')
  .option('-f, --folder', 'folder to process', cwd())
  .option('-s, --separator', 'separator', '\\s*-?\\s*')
  .action(async (opts) => {
    console.log(opts)
    scanFolder(opts.folder, opts.separator)
  })

prog.parse(process.argv)
