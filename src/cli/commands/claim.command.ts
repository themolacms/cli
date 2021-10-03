import {green, red} from 'chalk';

import {ERROR} from '../../lib/services/message.service';

import {ClaimGetCommand} from './claim-get.command';
import {ClaimSetCommand} from './claim-set.command';

export class ClaimCommand {
  constructor(
    private claimGetCommand: ClaimGetCommand,
    private claimSetCommand: ClaimSetCommand
  ) {}

  run(subCommand: string, params: string[] = []) {
    switch (subCommand) {
      case 'get':
      case 'g':
        this.claimGetCommand.run(params[0]);
        break;
      case 'set':
      case 's':
        this.claimSetCommand.run(params.shift() as string, params);
        break;
      default:
        console.log(
          ERROR +
            `Invalid sub-command '${red(subCommand)}', available: ` +
            `${green('get')}, ${green('set')}`
        );
        break;
    }
  }
}
