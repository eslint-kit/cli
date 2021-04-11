import { YarnRunner } from '../runners/yarn.runner'
import { AbstractPackageManager } from './abstract.package-manager'
import { PackageManagerCommands } from './types'

export class YarnPackageManager extends AbstractPackageManager {
  constructor() {
    super(new YarnRunner(), {
      useFlagForUninstall: false,
    })
  }

  get cli(): PackageManagerCommands {
    return {
      install: 'add',
      uninstall: 'remove',
      saveFlag: '',
      saveDevFlag: '-D',
      exactFlag: '-E',
    }
  }
}
