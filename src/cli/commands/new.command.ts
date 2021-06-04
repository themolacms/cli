import {execSync} from 'child_process';
import {resolve} from 'path';
import {yellow, green, gray} from 'chalk';

import {HelperService} from '../../lib/services/helper.service';
import {FileService} from '../../lib/services/file.service';
import {CreateService} from '../../lib/services/create.service';

interface NewCommandOptions {
  source?: string;
  deploy?: 'github' | 'firebase' | 'netlify';
  theme?: string;
  locale?: string;
  skipGit?: boolean;
  skipInstall?: boolean;
}

export class NewCommand {
  constructor(
    private helperService: HelperService,
    private fileService: FileService,
    private createService: CreateService
  ) {}

  async run(
    theme: string,
    projectName: string,
    appDomain: string,
    appName: string,
    appDescription: string,
    commandOptions: NewCommandOptions
  ) {
    const resourceUrl = this.createService.proccessInput(
      commandOptions.source || theme
    );
    const validProjectName = projectName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, ' ')
      .replace(/ /g, '-');
    const projectPath = resolve(validProjectName);
    appDomain = appDomain || 'mola.lamnhan.com';
    appName = appName || 'A Mola Web App';
    appDescription = appDescription || 'Just another awesome Mola web app.';
    const deployTarget = commandOptions.deploy || 'github';
    const additionalThemes = this.helperService.parseParams(
      commandOptions.theme || ''
    );
    const additionalLocales = this.helperService.parseParams(
      commandOptions.locale || ''
    );
    // create
    await this.createService.create(resourceUrl, projectPath);
    // modify
    await this.createService.modify(
      projectPath,
      appDomain,
      appName,
      appDescription,
      deployTarget,
      additionalThemes,
      additionalLocales
    );
    // listing
    const files = await this.fileService.listDir(projectPath);
    console.log(
      `Create a new ${yellow(theme)} project:`,
      green(validProjectName)
    );
    console.log('From: ' + gray(resourceUrl));
    files.forEach(file =>
      console.log(file.replace(projectPath, '').replace(/\\/g, '/').substr(1))
    );
    // install dependencies
    if (!commandOptions.skipInstall) {
      execSync('npm install', {stdio: 'inherit', cwd: projectPath});
    }
    // init git
    if (!commandOptions.skipGit) {
      execSync('git init', {stdio: 'inherit', cwd: projectPath});
    }
    // notify for firebase init
    // TODO: includes in firebase setup ...
    if (commandOptions.deploy === 'firebase') {
      console.log('\n' + yellow('======================================'));
      console.log('\n' + yellow('= NOTICE: Please run `firebase init` ='));
      console.log('\n' + yellow('======================================'));
    }
  }
}
