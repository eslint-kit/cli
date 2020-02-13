import { CommanderStatic } from 'commander'
import { ConfigAction } from '../actions'

export class ConfigCommand {
  static load(program: CommanderStatic): void {
    program
      .command('config', { isDefault: true })
      .description('Add / edit eslint configs')
      .action(ConfigAction.handle)
  }
}
