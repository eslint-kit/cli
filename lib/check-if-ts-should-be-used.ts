import { Config } from './shared-types'
import { DEPENDENCIES } from './constants'

interface CheckIfTsShouldBeUsedParams {
  installedDependencies: string[]
  installedConfigs: Config[]
  addedConfigs?: Config[]
}

export function checkIfTsShouldBeUsed({
  installedDependencies,
  installedConfigs,
  addedConfigs,
}: CheckIfTsShouldBeUsedParams): boolean {
  const hasTsParser = installedDependencies.includes(DEPENDENCIES.TS_PARSER)

  if (hasTsParser) return true

  const hasTsConfig = installedConfigs.includes('typescript')

  if (hasTsConfig) return true

  if (addedConfigs) {
    const willInstallTsConfig = addedConfigs.includes('typescript')

    if (willInstallTsConfig) return true
  }

  return false
}
