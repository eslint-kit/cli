import * as npm from 'npm-programmatic'
import * as yarn from 'yarn-programmatic'
import { Answers } from './shared-types'
import { log, Color } from './log'

interface InstallerParams {
  runningPath: string
  dependencies: string[]
}

const installers = {
  npm: ({ runningPath, dependencies }: InstallerParams) => {
    return new Promise((resolve, reject) => {
      npm
        .install(dependencies, {
          cwd: runningPath,
          saveDev: true,
        })
        .then(resolve)
        .catch(reject)
    })
  },
  yarn: ({ runningPath, dependencies }: InstallerParams) => {
    return yarn.add(dependencies, {
      cwd: runningPath,
      dev: true,
    })
  },
}

interface InstallDependenciesParams {
  answers: Answers
  runningPath: string
  dependencies: string[]
}

export async function installDependencies({
  answers,
  runningPath,
  dependencies,
}: InstallDependenciesParams): Promise<void> {
  if (dependencies.length === 0) {
    log('All dependencies are already installed! Skipping..', Color.Green)
    return
  }

  log('Installing dependencies..', Color.Blue)

  const { packageManager } = answers

  await installers[packageManager]({ runningPath, dependencies })
}
