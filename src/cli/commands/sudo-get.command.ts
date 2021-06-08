import {yellow, green} from 'chalk';

import {INFO, WARN} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

export class SudoGetCommand {
  constructor(private projectService: ProjectService) {}

  async run() {
    const {backend} = await this.projectService.getMolaDotJson();
    if (backend?.sadmin) {
      console.log(
        INFO + 'The super admin of this app is: ' + green(backend.sadmin)
      );
    } else {
      console.log(
        WARN +
          'There is no super admin, set one: $' +
          yellow('mola sudo set <email>')
      );
    }
  }
}
