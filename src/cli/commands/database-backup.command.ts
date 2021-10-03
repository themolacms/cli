import {WARN} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

import {DatabaseExportCommand} from './database-export.command';

export class DatabaseBackupCommand {
  constructor(
    private projectService: ProjectService,
    private databaseExportCommand: DatabaseExportCommand
  ) {}

  async run() {
    const {database} = await this.projectService.getMolaDotJson();
    if (!database) {
      return console.log(WARN + 'No database config found in mola.json.');
    }
    return this.databaseExportCommand.run(database.collections);
  }
}
