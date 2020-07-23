import { MeaningfulDependency, PackageManager } from './shared-types'
import { NpmPackageManager, YarnPackageManager } from './package-managers'

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
    return
  }

  const packageManager = new PACKAGE_MANAGERS[packageManagerName]()

  await packageManager.install(dependencies, 'dev')
}

export async function deleteDependencies({
  packageManager: packageManagerName,
  dependencies,
}: InstallDependenciesParams): Promise<void> {
  if (dependencies.length === 0) {
    return
  }

  const packageManager = new PACKAGE_MANAGERS[packageManagerName]()

  await packageManager.uninstall(dependencies, 'dev')
}
