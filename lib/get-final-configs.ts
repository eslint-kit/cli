import { Config, PackageJson } from './shared-types'
import { greaterOrEquals } from './dependency-version-compare'

interface GetFinalConfigsParams {
  packageJson: PackageJson
  updatedConfigs: Config[]
}

export function getFinalConfigs({
  packageJson,
  updatedConfigs,
}: GetFinalConfigsParams): Config[] {
  const { dependencies = {}, devDependencies = {} } = packageJson

  const allDependencies = {
    ...dependencies,
    ...devDependencies,
  }

  const finalConfigs = updatedConfigs.slice()

  if (
    updatedConfigs.includes('react') &&
    allDependencies.react &&
    greaterOrEquals(allDependencies.react, '17.0.0')
  ) {
    finalConfigs.push('react-17')
  }

  return finalConfigs
}
