import { NpmRunner } from '../runners/npm.runner'
import { AbstractPackageManager } from './abstract.package-manager'
import { PackageManagerCommands } from './types'

class YarnPackageManagerClass extends AbstractPackageManager {
  constructor() {
    super(NpmRunner)
  }

  get cli(): PackageManagerCommands {
    return {
      install: 'add',
      uninstall: 'remove',
      saveFlag: '',
      saveDevFlag: '-D',
    }
  }
}

export const YarnPackageManager = new YarnPackageManagerClass()
