/* eslint-disable prettier/prettier */
import {red} from 'chalk';
import {Command} from 'commander';
import {Lib as MolaModule} from '../lib/index';
import {NewCommand} from './commands/new.command';

export class Cli {
  private molaModule: MolaModule;
  newCommand: NewCommand;

  commander = ['mola', 'The Mola CMS all-in-one CLI'];

  /**
   * @param theme - Theme input.
   * @param projectName - The project name.
   * @param appUrl? - The web app url.
   * @param appName? - The web app name.
   * @param appDescription? - The web app description.
   */
  newCommandDef: CommandDef = [
    ['new <theme> <projectName> [appUrl] [appName] [appDescription]', 'start', 'n'],
    'Create a new project.',
    ['-s, --source [value]', 'Custom theme source (url to .zip).'],
    ['-d, --deploy [value]', 'Deploy service (github/firebase/netlify).'],
    ['-l, --i18n', 'Enable I18N.'],
    ['-i, --skip-install', 'Does not install dependency packages.'],
    ['-g, --skip-git', 'Does not initialize a git repository.'],
  ];

  constructor() {
    this.molaModule = new MolaModule();
    this.newCommand = new NewCommand(
      this.molaModule.fileService,
      this.molaModule.createService
    );
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

    // new
    (() => {
      const [
        [command, ...aliases],
        description,
        sourceOpt,
        deployOpt,
        i18nOpt,
        skipInstallOpt,
        skipGitOpt,
      ] = this.newCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...sourceOpt)
        .option(...deployOpt)
        .option(...i18nOpt)
        .option(...skipInstallOpt)
        .option(...skipGitOpt)
        .description(description)
        .action((type, projectName, appUrl, appName, appDescription, options) =>
          this.newCommand.run(
            type,
            projectName,
            appUrl,
            appName,
            appDescription,
            options
          )
        );
    })();

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
