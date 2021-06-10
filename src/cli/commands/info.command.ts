import {green} from 'chalk';
const ttyTable = require('tty-table');

import {OK} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

export class InfoCommand {
  constructor(private projectService: ProjectService) {}

  async run() {
    const table = ttyTable(
      [
        {value: 'Name', width: 50, align: 'left'},
        {value: 'Value', width: 200, align: 'left'},
      ],
      []
    );
    const molaDotJson = await this.projectService.getMolaDotJson();
    const data = {...molaDotJson} as Record<string, unknown>;
    for (const key of Object.keys(data)) {
      table.push([key, green(data[key])]);
    }
    console.log(OK + 'Project information:');
    console.log(table.render());
  }
}
