import { NpmRunner } from '../runners/npm.runner'
import { AbstractPackageManager } from './abstract.package-manager'
import { PackageManagerCommands } from './types'

class NpmPackageManagerClass extends AbstractPackageManager {
  constructor() {
    super(NpmRunner)
  }

  get cli(): PackageManagerCommands {
    return {
      install: 'install',
      uninstall: 'uninstall',
      saveFlag: '--save',
      saveDevFlag: '--save-dev',
    }
  }
}

export const NpmPackageManager = new NpmPackageManagerClass()
