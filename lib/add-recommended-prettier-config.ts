import * as fs from 'fs'
import * as path from 'path'
import { FILENAMES } from './constants'

export function addRecommendedPrettierConfig(): void {
  const recommendedConfig = {
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    quoteProps: 'consistent',
    trailingComma: 'es5',
    endOfLine: 'lf',
  }

  fs.writeFileSync(
    path.resolve(process.cwd(), FILENAMES.PRETTIER),
    JSON.stringify(recommendedConfig, null, 2)
  )
}
