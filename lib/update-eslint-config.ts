import path from 'path'
import YAML from 'yamljs'
import { Json, EslintConfigMeta, PackageJson } from './shared-types'
import { FILENAMES } from './constants'
import { FileSystemReader } from './readers'

interface UpdateEslintConfigParams {
  updatedConfig: Json
  packageJson: PackageJson
  eslintConfigMeta: EslintConfigMeta
}

export async function updateEslintConfig({
  updatedConfig,
  packageJson,
  eslintConfigMeta,
}: UpdateEslintConfigParams): Promise<void> {
  if (eslintConfigMeta.isPackageJson) {
    packageJson.eslint = updatedConfig

    return FileSystemReader.writeFile(
      path.resolve(process.cwd(), FILENAMES.PACKAGE_JSON),
      JSON.stringify(packageJson, null, 2)
    )
  }

  if (eslintConfigMeta.isYaml) {
    return FileSystemReader.writeFile(
      path.resolve(process.cwd(), eslintConfigMeta.configFileName),
      YAML.stringify(updatedConfig, Infinity, 2)
    )
  }

  return FileSystemReader.writeFile(
    path.resolve(process.cwd(), eslintConfigMeta.configFileName),
    JSON.stringify(updatedConfig, null, 2)
  )
}
