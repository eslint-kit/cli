import * as merge from 'deepmerge'
import { PathGroup, Json, AliasesMeta } from '../shared-types'
import { CustomMerge, combineMerge } from './shared'

const tsCustomMerge: CustomMerge = key => {
  if (key === '@typescript-eslint/parser') {
    return (a: string[], b: string[]) => {
      return Array.from(new Set([...a, ...b]))
    }
  }

  if (key === 'import/order') {
    return (a, b) =>
      merge(a, b, {
        arrayMerge: combineMerge,
        customMerge: tsCustomMerge,
      })
  }

  if (key === 'groups') {
    return a => a
  }

  if (key === 'pathGroups') {
    return (a: PathGroup[], b: PathGroup[]) => {
      const existingPatterns = a.map(group => group.pattern)

      const newGroups = b.filter(group => {
        return !existingPatterns.includes(group.pattern)
      })

      return [...a, ...newGroups]
    }
  }

  return undefined
}

export const tsAliasesAdder = (currentConfig: Json, meta: AliasesMeta): Json =>
  merge(
    currentConfig,
    {
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        'import/order': [
          'warn',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            pathGroups: meta.pathGroups,
          },
        ],
      },
    },
    { customMerge: tsCustomMerge }
  )
