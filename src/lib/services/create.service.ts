import {resolve} from 'path';
import {camelCase, capitalCase, pascalCase} from 'change-case';

import {FileService} from './file.service';
import {DownloadService} from './download.service';

export class CreateService {
  constructor(
    private fileService: FileService,
    private downloadService: DownloadService
  ) {}

  proccessInput(input: string) {
    // direct url
    if (input.endsWith('.zip') || input.startsWith('http')) {
      return input;
    }
    // 3rd github (github.com/...)
    else if (input.indexOf('/') !== -1) {
      const [pkg, tag = 'latest'] = input.split('@');
      return `https://github.com/${pkg}/archive/${tag}.zip`;
    }
    // mola github (github.com/themolacms)
    else {
      const [theme, tag = 'latest'] = input.split('@');
      const themeName =
        ['blank', 'intro', 'blog', 'shop'].indexOf(theme) === -1
          ? theme
          : `starter-${theme}`;
      return `https://github.com/themolacms/${themeName}/archive/${tag}.zip`;
    }
  }

  async create(
    resourceUrl: string,
    projectPath: string,
    appUrl: string,
    appName: string,
    appDescription: string
  ) {
    await this.downloadService.downloadAndUnzip(
      resourceUrl,
      projectPath + '/download.zip'
    );
    return this.modifyContent(projectPath, appUrl, appName, appDescription);
  }

  private async modifyContent(
    projectPath: string,
    appUrl: string,
    appName: string,
    appDescription: string
  ) {
    // const name = projectPath.replace(/\\/g, '/').split('/').pop() as string;
    // const nameCamel = camelCase(name);
    // const namePascal = pascalCase(name);
    // const nameCapital = capitalCase(name);
    // console.log(appUrl, appName, appDescription);
  }
}
