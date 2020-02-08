import { Config } from './shared-types'

export function isFromConfigKit(fullConfigName: string): boolean {
  return fullConfigName.startsWith('kit/')
}

export function cropConfigName(fullConfigName: string): Config {
  return fullConfigName.slice(4) as Config
}
