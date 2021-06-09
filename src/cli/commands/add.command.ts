import {resolve} from 'path';
import {grey, green} from 'chalk';
import {pascalCase} from 'change-case';
const listGithubContent = require('list-github-dir-content');

import {OK, INFO} from '../../lib/services/message.service';
import {FileService} from '../../lib/services/file.service';
import {DownloadService} from '../../lib/services/download.service';
import {TerminalService} from '../../lib/services/terminal.service';

export class AddCommand {
  constructor(
    private fileService: FileService,
    private downloadService: DownloadService,
    private terminalService: TerminalService
  ) {}

  async run(input: string, params: string[] = []) {
    switch (input) {
      case 'component':
      case 'c':
        await this.addComponent(params[0]);
        break;
      case 'page':
      case 'p':
        await this.addPage(params[0]);
        break;
      default:
        await this.addAny(input);
        break;
    }
  }

  async addComponent(value: string) {
    this.terminalService.exec(
      `npx ng g c ${value} --skip-import`,
      '.',
      'inherit'
    );
    // add the '.module.ts'
    const valueSplits = value.split('/');
    const fileName = valueSplits[valueSplits.length - 1];
    const compName = pascalCase(fileName);
    await this.fileService.createFile(
      resolve('src', 'app', ...valueSplits, `${fileName}.module.ts`),
      [
        "import { NgModule } from '@angular/core';",
        "import { CommonModule } from '@angular/common';",
        '',
        `import { ${compName}Component } from './${fileName}.component';`,
        '',
        '@NgModule({',
        `  declarations: [${compName}Component],`,
        '  imports: [CommonModule],',
        `  exports: [${compName}Component]`,
        '})',
        `export class ${compName}ComponentModule {}`,
        '',
      ].join('\n')
    );
  }

  async addPage(value: string) {
    this.terminalService.exec(
      `npx ng g m ${value} --route ${value} --module app.module`,
      '.',
      'inherit'
    );
    // rename Component -> Page
    const valueSplits = value.split('/');
    const fileName = valueSplits[valueSplits.length - 1];
    const compName = pascalCase(fileName);
    // xxx-routing.component.ts
    await this.fileService.changeContent(
      resolve('src', 'app', ...valueSplits, `${fileName}-routing.module.ts`),
      {
        [`${compName}Component`]: `${compName}Page`,
      }
    );
    // xxx.component.ts
    await this.fileService.changeContent(
      resolve('src', 'app', ...valueSplits, `${fileName}.component.ts`),
      {
        [`${compName}Component`]: `${compName}Page`,
      }
    );
    // xxx.module.ts
    await this.fileService.changeContent(
      resolve('src', 'app', ...valueSplits, `${fileName}.module.ts`),
      {
        [`${compName}Component`]: `${compName}Page`,
        [`${compName}Module { }`]: `${compName}PageModule {}`,
      }
    );
  }

  async addAny(input: string) {
    let user!: string;
    let repository!: string;
    let directory!: string;
    // from @lamnhan/nguix-
    if (!input.startsWith('@')) {
      const [repoShortname, resourceGroup, resourceName] = input.split('/');
      user = 'lamnhan';
      repository = `nguix-${repoShortname}`;
      directory = `projects/${repoShortname}/src/lib/${resourceGroup}/${resourceName}`;
    }
    // from elsewhere
    else {
      const [org, repoName, resourceGroup, resourceName] = input.split('/');
      const repoShortname = repoName.replace('nguix-', '');
      user = org.replace('@', '');
      repository = repoName;
      directory = `projects/${repoShortname}/src/lib/${resourceGroup}/${resourceName}`;
    }
    // fetch list of files
    const fileList = (await listGithubContent.viaContentsApi({
      user,
      repository,
      directory,
      ref: 'main',
    })) as string[];
    const rawList = fileList.map(
      (dir: string) =>
        `https://raw.githubusercontent.com/${user}/${repository}/main/${dir}`
    );
    // download files
    const resultPaths = [] as string[];
    await Promise.all(
      rawList.map(rawUrl => {
        const filePath = rawUrl.split('/lib/').pop() as string;
        resultPaths.push(filePath);
        return this.downloadService.downloadText(
          rawUrl,
          resolve('src', 'app', ...filePath.split('/'))
        );
      })
    );
    // result
    console.log(
      INFO +
        'Resource from: ' +
        grey(`https://github.com/${user}/${repository}/tree/main/${directory}`)
    );
    resultPaths.forEach(path =>
      console.log(green('ADDED') + ` src/app/${path}`)
    );
  }
}
