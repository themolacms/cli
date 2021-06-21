import {blue} from 'chalk';
const superstatic = require('superstatic');

import {INFO} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

interface Options {
  port?: string;
  host?: string;
  i18n?: boolean;
}

export class PreviewCommand {
  constructor(private projectService: ProjectService) {}

  async run(options: Options) {
    const {deployTarget} = await this.projectService.getMolaDotJson();
    const cwd =
      deployTarget === 'github'
        ? 'docs'
        : deployTarget === 'firebase'
        ? 'firebase/public'
        : deployTarget;
    // launch server
    const host = options.host || 'localhost';
    const port = options.port || 7000;
    const config = {
      cleanUrls: true,
      rewrites: [{source: '**', destination: '/index.html'}],
    } as Record<string, any>;
    if (options.i18n) {
      config.i18n = {root: '/'};
    }
    superstatic
      .server({
        host,
        port,
        cwd,
        config,
        debug: true,
      })
      .listen(() =>
        console.log(INFO + 'Preview your app at: ' + blue(`${host}:${port}`))
      );
  }
}
