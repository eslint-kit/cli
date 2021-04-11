import path from 'path'
import { AbstractRunner } from '../runners/abstract.runner'
import { PackageJson } from '../shared-types'
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
    dependencies: string[],
    saveType?: SaveType,
    exact = false
  ): Promise<void> {
    const dependenciesString: string = dependencies.join(' ')

    const args: string[] = []

    args.push(command)

    if (saveType === 'prod') {
      args.push(this.cli.saveFlag)
    }

    if (saveType === 'dev') {
      args.push(this.cli.saveDevFlag)
    }

    if (exact) {
      args.push(this.cli.exactFlag)
    }

    args.push(dependenciesString)

    args.push('--silent')

    const argsString = args.filter(Boolean).join(' ')
    const collect = true

    await this.runner.run(argsString, collect)
  }

  public async install(
    dependencies: string[],
    saveType?: SaveType,
    exact = false
  ): Promise<void> {
    return this.manageDependencies(
      this.cli.install,
      dependencies,
      this.options.useFlagForInstall ? saveType : undefined,
      exact
    )
  }

  public async uninstall(
    dependencies: string[],
    saveType?: SaveType
  ): Promise<void> {
    return this.manageDependencies(
      this.cli.uninstall,
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
