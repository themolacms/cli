import {yellow} from 'chalk';

import {ERROR} from '../../lib/services/message.service';

import {DatabaseInitCommand} from './database-init.command';

export class DatabaseCommand {
  constructor(private databaseInitCommand: DatabaseInitCommand) {}

  run(subCommand: string, params: string[] = []) {
    switch (subCommand) {
      case 'init':
      case 'i':
        this.databaseInitCommand.run();
        break;
      default:
        console.log(
          ERROR + `Invalid sub-command '${subCommand}':  ` + `${yellow('init')}`
        );
        break;
    }
  }
}
