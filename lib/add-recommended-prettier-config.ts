import path from 'path'
import { FILENAMES } from './constants'
import { FileSystemReader } from './readers'

export async function addRecommendedPrettierConfig(): Promise<void> {
  const recommendedConfig = {
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    quoteProps: 'consistent',
    trailingComma: 'es5',
    endOfLine: 'lf',
  }

  return FileSystemReader.writeFile(
    path.resolve(process.cwd(), FILENAMES.PRETTIER),
    JSON.stringify(recommendedConfig, null, 2)
  )
}
