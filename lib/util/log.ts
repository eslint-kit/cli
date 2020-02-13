import chalk from 'chalk'

type Color = chalk.Chalk | chalk.Chalk[]

export function log(message: string, color: Color = chalk.white): void {
  const colors = Array.isArray(color) ? color : [color]

  const coloredMessage = colors.reduce((acc, colorize) => {
    return colorize(acc)
  }, message)

  console.info('\n', coloredMessage)
}
