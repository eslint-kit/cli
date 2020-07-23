import chalk from 'chalk'
import { getDataBySchema } from '../../lib/get-data-by-schema'
import { updateEslintConfig } from '../../lib/update-eslint-config'
import { log } from '../../lib/util/log'
import { MESSAGES } from '../../lib/ui/messages'
import { getDependenciesToInstall } from '../../lib/get-dependencies-to-install'
import { installDependencies } from '../../lib/dependencies-work'
import { askQuestions } from './ask-questions'
import { getUpdatedEslintConfig } from './get-updated-eslint-config'
import { LOCAL_MESSAGES } from './ui/local-messages'

export class AliasAction {
  static async process(): Promise<void> {
    const { aliasesMeta } = await askQuestions()

    const {
      packageJson,
      eslintConfigMeta,
      installedDependencies,
      useTs,
      packageManager,
    } = await getDataBySchema({
      packageJson: true,
      eslintConfigMeta: true,
      installedDependencies: true,
      useTs: true,
      packageManager: true,
    })

    const updatedConfig = getUpdatedEslintConfig({
      eslintConfigMeta,
      aliasesMeta,
      useTs,
    })

    await updateEslintConfig({
      updatedConfig,
      packageJson,
      eslintConfigMeta,
    })

    const dependenciesToInstall = getDependenciesToInstall({
      aliases: aliasesMeta,
      installedDependencies,
      useTs,
    })

    await installDependencies({
      packageManager,
      dependencies: dependenciesToInstall,
    })

    log(LOCAL_MESSAGES.ADDED_ALIASES, chalk.green)
    log(MESSAGES.PLEASE_RESTART, [chalk.magenta, chalk.bold])
  }

  public static async handle(): Promise<void> {
    try {
      await AliasAction.process()
    } catch (err) {
      log(err.message, chalk.red)
    }
  }
}
