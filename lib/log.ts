export enum Color {
  Red = 31,
  Green = 32,
  Blue = 34,
}

export function log(message: string, color: Color): void {
  console.log(`\n\x1b[${color}m`, message, '\x1b[0m\n')
}
