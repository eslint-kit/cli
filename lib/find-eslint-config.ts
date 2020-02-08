import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'yamljs'
import { Json, EslintConfigMeta, PackageJson } from './shared-types'
import { arrayToString } from './util/array-to-string'
import { FILENAMES } from './constants'

const unsupportedConfigFileNames = ['.eslintrc.js', '.eslintrc.cjs']

const yamlConfigFileNames = ['.eslintrc.yaml', '.eslintrc.yml']

const configFileNames = [
  '.eslintrc.json',
  FILENAMES.ESLINT,
  ...yamlConfigFileNames,
  ...unsupportedConfigFileNames,
]

interface FindEslintConfigParams {
  runningPath: string
  rootDirFileNames: string[]
  packageJson: PackageJson
}

export function findEslintConfig({
  runningPath,
  rootDirFileNames,
  packageJson,
}: FindEslintConfigParams): EslintConfigMeta {
  const configFileName = configFileNames.find(configFileName => {
    return rootDirFileNames.some(fileName => fileName === configFileName)
  })

  /*
   * package.json has less priority than config files
   * It should be used only when there is no any config file
   */

  const isPackageJson = !configFileName && 'eslint' in packageJson

  if (isPackageJson) {
    return {
      configFileName: null,
      isPackageJson,
      isYaml: false,
      content: packageJson.eslint as Json,
    }
  }

  if (!configFileName) {
    return {
      configFileName: FILENAMES.ESLINT,
      isPackageJson: false,
      isYaml: false,
      content: {},
    }
  }

  /*
   * Here we know that config file is used
   * It remains only to check if the format is unsupported
   */

  const isUnsupportedFormatUsed = unsupportedConfigFileNames.includes(
    configFileName
  )

  if (isUnsupportedFormatUsed) {
    throw new Error(
      arrayToString(unsupportedConfigFileNames) +
        'is not supported.\n' +
        'Available config files are: ' +
        arrayToString(configFileNames)
    )
  }

  const configPath = path.resolve(runningPath, configFileName)

  /*
   * The config is supported
   * It's in JSON or Yaml format
   *
   * Yaml should be handled differently than JSON
   * So we should check what format exactly user uses
   */

  const isYaml = yamlConfigFileNames.includes(configFileName)

  if (isYaml) {
    const content = YAML.load(configPath)

    return {
      configFileName,
      isPackageJson: false,
      isYaml: true,
      content,
    }
  }

  const content = JSON.parse(fs.readFileSync(configPath).toString())

  return {
    configFileName,
    isPackageJson: false,
    isYaml: false,
    content,
  }
}
