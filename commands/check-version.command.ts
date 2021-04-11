import { CommanderStatic } from 'commander'
import { CheckVersionsAction } from '../actions'

export class CheckVersionsCommand {
  static load(program: CommanderStatic): void {
    program
      .command('check-versions')
      .description('Check and update dependencies versions')
      .action(CheckVersionsAction.handle)
  }
}
