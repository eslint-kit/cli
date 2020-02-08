import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'yamljs'
import * as merge from 'deepmerge'
import {
  Answers,
  Json,
  EslintConfigMeta,
  AliasesMeta,
  PackageJson,
} from './shared-types'
import {
  FILENAMES,
  DEPENDENCIES,
  CONFIG_PRIORITIES,
  CONFIG_PREFIX,
} from './constants'
import { isFromConfigKit, cropConfigName } from './config-name-helpers'

const aliasesAdders = {
  js: (currentConfig: Json, meta: AliasesMeta) =>
    merge(currentConfig, {
      settings: {
        'import/resolver': {
          alias: {
            map: meta.aliasMap,
            extensions: ['.js', '.jsx', '.json'],
          },
        },
      },
      rules: {
        'import/order': [
          'warn',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            pathGroups: meta.pathGroups,
          },
        ],
      },
    }),
  ts: (currentConfig: Json, meta: AliasesMeta) =>
    merge(currentConfig, {
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        'import/order': [
          'warn',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            pathGroups: meta.pathGroups,
          },
        ],
      },
    }),
}

interface GetUpdateConfigParams {
  initialConfig: Json
  answers: Answers
  useTs: boolean
}

function byPriority(a: string, b: string): number {
  if (!isFromConfigKit(a) || !isFromConfigKit(b)) {
    return 0
  }

  const priorityA = CONFIG_PRIORITIES[cropConfigName(a)]
  const priorityB = CONFIG_PRIORITIES[cropConfigName(b)]

  return priorityA - priorityB
}

function getUpdatedConfig({
  initialConfig,
  answers,
  useTs,
}: GetUpdateConfigParams): Json {
  let updatedConfig = { ...initialConfig }

  const { configs, aliases } = answers

  if (!updatedConfig.extends) {
    updatedConfig.extends = []
  }

  if (!Array.isArray(updatedConfig.extends)) {
    updatedConfig.extends = [updatedConfig.extends]
  }

  const addedExtends = configs.map(configName => CONFIG_PREFIX + configName)

  updatedConfig.extends = (updatedConfig.extends.concat(
    addedExtends
  ) as string[]).sort(byPriority)

  updatedConfig.parser = useTs
    ? DEPENDENCIES.TS_PARSER
    : DEPENDENCIES.BABEL_PARSER

  if (aliases.setup) {
    if (useTs) {
      updatedConfig = aliasesAdders.ts(updatedConfig, aliases.meta)
    } else {
      updatedConfig = aliasesAdders.js(updatedConfig, aliases.meta)
    }
  }

  return updatedConfig
}

interface UpdateEslintConfigParams {
  answers: Answers
  runningPath: string
  packageJson: PackageJson
  eslintConfigMeta: EslintConfigMeta
  useTs: boolean
}

export function updateEslintConfig({
  answers,
  runningPath,
  packageJson,
  eslintConfigMeta,
  useTs,
}: UpdateEslintConfigParams): void {
  const updatedConfig = getUpdatedConfig({
    initialConfig: eslintConfigMeta.content,
    answers,
    useTs,
  })

  if (eslintConfigMeta.isPackageJson) {
    packageJson.eslint = updatedConfig

    fs.writeFileSync(
      path.resolve(runningPath, FILENAMES.PACKAGE_JSON),
      JSON.stringify(packageJson, null, 2)
    )

    return
  }

  if (eslintConfigMeta.isYaml) {
    fs.writeFileSync(
      path.resolve(runningPath, eslintConfigMeta.configFileName),
      YAML.stringify(updatedConfig)
    )

    return
  }

  fs.writeFileSync(
    path.resolve(runningPath, eslintConfigMeta.configFileName),
    JSON.stringify(updatedConfig, null, 2)
  )
}
