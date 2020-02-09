/* eslint-disable @typescript-eslint/no-explicit-any */

import * as merge from 'deepmerge'

export type CustomMerge = (
  key: string,
  options?: merge.Options
) => ((a: any, b: any) => any) | undefined
