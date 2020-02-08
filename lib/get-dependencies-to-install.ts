import { Answers } from './shared-types'
import { toMap } from './util/to-map'

interface GetDependenciesToInstallParams {
  answers: Answers
  installedDependencies: string[]
  useTs: boolean
}

export function getDependenciesToInstall({
  answers,
  installedDependencies,
  useTs,
}: GetDependenciesToInstallParams): string[] {
  const installedDependenciesMap = toMap(installedDependencies)

  const dependencies: string[] = []

  function add(deps: string[]): void {
    for (const dep of deps) {
      if (installedDependenciesMap.has(dep)) continue
      if (dependencies.includes(dep)) continue
      dependencies.push(dep)
    }
  }

  const { configs, aliases } = answers

  const configsMap = toMap(configs)

  // Core dependencies
  add(['eslint', 'eslint-config-kit'])

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

  // import plugin resolvers for using aliases
  if (aliases.setup) {
    if (useTs) {
      add(['eslint-import-resolver-typescript'])
    } else {
      add(['eslint-import-resolver-alias'])
    }
  }

  return dependencies
}
