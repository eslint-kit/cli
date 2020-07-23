import { EslintConfigMeta, Json, Config } from '../../lib/shared-types'
import { isFromConfigKit, cropConfigName } from '../../lib/config-name-helpers'
import {
  CONFIG_PRIORITIES,
  CONFIG_PREFIX,
  DEPENDENCIES,
} from '../../lib/constants'

function byPriority(a: string, b: string): number {
  if (!isFromConfigKit(a) || !isFromConfigKit(b)) {
    return 0
  }

  const priorityA = CONFIG_PRIORITIES[cropConfigName(a)]
  const priorityB = CONFIG_PRIORITIES[cropConfigName(b)]

  return priorityA - priorityB
}

interface GetUpdateConfigParams {
  eslintConfigMeta: EslintConfigMeta
  updatedConfigs: Config[]
  useTs: boolean
}

export function getUpdatedEslintConfig({
  eslintConfigMeta,
  updatedConfigs,
  useTs,
}: GetUpdateConfigParams): Json {
  const { content } = eslintConfigMeta

  const updatedConfig = Object.assign({}, content)

  if (!updatedConfig.extends) {
    updatedConfig.extends = []
  }

  if (!Array.isArray(updatedConfig.extends)) {
    updatedConfig.extends = [updatedConfig.extends]
  }

  const addedExtends = updatedConfigs.map(
    configName => CONFIG_PREFIX + configName
  )

  updatedConfig.extends = updatedConfig.extends
    .filter(config => !isFromConfigKit(config))
    .concat(addedExtends)
    .sort(byPriority)

  updatedConfig.parser = useTs
    ? DEPENDENCIES.TS_PARSER
    : DEPENDENCIES.BABEL_PARSER

  return updatedConfig
}
