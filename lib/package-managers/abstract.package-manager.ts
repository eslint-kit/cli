import path from 'path'
import ora from 'ora'
import chalk from 'chalk'
import { AbstractRunner } from '../runners/abstract.runner'
import { log } from '../util/log'
import { PackageJson } from '../shared-types'
import { MESSAGES } from '../ui/messages'
import { FileSystemReader } from '../readers'
import { PackageManagerCommands } from './types'

type SaveType = 'prod' | 'dev'

interface Options {
  useFlagForInstall: boolean
  useFlagForUninstall: boolean
}

const DEFAULT_OPTIONS: Options = {
  useFlagForInstall: true,
  useFlagForUninstall: true,
}

export abstract class AbstractPackageManager {
  constructor(
    protected runner: AbstractRunner,
    protected customOptions: Partial<Options> = {}
  ) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...customOptions,
    }
  }

  private options: Options

  public abstract get cli(): PackageManagerCommands

  private async manageDependencies(
    command: string,
    messages: {
      warning: string
      progress: string
      succeed: string
      failed: string
    },
    dependencies: string[],
    saveType?: SaveType
  ): Promise<void> {
    log(messages.warning, [chalk.red, chalk.bold])

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
        warning: MESSAGES.PACKAGE_MANAGER_INSTALLATION_WARNING,
        progress: MESSAGES.PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS,
        succeed: MESSAGES.PACKAGE_MANAGER_INSTALLATION_SUCCEED,
        failed: MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED,
      },
      dependencies,
      this.options.useFlagForInstall ? saveType : undefined
    )
  }

  public async uninstall(
    dependencies: string[],
    saveType?: SaveType
  ): Promise<void> {
    return this.manageDependencies(
      this.cli.uninstall,
      {
        warning: MESSAGES.PACKAGE_MANAGER_UNINSTALLATION_WARNING,
        progress: MESSAGES.PACKAGE_MANAGER_UNINSTALLATION_IN_PROGRESS,
        succeed: MESSAGES.PACKAGE_MANAGER_UNINSTALLATION_SUCCEED,
        failed: MESSAGES.PACKAGE_MANAGER_UNINSTALLATION_FAILED,
      },
      dependencies,
      this.options.useFlagForUninstall ? saveType : undefined
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
    const buffer = await FileSystemReader.readFile(
      path.join(process.cwd(), 'package.json')
    )

    return JSON.parse(buffer.toString())
  }
}
