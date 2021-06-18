import {blue} from 'chalk';
const superstatic = require('superstatic');

import {INFO} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

export class PreviewCommand {
  constructor(private projectService: ProjectService) {}

  async run() {
    const {deployTarget} = await this.projectService.getMolaDotJson();
    const previewDir =
      deployTarget === 'github'
        ? 'docs'
        : deployTarget === 'firebase'
        ? 'firebase/public'
        : deployTarget;
    // launch server
    superstatic
      .server({
        port: 7000,
        host: 'localhost',
        cwd: previewDir,
        config: {
          rewrites: [{source: '**', destination: '/index.html'}],
        },
        debug: true,
      })
      .listen(() =>
        console.log(INFO + 'Preview your app at: ' + blue('localhost:7000'))
      );
  }
}
