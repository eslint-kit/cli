import chalk from 'chalk'
import { updateEslintConfig } from '../../lib/update-eslint-config'
import { log } from '../../lib/util/log'
import { MESSAGES } from '../../lib/ui/messages'
import { addRecommendedPrettierConfig } from '../../lib/add-recommended-prettier-config'
import { getDependenciesToInstall } from '../../lib/get-dependencies-to-install'
import {
  installDependencies,
  deleteDependencies,
} from '../../lib/dependencies-work'
import { getDataBySchema } from '../../lib/get-data-by-schema'
import { getDependenciesToDelete } from '../../lib/get-dependencies-to-delete'
import { askQuestions } from './ask-questions'
import { getUpdatedEslintConfig } from './get-updated-eslint-config'
import { LOCAL_MESSAGES } from './ui/local-messages'

export class ConfigAction {
  static async process(): Promise<void> {
    const {
      packageJson,
      eslintConfigMeta,
      prettierConfigMeta,
      installedConfigs,
      installedDependencies,
      packageManager,
    } = await getDataBySchema({
      packageJson: true,
      eslintConfigMeta: true,
      prettierConfigMeta: true,
      installedConfigs: true,
      installedDependencies: true,
      packageManager: true,
    })

    const {
      updatedConfigs,
      addedConfigs,
      deletedConfigs,
      shouldAddRecommendedPrettierConfig,
    } = await askQuestions({
      prettierConfigMeta,
      installedConfigs,
    })

    const { useTs } = await getDataBySchema(
      {
        useTs: true,
      },
      { installedDependencies, installedConfigs },
      { addedConfigs }
    )

    const updatedConfig = getUpdatedEslintConfig({
      eslintConfigMeta,
      updatedConfigs,
      useTs,
    })

    await updateEslintConfig({
      updatedConfig,
      packageJson,
      eslintConfigMeta,
    })

    if (shouldAddRecommendedPrettierConfig) {
      addRecommendedPrettierConfig()
    }

    const dependenciesToInstall = getDependenciesToInstall({
      configs: addedConfigs,
      installedDependencies,
      useTs,
    })

    const dependenciesToDelete = getDependenciesToDelete({
      configs: deletedConfigs,
      installedDependencies,
    })

    await installDependencies({
      packageManager,
      dependencies: dependenciesToInstall,
    })

    await deleteDependencies({
      packageManager,
      dependencies: dependenciesToDelete,
    })

    log(LOCAL_MESSAGES.FINISHED, chalk.green)
    log(MESSAGES.PLEASE_RESTART, [chalk.magenta, chalk.bold])
  }

  public static async handle(): Promise<void> {
    try {
      await ConfigAction.process()
    } catch (err) {
      log(err.message, chalk.red)
    }
  }
}
