/* eslint-disable prettier/prettier */
import {red} from 'chalk';
import {Command} from 'commander';
import {Lib as MolaModule} from '../lib/index';
import {NewCommand} from './commands/new.command';

export class Cli {
  private molaModule: MolaModule;
  public readonly newCommand: NewCommand;

  public readonly commander = ['mola', 'The Mola CMS all-in-one CLI'];

  /**
   * @param theme - A Mola theme input.
   * @param projectName - The project name.
   * @param appDomain? - The web app domain name.
   * @param appName? - The web app name.
   * @param appDescription? - The web app description.
   */
   public readonly newCommandDef: CommandDef = [
    ['new <theme> <projectName> [appDomain] [appName] [appDescription]', 'start', 'n'],
    'Create a new project.',
    ['-s, --source [value]', 'Custom Mola theme source (url to .zip).'],
    ['-d, --deploy [value]', 'Deploy service (github/firebase/netlify).'],
    ['-l, --locale [value]', 'Change or add locales (commna-separated).'],
    ['-k, --skin [value]', 'Change or add Unistylus skins (commna-separated).'],
    ['-o, --soul [value]', 'Change Unistylus soul.'],
    ['-i, --skip-install', 'Do not install dependency packages.'],
    ['-g, --skip-git', 'Do not initialize a git repository.'],
  ];

  constructor() {
    this.molaModule = new MolaModule();
    this.newCommand = new NewCommand(
      this.molaModule.helperService,
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
        localeOpt,
        skinOpt,
        soulOpt,
        skipInstallOpt,
        skipGitOpt,
      ] = this.newCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...sourceOpt)
        .option(...deployOpt)
        .option(...localeOpt)
        .option(...skinOpt)
        .option(...soulOpt)
        .option(...skipInstallOpt)
        .option(...skipGitOpt)
        .description(description)
        .action((theme, projectName, appDomain, appName, appDescription, options) =>
          this.newCommand.run(
            theme,
            projectName,
            appDomain,
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
