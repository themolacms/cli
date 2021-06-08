import {yellow, green} from 'chalk';

import {ProjectService} from '../../lib/services/project.service';

export class SudoGetCommand {
  constructor(private projectService: ProjectService) {}

  async run() {
    const {backend} = await this.projectService.getMolaDotJson();
    if (backend?.sadmin) {
      console.log('The super admin of this app is: ' + green(backend.sadmin));
    } else {
      console.log(
        'There is no super admin, set one: $' + yellow('mola sudo set <email>')
      );
    }
  }
}
