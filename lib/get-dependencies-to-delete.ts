import { MeaningfulDependency, Config } from './shared-types'
import { toMap } from './util/to-map'
import { CONFIG_PREFIX } from './constants'

interface GetDependenciesToInstallParams {
  configs?: Config[]
  installedDependencies: string[]
}

export function getDependenciesToDelete({
  configs,
  installedDependencies,
}: GetDependenciesToInstallParams): MeaningfulDependency[] {
  const installedDependenciesMap = toMap(installedDependencies)

  const dependencies: MeaningfulDependency[] = []

  function add(deps: MeaningfulDependency[]): void {
    for (const dep of deps) {
      if (!installedDependenciesMap.has(dep)) continue
      if (dependencies.includes(dep)) continue
      dependencies.push(dep)
    }
  }

  if (configs) {
    const configDependencies = Array.from(
      configs,
      configName =>
        (CONFIG_PREFIX + 'eslint-config-' + configName) as MeaningfulDependency
    )

    add(configDependencies)
  }

  return dependencies
}
