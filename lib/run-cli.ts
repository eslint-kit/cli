import * as fs from 'fs'
import { findPackageJson } from './find-package-json'
import { findEslintConfig } from './find-eslint-config'
import { findPrettierConfig } from './find-prettier-config'
import { askQuestions } from './ask-questions'
import { updateEslintConfig } from './update-eslint-config'
import { addRecommendedPrettierConfig } from './add-recommended-prettier-config'
import { getDependenciesToInstall } from './get-dependencies-to-install'
import { installDependencies } from './install-dependencies'
import { log, Color } from './log'
import { getInstalledConfings } from './get-installed-configs'
import { getInstalledDependencies } from './get-installed-dependencies'
import { checkIfTsShouldBeUsed } from './check-if-ts-should-be-used'

export async function runCLI(): Promise<void> {
  const runningPath = process.cwd()
  const rootDirFileNames = fs.readdirSync(runningPath)

  const packageJson = findPackageJson({ runningPath })

  const installedDependencies = getInstalledDependencies({ packageJson })

  const eslintConfigMeta = findEslintConfig({
    runningPath,
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

  log('Updating configs..', Color.Blue)

  updateEslintConfig({
    answers,
    runningPath,
    packageJson,
    eslintConfigMeta,
    useTs,
  })

  if (answers.addRecommendedPrettierConfig) {
    addRecommendedPrettierConfig({ runningPath })
  }

  const dependenciesToInstall = getDependenciesToInstall({
    answers,
    installedDependencies,
    useTs,
  })

  await installDependencies({
    answers,
    runningPath,
    dependencies: dependenciesToInstall,
  })

  log('Completed!', Color.Green)
}
