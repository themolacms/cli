import {red} from 'chalk';
import {Command} from 'commander';
import {Lib as MolaModule} from '../lib/index';

export class Cli {
  private molaModule: MolaModule;

  commander = ['mola', 'The Mola CMS all-in-one CLI'];

  constructor() {
    this.molaModule = new MolaModule();
  }

  getApp() {
    const commander = new Command();

    // general
    const [command, description] = this.commander;
    commander
      .version(require('../../package.json').version, '-v, --version')
      .name(`${command}`)
      .usage('[options] [command]')
      .description(description);

    // help
    commander
      .command('help')
      .description('Display help.')
      .action(() => commander.outputHelp());

    // *
    commander
      .command('*')
      .description('Any other command is not supported.')
      .action(cmd => console.error(red(`Unknown command '${cmd.args[0]}'`)));

    return commander;
  }
}

type CommandDef = [string | string[], string, ...Array<[string, string]>];
