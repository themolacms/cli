import {WARN} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

import {DatabaseImportCommand} from './database-import.command';

export class DatabaseRestoreCommand {
  constructor(
    private projectService: ProjectService,
    private databaseImportCommand: DatabaseImportCommand
  ) {}

  async run() {
    const {database} = await this.projectService.getMolaDotJson();
    if (!database) {
      return console.log(WARN + 'No database config found in mola.json.');
    }
    return this.databaseImportCommand.run(database.collections);
  }
}
