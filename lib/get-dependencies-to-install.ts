import { MeaningfulDependency, Config, AliasesMeta } from './shared-types'
import { toMap } from './util/to-map'

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

    if (configsMap.size > 0) {
      add(['eslint-config-kit'])
    }

    if (configsMap.has('base')) {
      add(['eslint-plugin-import'])
    }

    if (configsMap.has('prettier')) {
      add(['prettier', 'eslint-plugin-prettier'])
    }

    if (configsMap.has('react') || configsMap.has('react/performant')) {
      add(['eslint-plugin-react', 'eslint-plugin-react-hooks'])
    }

    if (configsMap.has('typescript')) {
      add(['@typescript-eslint/eslint-plugin', 'eslint-plugin-import'])
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
