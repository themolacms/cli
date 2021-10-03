import {green, red} from 'chalk';

import {ERROR} from '../../lib/services/message.service';

import {DatabaseInitCommand} from './database-init.command';
import {DatabaseImportCommand} from './database-import.command';
import {DatabaseExportCommand} from './database-export.command';
import {DatabaseBackupCommand} from './database-backup.command';
import {DatabaseRestoreCommand} from './database-restore.command';
import {DatabaseSetupCommand} from './database-setup.command';

export class DatabaseCommand {
  constructor(
    private databaseInitCommand: DatabaseInitCommand,
    private databaseImportCommand: DatabaseImportCommand,
    private databaseExportCommand: DatabaseExportCommand,
    private databaseBackupCommand: DatabaseBackupCommand,
    private databaseRestoreCommand: DatabaseRestoreCommand,
    private databaseSetupCommand: DatabaseSetupCommand
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
      case 'backup':
      case 'b':
        this.databaseBackupCommand.run();
        break;
      case 'restore':
      case 'r':
        this.databaseRestoreCommand.run();
        break;
      case 'setup':
      case 's':
        this.databaseSetupCommand.run();
        break;
      default:
        console.log(
          ERROR +
            `Invalid sub-command '${red(subCommand)}', available: ` +
            `${green('init')}, ` +
            `${green('import')}, ${green('export')}, ` +
            `${green('backup')}, ${green('restore')}` +
            `${green('setup')}, `
        );
        break;
    }
  }
}
