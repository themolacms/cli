import {resolve} from 'path';

import {MolaDotJson} from '../types/mola.type';

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

  async create(resourceUrl: string, projectPath: string) {
    await this.downloadService.downloadAndUnzip(
      resourceUrl,
      projectPath + '/download.zip'
    );
  }

  async modify(
    projectPath: string,
    appDomain: string,
    appName: string,
    appDescription: string,
    deployTarget: string,
    addThemes: string[],
    addLocales: string[]
  ) {
    // get project name
    const projectName = projectPath
      .replace(/\\/g, '/')
      .split('/')
      .pop() as string;
    // load mola.json
    const molaDotJson = await this.fileService.readJson<MolaDotJson>(
      resolve(projectPath, 'mola.json')
    );
    const {
      domain: vendorDomain,
      name: vendorName,
      description: vendorDescription,
      projectName: vendorProjectName,
    } = molaDotJson.vendor;

    /**
     * General modifications
     */

    // docs/ (remove)
    this.fileService.removeFiles([resolve(projectPath, 'docs')]);

    // angular.json
    await this.fileService.changeContent(
      resolve(projectPath, 'angular.json'),
      {
        [vendorProjectName]: projectName,
      },
      true
    );

    // package.json
    await this.fileService.changeContent(resolve(projectPath, 'package.json'), {
      '"name": "starter-blank"': `"name": "${projectName}"`,
      [vendorDescription]: appDescription,
      [vendorDomain]: appDomain,
    });

    // mola.json
    molaDotJson.projectName = projectName;
    molaDotJson.domain = appDomain;
    molaDotJson.name = appName;
    molaDotJson.description = appDescription;
    await this.fileService.createJson(
      resolve(projectPath, 'mola.json'),
      molaDotJson
    );

    // src/index.html
    await this.fileService.changeContent(
      resolve(projectPath, 'src', 'index.html'),
      {
        [vendorDomain]: appDomain,
        [vendorName]: appName,
        [vendorDescription]: appDescription,
      },
      true
    );

    // src/app/app.component.ts
    await this.fileService.changeContent(
      resolve(projectPath, 'src', 'app', 'app.component.ts'),
      {
        [vendorDomain]: appDomain,
        [vendorName]: appName,
        [vendorDescription]: appDescription,
      },
      true
    );

    /**
     * Specific deploy target modifiations
     */

    // github
    if (deployTarget === 'github') {
      // src/404.html
      await this.fileService.changeContent(
        resolve(projectPath, 'src', '404.html'),
        {
          [vendorName]: appName,
        }
      );

      // src/CNAME
      await this.fileService.createFile(
        resolve(projectPath, 'src', 'CNAME'),
        appDomain
      );
    }

    // firebase/netlify
    else {
      // angular.json
      await this.fileService.changeContent(
        resolve(projectPath, 'angular.json'),
        {
          '"outputPath": "docs"': '"outputPath": "www"',
          '\n              "src/404.html",': '',
          '\n              "src/CNAME"': '',
        }
      );

      // package.json (deploy script)
      await this.fileService.changeContent(
        resolve(projectPath, 'package.json'),
        {
          '"deploy": "git add . && git commit -m \'deploy:app\' && git push"': `"deploy": "${deployTarget} deploy --only hosting"`,
        }
      );

      // src/404.html & src/CNAME (remove)
      this.fileService.removeFiles([
        resolve(projectPath, 'src', '404.html'),
        resolve(projectPath, 'src', 'CNAME'),
      ]);

      // src/index.html (remove script hacks)
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'index.html'),
        content =>
          content.replace(
            content.slice(
              content.indexOf('<!-- Github Pages Only -->'),
              content.indexOf('</script>') + 9
            ),
            ''
          )
      );
    }

    /**
     * Extra modifications
     */

    // additional themes
    if (addThemes.length) {
      //
    }

    // additional locale
    if (addLocales.length) {
      //
    }
  }
}
