import { MeaningfulDependency, Config, AliasesMeta } from './shared-types'
import { toMap } from './util/to-map'
import { CONFIG_PREFIX } from './constants'

interface GetDependenciesToInstallParams {
  configs?: Config[]
  aliases?: AliasesMeta
  installedDependencies: string[]
  useTs: boolean
}

export function getDependenciesToInstall({
  configs,
  aliases,
  installedDependencies,
  useTs,
}: GetDependenciesToInstallParams): MeaningfulDependency[] {
  const installedDependenciesMap = toMap(installedDependencies)

  const dependencies: MeaningfulDependency[] = []

  function add(deps: MeaningfulDependency[]): void {
    for (const dep of deps) {
      if (installedDependenciesMap.has(dep)) continue
      if (dependencies.includes(dep)) continue
      dependencies.push(dep)
    }
  }

  if (configs) {
    const configsMap = toMap(configs)

    add(['eslint'])

    const configDependencies = Array.from(
      configsMap.keys(),
      configName =>
        (CONFIG_PREFIX + 'eslint-config-' + configName) as MeaningfulDependency
    )

    add(configDependencies)

    if (configsMap.has('prettier')) {
      add(['prettier'])
    }

    // Parser
    if (configsMap.has('typescript')) {
      add(['@typescript-eslint/parser'])
    } else if (!useTs) {
      add(['babel-eslint'])
    }
  }

  if (aliases) {
    if (useTs) {
      add(['eslint-import-resolver-typescript'])
    } else {
      add(['eslint-import-resolver-alias'])
    }
  }

  return dependencies
}
