import inquirer from 'inquirer'
import { Config, PrettierConfigMeta, Choice } from '../../lib/shared-types'
import { toMap } from '../../lib/util/to-map'
import { Answers } from './types'

interface ConfigChoice extends Choice {
  value: Config
}

interface AskQuestionsParams {
  prettierConfigMeta: PrettierConfigMeta
  installedConfigs: Config[]
}

export function askQuestions({
  prettierConfigMeta,
  installedConfigs,
}: AskQuestionsParams): Promise<Answers> {
  const installedConfigsMap = toMap(installedConfigs)

  const configChoices: ConfigChoice[] = [
    { name: 'Base', value: 'base', checked: true },
    { name: 'Prettier', value: 'prettier' },
    { name: 'React', value: 'react' },
    { name: 'Node', value: 'node' },
    { name: 'TypeScript', value: 'typescript' },
  ]

  const availableConfigChoices = configChoices.filter(choice => {
    // Don't offer already installed configs
    return !installedConfigsMap.has(choice.value)
  })

  return inquirer.prompt([
    {
      type: 'checkbox',
      name: 'configs',
      message: 'What configs you want to add?',
      choices: availableConfigChoices,
    },
    {
      type: 'confirm',
      name: 'shouldAddRecommendedPrettierConfig',
      message: 'Add recommended prettier config? (.prettierrc)',
      when: currentAnswers => {
        if (prettierConfigMeta.isExist) {
          return false
        }

        const { configs } = currentAnswers

        return configs.includes('prettier')
      },
      default: true,
    },
  ])
}
