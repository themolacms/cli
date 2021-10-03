import {green, red} from 'chalk';

import {ERROR} from '../../lib/services/message.service';

import {SudoGetCommand} from './sudo-get.command';
import {SudoSetCommand} from './sudo-set.command';
import {SudoRemoveCommand} from './sudo-remove.command';

export class SudoCommand {
  constructor(
    private sudoGetCommand: SudoGetCommand,
    private sudoSetCommand: SudoSetCommand,
    private sudoRemoveCommand: SudoRemoveCommand
  ) {}

  run(subCommand: string, email: string) {
    switch (subCommand) {
      case 'get':
      case 'g':
        this.sudoGetCommand.run();
        break;
      case 'set':
      case 's':
        this.sudoSetCommand.run(email);
        break;
      case 'remove':
      case 'r':
        this.sudoRemoveCommand.run();
        break;
      default:
        console.log(
          ERROR +
            `Invalid sub-command '${red(subCommand)}', available: ` +
            `${green('get')}, ${green('set')}, ${green('remove')}`
        );
        break;
    }
  }
}
