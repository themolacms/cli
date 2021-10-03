import {OK, WARN} from '../../lib/services/message.service';
import {TerminalService} from '../../lib/services/terminal.service';
import {ProjectService} from '../../lib/services/project.service';

import {DatabaseInitCommand} from './database-init.command';
import {DatabaseRestoreCommand} from './database-restore.command';

export class DatabaseSetupCommand {
  constructor(
    private terminalService: TerminalService,
    private projectService: ProjectService,
    private databaseInitCommand: DatabaseInitCommand,
    private databaseRestoreCommand: DatabaseRestoreCommand
  ) {}

  async run() {
    const {database} = await this.projectService.getMolaDotJson();
    if (!database) {
      return console.log(WARN + 'No database config found in mola.json.');
    }
    // advanced init
    await this.databaseInitCommand.run(database.collections);
    // restore data
    await this.databaseRestoreCommand.run();
    // deploy rules, indexes
    this.terminalService.exec(
      'npx firebase deploy --only "firestore:rules,firestore:indexes"',
      'firebase',
      'inherit'
    );
    console.log(OK + 'Database setup completed!');
  }
}
