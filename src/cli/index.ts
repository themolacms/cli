/* eslint-disable prettier/prettier */
import {red} from 'chalk';
import {Command} from 'commander';
import {Lib as MolaModule} from '../lib/index';
import {DocsCommand} from './commands/docs.command';
import {InfoCommand} from './commands/info.command';
import {NewCommand} from './commands/new.command';
import {AddCommand} from './commands/add.command';
import {SudoCommand} from './commands/sudo.command';
import {SudoGetCommand} from './commands/sudo-get.command';
import {SudoSetCommand} from './commands/sudo-set.command';
import {SudoRemoveCommand} from './commands/sudo-remove.command';
import {ClaimCommand} from './commands/claim.command';
import {ClaimGetCommand} from './commands/claim-get.command';
import {ClaimSetCommand} from './commands/claim-set.command';
import {BuildCommand} from './commands/build.command';
import {PreviewCommand} from './commands/preview.command';
import {DeployCommand} from './commands/deploy.command';
import {TestCommand} from './commands/test.command';
import {E2eCommand} from './commands/e2e.command';

export class Cli {
  private molaModule: MolaModule;
  docsCommand: DocsCommand;
  infoCommand: InfoCommand;
  newCommand: NewCommand;
  addCommand: AddCommand;
  sudoCommand: SudoCommand;
  sudoGetCommand: SudoGetCommand;
  sudoSetCommand: SudoSetCommand;
  sudoRemoveCommand: SudoRemoveCommand;
  claimCommand: ClaimCommand;
  claimGetCommand: ClaimGetCommand;
  claimSetCommand: ClaimSetCommand;
  buildCommand: BuildCommand;
  previewCommand: PreviewCommand;
  deployCommand: DeployCommand;
  testCommand: TestCommand;
  e2eCommand: E2eCommand;

  commander = ['mola', 'The Mola CMS all-in-one CLI'];

  docsCommandDef: CommandDef = [
    ['docs', 'home', 'h'], 'Open documentation.'
  ];

  infoCommandDef: CommandDef = [
    ['info', 'i'], 'Display project information.'
  ];

  /**
   * @param theme - A Mola theme input.
   * @param projectName - The project name.
   * @param appDomain? - The web app domain name.
   * @param appName? - The web app name.
   * @param appDescription? - The web app description.
   */
   newCommandDef: CommandDef = [
    ['new <theme> <projectName> [appDomain] [appName] [appDescription]', 'start', 'n'],
    'Create a new project.',
    ['-s, --source [value]', 'Custom Mola theme source (url/path to .zip).'],
    ['-d, --deploy [value]', 'Deploy service (github/firebase/netlify).'],
    ['-l, --locale [value]', 'Change or add locales (commna-separated).'],
    ['-k, --skin [value]', 'Change or add Unistylus skins (commna-separated).'],
    ['-o, --soul [value]', 'Change Unistylus soul.'],
    ['-i, --skip-install', 'Do not install dependency packages.'],
    ['-g, --skip-git', 'Do not initialize a git repository.'],
  ];

  /**
   * @param input - An input string
   * @param params...? - List of parameters
   */
  addCommandDef: CommandDef = [
    ['add <input> [params...]', 'generate', 'a', 'g'], 'Add a components, pages, ...'
  ];

  /**
   * @param subCommand - A supported sub-command: get, set, remove
   * @param email? - A user email (set)
   */
  sudoCommandDef: CommandDef = [
    ['sudo <subCommand> [email]', 'sadmin', 's'],
    'Manage super admin account.'
  ];

  sudoGetCommandDef: CommandDef = [
    'sudo-get', 'Show the super admin account.'
  ];

  /**
   * @param email - A user email
   */
  sudoSetCommandDef: CommandDef = [
    'sudo-set <email>', 'Set an unique account as a super admin.'
  ];

  sudoRemoveCommandDef: CommandDef = [
    'sudo-remove', 'Remove the super admin account.'
  ];

  /**
   * @param subCommand - A supported sub-command: get, set
   * @param params...? - List of sub-command parameters
   */
  claimCommandDef: CommandDef = [
    ['claim <subCommand> [params...]', 'c'],
    'Manange user claim.'
  ];

  /**
   * @param email - The user email
   */
  claimGetCommandDef: CommandDef = [
    'claim-get <email>', 'Display a user claims.'
  ];

