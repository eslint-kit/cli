import { PrettierConfigMeta } from './shared-types'
import { FILENAMES } from './constants'

const configFileNames = [
  FILENAMES.PRETTIER,
  'prettier.config.js',
  '.prettierrc.js',
  '.prettierrc.yaml',
  '.prettierrc.toml',
]

interface FindPrettierConfigParams {
  rootDirFileNames: string[]
}

export function findPrettierConfig({
  rootDirFileNames,
}: FindPrettierConfigParams): PrettierConfigMeta {
  const isExist = configFileNames.some(configFileName => {
    return rootDirFileNames.some(fileName => fileName === configFileName)
  })

  return { isExist }
}
