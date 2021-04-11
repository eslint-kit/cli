import { Config } from './shared-types'
import { DEPENDENCIES } from './constants'

interface CheckIfTsShouldBeUsedParams {
  installedDependencies: string[]
  installedConfigs: Config[]
  updatedConfigs?: Config[]
}

export function checkIfTsShouldBeUsed({
  installedDependencies,
  installedConfigs,
  updatedConfigs,
}: CheckIfTsShouldBeUsedParams): boolean {
  const hasTsParser = installedDependencies.includes(DEPENDENCIES.TS_PARSER)

  if (hasTsParser) return true

  const hasTsConfig = installedConfigs.includes('typescript')

  if (hasTsConfig) return true

  if (updatedConfigs) {
    const willInstallTsConfig = updatedConfigs.includes('typescript')

    if (willInstallTsConfig) return true
  }

  return false
}
