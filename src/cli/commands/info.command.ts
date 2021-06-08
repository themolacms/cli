import {ProjectService} from '../../lib/services/project.service';

export class InfoCommand {
  constructor(private projectService: ProjectService) {}

  async run() {
    const molaDotJson = await this.projectService.getMolaDotJson();
    console.log('Project information:');
    console.log(molaDotJson);
  }
}
