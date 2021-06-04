import {execSync} from 'child_process';
import {resolve} from 'path';
import {yellow, green, gray} from 'chalk';

import {FileService} from '../../lib/services/file.service';
import {CreateService} from '../../lib/services/create.service';

interface NewCommandOptions {
  source?: string;
  deploy?: 'github' | 'firebase' | 'netlify';
  i18n?: boolean;
  skipGit?: boolean;
  skipInstall?: boolean;
}

export class NewCommand {
  constructor(
    private fileService: FileService,
    private createService: CreateService
  ) {}

  async run(
    theme: string,
    projectName: string,
    appUrl: string,
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
    appUrl = appUrl || 'mola.lamnhan.com';
    appName = appName || 'A Mola Web App';
    appDescription = appDescription || 'Just another awesome Mola web app.';
    // create
    await this.createService.create(
      resourceUrl,
      projectPath,
      appUrl,
      appName,
      appDescription
    );
    // show list of files
    const files = await this.fileService.readFiles(projectPath);
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
  }
}
