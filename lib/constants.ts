import { Config } from './shared-types'

export const FILENAMES = {
  ESLINT: '.eslintrc',
  PRETTIER: '.prettierrc',
  PACKAGE_JSON: 'package.json',
}

export const DEPENDENCIES = {
  BABEL_PARSER: 'babel-eslint',
  TS_PARSER: '@typescript-eslint/parser',
}

export const CONFIG_PRIORITIES: Record<Config, number> = {
  'base': 1,
  'typescript': 2,
  'node': 3,
  'react': 4,
  'react/performant': 5,
  'prettier': 6,
}
