import * as fs from 'fs'
import * as path from 'path'
import { FILENAMES } from './constants'

interface AddRecommendedPrettierConfigParams {
  runningPath: string
}

export function addRecommendedPrettierConfig({
  runningPath,
}: AddRecommendedPrettierConfigParams): void {
  const recommendedConfig = {
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    quoteProps: 'consistent',
    trailingComma: 'es5',
    endOfLine: 'lf',
  }

  fs.writeFileSync(
    path.resolve(runningPath, FILENAMES.PRETTIER),
    JSON.stringify(recommendedConfig, null, 2)
  )
}
