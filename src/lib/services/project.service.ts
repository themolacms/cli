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
  database: true;
}

export class ProjectService {
  constructor(private fileService: FileService) {}

  getMolaDotJson(projectPath = '.') {
    return this.fileService.readJson<MolaDotJson>(
      resolve(projectPath, 'mola.json')
    );
  }
}
