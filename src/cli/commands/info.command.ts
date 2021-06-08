import {ProjectService} from '../../lib/services/project.service';

import {INFO} from '../../lib/services/message.service';

export class InfoCommand {
  constructor(private projectService: ProjectService) {}

  async run() {
    const molaDotJson = await this.projectService.getMolaDotJson();
    console.log(INFO + 'Project information:');
    console.log(molaDotJson);
  }
}
