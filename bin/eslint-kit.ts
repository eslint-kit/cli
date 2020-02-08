#!/usr/bin/env node

import { runCLI } from '../lib/run-cli'
import { log, Color } from '../lib/log'

async function bootstrap(): Promise<void> {
  try {
    await runCLI()
  } catch (error) {
    log(error.message, Color.Red)
  }
}

bootstrap()
