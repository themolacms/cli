import {green, red} from 'chalk';

import {ERROR} from '../../lib/services/message.service';

import {StorageSetupCommand} from './storage-setup.command';

export class StorageCommand {
  constructor(private storageSetupCommand: StorageSetupCommand) {}

  run(subCommand: string, params: string[] = []) {
    switch (subCommand) {
      case 'setup':
      case 's':
        this.storageSetupCommand.run();
        break;
      default:
        console.log(
          ERROR +
            `Invalid sub-command '${red(subCommand)}', available: ` +
            `${green('setup')}, `
        );
        break;
    }
  }
}
