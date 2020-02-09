import { isFromConfigKit, cropConfigName } from './config-name-helpers'
import { CONFIG_PREFIX } from './constants'

describe('config name helpers', () => {
  describe('isFromConfigKit', () => {
    it('should work correctly', () => {
      expect(isFromConfigKit(CONFIG_PREFIX + 'base')).toBe(true)
      expect(isFromConfigKit('gidubgdifygb')).toBe(false)
    })
  })

  describe('cropConfigName', () => {
    it('should work correctly', () => {
      expect(cropConfigName(CONFIG_PREFIX + 'base')).toBe('base')
      expect(cropConfigName(CONFIG_PREFIX + 'react')).toBe('react')
    })
  })
})
