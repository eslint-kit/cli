import { NpmRunner } from '../runners/npm.runner'
import { AbstractPackageManager } from './abstract.package-manager'
import { PackageManagerCommands } from './types'

export class NpmPackageManager extends AbstractPackageManager {
  constructor() {
    super(new NpmRunner())
  }

  get cli(): PackageManagerCommands {
    return {
      install: 'install',
      uninstall: 'uninstall',
      saveFlag: '--save',
      saveDevFlag: '--save-dev',
      exactFlag: '-E',
    }
  }
}
