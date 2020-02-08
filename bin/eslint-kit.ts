#!/usr/bin/env node

import * as chalk from 'chalk'
import { runCLI } from '../lib/run-cli'
import { log } from '../lib/util/log'

async function bootstrap(): Promise<void> {
  try {
    await runCLI()
  } catch (error) {
    log(error.message, chalk.red)
  }
}

bootstrap()
