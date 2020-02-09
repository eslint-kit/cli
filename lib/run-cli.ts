import * as fs from 'fs'
import * as chalk from 'chalk'
import { findPackageJson } from './find-package-json'
import { findEslintConfig } from './find-eslint-config'
import { findPrettierConfig } from './find-prettier-config'
import { askQuestions } from './ask-questions'
import { updateEslintConfig } from './update-eslint-config'
import { addRecommendedPrettierConfig } from './add-recommended-prettier-config'
import { getDependenciesToInstall } from './get-dependencies-to-install'
import { installDependencies } from './install-dependencies'
import { log } from './util/log'
import { getInstalledConfings } from './get-installed-configs'
import { getInstalledDependencies } from './get-installed-dependencies'
import { checkIfTsShouldBeUsed } from './check-if-ts-should-be-used'
import { MESSAGES } from './ui/messages'

export async function runCLI(): Promise<void> {
  const rootDirFileNames = fs.readdirSync(process.cwd())

  const packageJson = findPackageJson()

  const installedDependencies = getInstalledDependencies({ packageJson })

  const eslintConfigMeta = findEslintConfig({
    rootDirFileNames,
    packageJson,
  })

  const installedConfigs = getInstalledConfings({ eslintConfigMeta })

  const prettierConfigMeta = findPrettierConfig({ rootDirFileNames })

  const answers = await askQuestions({ installedConfigs, prettierConfigMeta })

  const useTs = checkIfTsShouldBeUsed({
    installedDependencies,
    installedConfigs,
    answers,
  })

  log(MESSAGES.CONFIGS_UPDATING_STARTED, chalk.yellow)

  updateEslintConfig({
    answers,
    packageJson,
    eslintConfigMeta,
    useTs,
  })

  if (answers.addRecommendedPrettierConfig) {
    addRecommendedPrettierConfig()
  }

  log(MESSAGES.CONFIGS_UPDATING_SUCCEED, chalk.green)

  const dependenciesToInstall = getDependenciesToInstall({
    answers,
    installedDependencies,
    useTs,
  })

  await installDependencies({
    answers,
    dependencies: dependenciesToInstall,
  })

  log(MESSAGES.COMPLETED, chalk.green)
  log(MESSAGES.PLEASE_RESTART, [chalk.magenta, chalk.bold])
}
