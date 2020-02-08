import { Answers, Config } from './shared-types'
import { DEPENDENCIES } from './constants'

interface CheckIfTsShouldBeUsedParams {
  installedDependencies: string[]
  installedConfigs: Config[]
  answers: Answers
}

export function checkIfTsShouldBeUsed({
  installedDependencies,
  installedConfigs,
  answers,
}: CheckIfTsShouldBeUsedParams): boolean {
  const hasTsParser = installedDependencies.includes(DEPENDENCIES.TS_PARSER)

  if (hasTsParser) return true

  const hasTsConfig = installedConfigs.includes('typescript')

  if (hasTsConfig) return true

  const willInstallTsConfig = answers.configs.includes('typescript')

  if (willInstallTsConfig) return true

  return false
}
