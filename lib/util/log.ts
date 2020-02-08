import * as chalk from 'chalk'

export function log(message: string, color: chalk.Chalk = chalk.white): void {
  console.info('\n', color(message))
}
