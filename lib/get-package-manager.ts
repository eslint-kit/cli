import inquirer from 'inquirer'
import { PackageManager, Choice } from './shared-types'

interface PackageManagerChoice extends Choice {
  value: PackageManager
}

interface GetPackageManagerParams {
  rootDirFileNames: string[]
}

export async function getPackageManager({
  rootDirFileNames,
}: GetPackageManagerParams): Promise<PackageManager> {
  for (const fileName of rootDirFileNames) {
    if (fileName === 'package-lock.json') return 'npm'
    if (fileName === 'yarn.lock') return 'yarn'
  }

  const packageManagerChoices: PackageManagerChoice[] = [
    { name: 'npm', value: 'npm' },
    { name: 'Yarn', value: 'yarn' },
  ]

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'packageManager',
        message: 'Choose your package manager',
        choices: packageManagerChoices,
      },
    ])
    .then(({ packageManager }) => packageManager)
}
