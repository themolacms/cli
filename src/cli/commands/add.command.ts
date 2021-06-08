import {resolve} from 'path';

import {OK} from '../../lib/services/message.service';
import {FileService} from '../../lib/services/file.service';
import {TerminalService} from '../../lib/services/terminal.service';

export class AddCommand {
  constructor(
    private fileService: FileService,
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
    // TODO: add the 'module' file
    await this.fileService.createFile(
      resolve('src', 'app', ...value.split('/'), 'xxx.module.ts'),
      ''
    );
  }

  async addPage(value: string) {
    this.terminalService.exec(
      `npx ng g m ${value} --route ${value} --module app.module`,
      '.',
      'inherit'
    );
  }

  async addAny(input: string) {
    console.log({input});
    // https://github.com/lamnhan/nguix-starter/tree/main/projects/starter/src/lib/components/header
    // https://downgit.github.io/#/home
    // https://download-directory.github.io/
    console.log(OK + 'Code added ...!');
  }
}
