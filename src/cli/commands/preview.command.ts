import {blue} from 'chalk';
const superstatic = require('superstatic');

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
        port: 4200,
        host: 'localhost',
        cwd: previewDir,
        config: {
          rewrites: [{source: '**', destination: '/index.html'}],
        },
        debug: true,
      })
      .listen(() =>
        console.log('Preview your app at: ' + blue('localhost:4200'))
      );
  }
}
