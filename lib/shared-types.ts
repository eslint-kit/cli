export type JsonValue =
  | undefined
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface Json {
  [key: string]: JsonValue
}

export interface PackageJson extends Json {
  eslint?: Json
  prettier?: Json
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export type EslintConfigMeta =
  | {
      configFileName: string
      isPackageJson: false
      isYaml: boolean
      content: Json
    }
  | {
      configFileName: null
      isPackageJson: true
      isYaml: false
      content: Json
    }

export interface PrettierConfigMeta {
  isExist: boolean
}

export type AliasMapItem = [string, string]

export interface PathGroup {
  pattern: string
  group: 'index' | 'sibling' | 'parent' | 'internal' | 'external' | 'builtin'
  position: 'before' | 'after'
}

export interface AliasesMeta {
  aliasMap: AliasMapItem[]
  pathGroups: PathGroup[]
}

export type Config =
  | 'base'
  | 'prettier'
  | 'react'
  | 'react/performant'
  | 'node'
  | 'typescript'

export type PackageManager = 'npm' | 'yarn'

export interface Answers {
  configs: Config[]
  addRecommendedPrettierConfig?: boolean
  aliases: {
    setup: boolean
    meta: AliasesMeta
  }
}

export type MeaningfulDependency =
  | 'eslint'
  | 'eslint-config-kit'
  | 'eslint-plugin-import'
  | 'prettier'
  | 'eslint-plugin-prettier'
  | 'eslint-plugin-react'
  | 'eslint-plugin-react-hooks'
  | '@typescript-eslint/eslint-plugin'
  | '@typescript-eslint/parser'
  | 'babel-eslint'
  | 'eslint-import-resolver-typescript'
  | 'eslint-import-resolver-alias'

export interface Choice {
  name: string
  value: string | number
  checked?: boolean
  disabled?: boolean
}
