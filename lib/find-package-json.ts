import * as fs from 'fs'
import * as path from 'path'
import { FILENAMES } from './constants'
import { PackageJson } from './shared-types'

interface FindPackageJsonParams {
  runningPath: string
}

export function findPackageJson({
  runningPath,
}: FindPackageJsonParams): PackageJson {
  let json: string

  try {
    json = fs
      .readFileSync(path.resolve(runningPath, FILENAMES.PACKAGE_JSON))
      .toString()
  } catch {
    throw new Error('Cannot find package.json file in your project root')
  }

  let content: PackageJson

  try {
    content = JSON.parse(json)
  } catch {
    throw new Error('Cannot parse package.json contents')
  }

  return content
}
