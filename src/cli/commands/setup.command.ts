import {ERROR} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

import {DatabaseSetupCommand} from './database-setup.command';
import {StorageSetupCommand} from './storage-setup.command';

export class SetupCommand {
  constructor(
    private projectService: ProjectService,
    private databaseSetupCommand: DatabaseSetupCommand,
    private storageSetupCommand: StorageSetupCommand
  ) {}

  async run() {
    const isValidProject = await this.projectService.isValid();
    if (!isValidProject) {
      return console.log(ERROR + 'Invalid Mola project.');
    }
    // database setup
    await this.databaseSetupCommand.run();
    // storage setup
    await this.storageSetupCommand.run();
    // other setup ...
    // ...
  }
}
