import { EslintConfigMeta, Config } from './shared-types'
import { isFromConfigKit, cropConfigName } from './config-name-helpers'

interface GetInstalledConfigsParams {
  eslintConfigMeta: EslintConfigMeta
}

export function getInstalledConfings({
  eslintConfigMeta,
}: GetInstalledConfigsParams): Config[] {
  const { content } = eslintConfigMeta

  if (!content.extends) {
    return []
  }

  if (typeof content.extends === 'string') {
    if (!isFromConfigKit(content.extends)) {
      return []
    }

    return [cropConfigName(content.extends)]
  }

  if (!Array.isArray(content.extends)) {
    return []
  }

  return content.extends
    .map(String)
    .filter(isFromConfigKit)
    .map(cropConfigName)
}
