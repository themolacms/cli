import {resolve} from 'path';

import {FileService} from './file.service';

export interface MolaDotJson {
  projectName: string;
  domain: string;
  name: string;
  description: string;
  deployTarget: string;
  locales: string[];
  skins: string[];
  soul: string;
  backend?: BackendPoperties;
}

export interface BackendPoperties {
  sadmin?: string;
}

export class ProjectService {
  constructor(private fileService: FileService) {}

  isValid(projectPath = '.') {
    return this.fileService.exists(resolve(projectPath, 'mola.json'));
  }

  getMolaDotJson(projectPath = '.') {
    return this.fileService.readJson<MolaDotJson>(
      resolve(projectPath, 'mola.json')
    );
  }

  async updateMolaDotJson(data: {[P in keyof MolaDotJson]?: MolaDotJson[P]}) {
    const molaDotJson = await this.getMolaDotJson();
    await this.fileService.createJson('mola.json', {...molaDotJson, ...data});
  }
}
