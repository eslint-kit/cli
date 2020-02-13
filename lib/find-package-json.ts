import path from 'path'
import { FILENAMES } from './constants'
import { PackageJson } from './shared-types'
import { FileSystemReader } from './readers/file-system.reader'

export async function findPackageJson(): Promise<PackageJson> {
  let json: string

  try {
    const buffer = await FileSystemReader.readFile(
      path.resolve(process.cwd(), FILENAMES.PACKAGE_JSON)
    )

    json = buffer.toString()
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
