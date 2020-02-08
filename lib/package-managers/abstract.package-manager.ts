import { readFile } from 'fs'
import { join } from 'path'
import * as ora from 'ora'
import * as chalk from 'chalk'
import { AbstractRunner } from '../runners/abstract.runner'
import { log } from '../util/log'
import { PackageJson } from '../shared-types'
import { MESSAGES } from '../ui/messages'
import { PackageManagerCommands } from './types'

type SaveType = 'prod' | 'dev'

export abstract class AbstractPackageManager {
  constructor(protected runner: AbstractRunner) {}

  public abstract get cli(): PackageManagerCommands

  private async manageDependencies(
    command: string,
    messages: {
      progress: string
      succeed: string
      failed: string
    },
    dependencies: string[],
    saveType?: SaveType
  ): Promise<void> {
    const spinner = ora({
      spinner: 'dots',
      prefixText: '\n',
      text: chalk.yellow(messages.progress),
    })

    spinner.start()

    try {
      const dependenciesString: string = dependencies.join(' ')

      const args: string[] = []

      args.push(command)

      if (saveType === 'prod') {
        args.push(this.cli.saveFlag)
      }

      if (saveType === 'dev') {
        args.push(this.cli.saveDevFlag)
      }

      args.push(dependenciesString)

      args.push('--silent')

      const argsString = args.filter(Boolean).join(' ')
      const collect = true

      await this.runner.run(argsString, collect)

      spinner.succeed()

      log(messages.succeed, chalk.green)
    } catch (err) {
      spinner.fail()

      throw new Error(messages.failed + '\n  ' + err.message)
    }
  }

  public async install(
    dependencies: string[],
    saveType?: SaveType
  ): Promise<void> {
    return this.manageDependencies(
      this.cli.install,
      {
        progress: MESSAGES.PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS,
        succeed: MESSAGES.PACKAGE_MANAGER_INSTALLATION_SUCCEED,
        failed: MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED,
      },
      dependencies,
      saveType
    )
  }

  public async uninstall(
    dependencies: string[],
    saveType?: SaveType
  ): Promise<void> {
    return this.manageDependencies(
      this.cli.uninstall,
      {
        progress: MESSAGES.PACKAGE_MANAGER_UNINSTALLATION_IN_PROGRESS,
        succeed: MESSAGES.PACKAGE_MANAGER_UNINSTALLATION_SUCCEED,
        failed: MESSAGES.PACKAGE_MANAGER_UNINSTALLATION_FAILED,
      },
      dependencies,
      saveType
    )
  }

  public async version(): Promise<string> {
    const commandArguments = '--version'
    const collect = true
    return this.runner.run(commandArguments, collect) as Promise<string>
  }

  public async getInstalledDependencies(): Promise<string[]> {
    const packageJson = await this.readPackageJson()
    const { dependencies = {}, devDependencies = {} } = packageJson

    const dependenciesNames = Object.keys(dependencies)
    const devDependenciesNames = Object.keys(devDependencies)

    return [...dependenciesNames, ...devDependenciesNames]
  }

  private async readPackageJson(): Promise<PackageJson> {
    return new Promise((resolve, reject) => {
      readFile(
        join(process.cwd(), 'package.json'),
        (error: NodeJS.ErrnoException | null, buffer: Buffer) => {
          if (error !== undefined && error !== null) {
            reject(error)
          } else {
            resolve(JSON.parse(buffer.toString()))
          }
        }
      )
    })
  }
}
