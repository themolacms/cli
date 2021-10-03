import {green, red} from 'chalk';

import {ERROR} from '../../lib/services/message.service';

import {DatabaseInitCommand} from './database-init.command';
import {DatabaseImportCommand} from './database-import.command';
import {DatabaseExportCommand} from './database-export.command';

export class DatabaseCommand {
  constructor(
    private databaseInitCommand: DatabaseInitCommand,
    private databaseImportCommand: DatabaseImportCommand,
    private databaseExportCommand: DatabaseExportCommand
  ) {}

  run(subCommand: string, params: string[] = []) {
    switch (subCommand) {
      case 'init':
      case 'i':
        this.databaseInitCommand.run(params);
        break;
      case 'import':
      case 'im':
        this.databaseImportCommand.run(params);
        break;
      case 'export':
      case 'ex':
        this.databaseExportCommand.run(params);
        break;
      default:
        console.log(
          ERROR +
            `Invalid sub-command '${red(subCommand)}', available: ` +
            `${green('init')}, ${green('import')}, ${green('export')}`
        );
        break;
    }
  }
}
