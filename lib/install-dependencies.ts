import * as chalk from 'chalk'
import { MeaningfulDependency, PackageManager } from './shared-types'
import { log } from './util/log'
import { NpmPackageManager, YarnPackageManager } from './package-managers'
import { MESSAGES } from './ui/messages'

const PACKAGE_MANAGERS = {
  npm: NpmPackageManager,
  yarn: YarnPackageManager,
}

interface InstallDependenciesParams {
  packageManager: PackageManager
  dependencies: MeaningfulDependency[]
}

export async function installDependencies({
  packageManager: packageManagerName,
  dependencies,
}: InstallDependenciesParams): Promise<void> {
  if (dependencies.length === 0) {
    log(MESSAGES.DEPENDENCIES_ALREADY_INSTALLED, chalk.green)
    return
  }

  const packageManager = new PACKAGE_MANAGERS[packageManagerName]()

  await packageManager.install(dependencies, 'dev')
}