  /**
   * @param email - The user email
   * @param claims...? - A list of claims, formated "name:value"
   */
  claimSetCommandDef: CommandDef = [
    'claim-set <email> [claims...]', 'Set claims to a user.'
  ];

  buildCommandDef: CommandDef = [
    ['build', 'b'], 'Build the app.'
  ];

  previewCommandDef: CommandDef = [
    ['preview', 'p'], 'Preview the app.'
  ];

  deployCommandDef: CommandDef = [
    ['deploy', 'd'], 'Deploy the app.'
  ];

  testCommandDef: CommandDef = [
    ['test', 't'], 'Unit test the app.'
  ];

  e2eCommandDef: CommandDef = [
    ['e2e', 'e'], 'E2e test the app.'
  ];

  constructor() {
    this.molaModule = new MolaModule();
    this.docsCommand = new DocsCommand();
    this.infoCommand = new InfoCommand(this.molaModule.projectService);
    this.newCommand = new NewCommand(
      this.molaModule.helperService,
      this.molaModule.fileService,
      this.molaModule.downloadService,
      this.molaModule.projectService,
    );
    this.addCommand = new AddCommand(
      this.molaModule.fileService,
      this.molaModule.downloadService,
      this.molaModule.terminalService,
    );
    this.sudoGetCommand = new SudoGetCommand(
      this.molaModule.projectService,
    );
    this.sudoSetCommand = new SudoSetCommand(
      this.molaModule.projectService,
      this.molaModule.firebaseService,
    );
    this.sudoRemoveCommand = new SudoRemoveCommand(
      this.molaModule.projectService,
      this.molaModule.firebaseService,
    );
    this.sudoCommand = new SudoCommand(
      this.sudoGetCommand,
      this.sudoSetCommand,
      this.sudoRemoveCommand,
    );
    this.claimGetCommand = new ClaimGetCommand(this.molaModule.firebaseService);
    this.claimSetCommand = new ClaimSetCommand(this.molaModule.firebaseService);
    this.claimCommand = new ClaimCommand(
      this.claimGetCommand,
      this.claimSetCommand,
    );
    this.buildCommand = new BuildCommand(this.molaModule.terminalService);
    this.previewCommand = new PreviewCommand(this.molaModule.projectService);
    this.deployCommand = new DeployCommand(this.molaModule.terminalService);
    this.testCommand = new TestCommand(this.molaModule.terminalService);
    this.e2eCommand = new E2eCommand(this.molaModule.terminalService);
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

    // docs
    (() => {
      const [[command, ...aliases], description] = this.docsCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.docsCommand.run());
    })();

    // info
    (() => {
      const [[command, ...aliases], description] = this.infoCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.infoCommand.run());
    })();

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

    // add
    (() => {
      const [[command, ...aliases], description] = this.addCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action((input, params) => this.addCommand.run(input, params));
    })();

    // sudo
    (() => {
      const [[command, ...aliases], description] = this.sudoCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action((subCommand, email) => this.sudoCommand.run(subCommand, email));
    })();

    // sudo-get
    (() => {
      const [command, description] = this.sudoGetCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.sudoGetCommand.run());
    })();

    // sudo-set
    (() => {
      const [command, description] = this.sudoSetCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action((email: string) => this.sudoSetCommand.run(email));
    })();

    // sudo-remove
    (() => {
      const [command, description] = this.sudoRemoveCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.sudoRemoveCommand.run());
    })();

    // claim
    (() => {
      const [[command, ...aliases], description] = this.claimCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action((subCommand, params) => this.claimCommand.run(subCommand, params));
    })();

    // claim-get
    (() => {
      const [command, description] = this.claimGetCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action((email) => this.claimGetCommand.run(email));
    })();

    // claim-set
    (() => {
      const [command, description] = this.claimSetCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action((email, claims) => this.claimSetCommand.run(email, claims));
    })();

    // build
    (() => {
      const [[command, ...aliases], description] = this.buildCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.buildCommand.run());
    })();

    // preview
    (() => {
      const [[command, ...aliases], description] = this.previewCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.previewCommand.run());
    })();

    // deploy
    (() => {
      const [[command, ...aliases], description] = this.deployCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.deployCommand.run());
    })();

    // test
    (() => {
      const [[command, ...aliases], description] = this.testCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.testCommand.run());
    })();

    // e2e
    (() => {
      const [[command, ...aliases], description] = this.e2eCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.e2eCommand.run());
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
