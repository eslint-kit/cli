import { Config } from './shared-types'
import { CONFIG_PREFIX } from './constants'

export function isFromConfigKit(fullConfigName: string): boolean {
  return fullConfigName.startsWith(CONFIG_PREFIX)
}

export function cropConfigName(fullConfigName: string): Config {
  return fullConfigName.slice(CONFIG_PREFIX.length) as Config
}
