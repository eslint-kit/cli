import { eq, satisfies, subset, valid, validRange } from 'semver'

function compare(version: string, target: string, sign: '<' | '>'): boolean {
  if (valid(version)) {
    return satisfies(version, sign + target)
  }

  if (validRange(version)) {
    const matches = satisfies(target, version)
    return subset(version, sign + target) || (sign === '>' && matches)
  }

  throw new Error('Invalid version')
}

export function lower(version: string, target: string): boolean {
  return compare(version, target, '<')
}

export function greater(version: string, target: string): boolean {
  return compare(version, target, '>')
}

export function equals(version: string, target: string): boolean {
  if (!valid(version)) {
    return false
  }

  return eq(version, target)
}
