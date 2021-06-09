import {yellow} from 'chalk';

import {ERROR} from '../../lib/services/message.service';

import {RoleGetCommand} from './role-get.command';
import {RoleSetCommand} from './role-set.command';

export class RoleCommand {
  constructor(
    private roleGetCommand: RoleGetCommand,
    private roleSetCommand: RoleSetCommand
  ) {}

  run(subCommand: string, params: string[] = []) {
    switch (subCommand) {
      case 'get':
      case 'g':
        this.roleGetCommand.run(params[0]);
        break;
      case 'set':
      case 's':
        this.roleSetCommand.run(params[0], params[1]);
        break;
      default:
        console.log(
          ERROR +
            `Invalid sub-command '${subCommand}':  ` +
            `${yellow('get')}, ${yellow('set')}, ${yellow('remove')}`
        );
        break;
    }
  }
}
