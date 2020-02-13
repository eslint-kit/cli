import { Config } from '../../lib/shared-types'

export interface Answers {
  configs: Config[]
  shouldAddRecommendedPrettierConfig?: boolean
}
