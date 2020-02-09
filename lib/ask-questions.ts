import * as inquirer from 'inquirer'
import {
  PrettierConfigMeta,
  Answers,
  Config,
  PackageManager,
} from './shared-types'
import { generateAliasesMeta } from './generate-aliases-meta'
import { toMap } from './util/to-map'

interface AskQuestionsParams {
  prettierConfigMeta: PrettierConfigMeta
  installedConfigs: Config[]
}

interface Choice {
  name: string
  value: string | number
  checked?: boolean
  disabled?: boolean
}

interface ConfigChoice extends Choice {
  value: Config
}

interface PackageManagerChoice extends Choice {
  value: PackageManager
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
    { name: 'React (performant)', value: 'react/performant' },
    { name: 'Node', value: 'node' },
    { name: 'TypeScript', value: 'typescript' },
  ]

  const availableConfigChoices = configChoices.filter(choice => {
    // Don't offer already installed configs
    return !installedConfigsMap.has(choice.value)
  })

  const packageManagerChoices: PackageManagerChoice[] = [
    { name: 'npm', value: 'npm' },
    { name: 'Yarn', value: 'yarn' },
  ]

  return inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Choose your package manager',
      choices: packageManagerChoices,
    },
    {
      type: 'checkbox',
      name: 'configs',
      message: 'What configs you want to add?',
      choices: availableConfigChoices,
      validate: (configs: Config[]) => {
        if (configs.includes('react') && configs.includes('react/performant')) {
          return '"React" and "React (performant)" configs cannot be chosen together'
        }

        return true
      },
    },
    {
      type: 'confirm',
      name: 'addRecommendedPrettierConfig',
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
    {
      type: 'confirm',
      name: 'aliases.setup',
      message: 'Would you like to add your aliases to eslint config?',
      default: false,
    },
    {
      type: 'editor',
      name: 'aliases.meta',
      message: 'Enter aliases',
      when: currentAnswers => {
        const {
          aliases: { setup },
        } = currentAnswers

        return setup
      },
      default: '{\n  "@app": "./src"\n}',
      filter: string => {
        const json = string.replace(/[\n ]/g, '')
        const paths = JSON.parse(json)

        return generateAliasesMeta(paths)
      },
    },
  ])
}
