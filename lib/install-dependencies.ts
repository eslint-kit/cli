import * as chalk from 'chalk'
import { Answers } from './shared-types'
import { log } from './util/log'
import { NpmPackageManager, YarnPackageManager } from './package-managers'
import { MESSAGES } from './ui/messages'

const PACKAGE_MANAGERS = {
  npm: NpmPackageManager,
  yarn: YarnPackageManager,
}

interface InstallDependenciesParams {
  answers: Answers
  dependencies: string[]
}

export async function installDependencies({
  answers,
  dependencies,
}: InstallDependenciesParams): Promise<void> {
  if (dependencies.length === 0) {
    log(MESSAGES.DEPENDENCIES_ALREADY_INSTALLED, chalk.green)
    return
  }

  const { packageManager } = answers

  await PACKAGE_MANAGERS[packageManager].install(dependencies, 'dev')
}
