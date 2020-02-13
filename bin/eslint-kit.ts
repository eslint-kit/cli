#!/usr/bin/env node

import commander from 'commander'
import { ConfigCommand, AliasCommand } from '../commands'

function bootstrap(): void {
  const program = commander

  program
    .version(
      require('../package.json').version,
      '-v --version',
      'Output the current version'
    )
    .usage('<command>')
    .helpOption('-h --help', 'Output usage information')

  ConfigCommand.load(program)
  AliasCommand.load(program)

  commander.parse(process.argv)
}

bootstrap()
