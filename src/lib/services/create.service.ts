import {resolve} from 'path';

import {MolaDotJson} from '../types/mola.type';

import {HelperService, CompareAndExtractResult} from './helper.service';
import {FileService} from './file.service';
import {DownloadService} from './download.service';

export class CreateService {
  constructor(
    private helperService: HelperService,
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
    deployTarget: string,
    appDomain: string,
    appName: string,
    appDescription: string,
    appThemes: string[],
    appLocales: string[]
  ) {
    // get project name
    const appProjectName = projectPath
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
      themes,
      locales,
    } = molaDotJson;
    const vendorThemes = [...themes];
    const vendorLocales = [...locales];
    const themeChanging = this.helperService.compareAndExtract(
      vendorThemes,
      appThemes
    );
    const localeChanging = this.helperService.compareAndExtract(
      vendorLocales,
      appLocales
    );

    // update mola.json
    molaDotJson.projectName = appProjectName;
    molaDotJson.domain = appDomain;
    molaDotJson.name = appName;
    molaDotJson.description = appDescription;
    molaDotJson.themes = themeChanging.latestValues;
    molaDotJson.locales = localeChanging.latestValues;
    await this.fileService.createJson(
      resolve(projectPath, 'mola.json'),
      molaDotJson
    );

    // modify content
    await this.modifyContent(
      projectPath,
      deployTarget,
      {appProjectName, appDomain, appName, appDescription},
      {vendorProjectName, vendorDomain, vendorName, vendorDescription}
    );

    // modify themes
    await this.modifyTheme(projectPath, themeChanging);

    // modify locales
    await this.modifyLocale(projectPath, localeChanging);
  }

  private async modifyContent(
    projectPath: string,
    deployTarget: string,
    app: {
      appProjectName: string;
      appDomain: string;
      appName: string;
      appDescription: string;
    },
    vendor: {
      vendorProjectName: string;
      vendorDomain: string;
      vendorName: string;
      vendorDescription: string;
    }
  ) {
    const {appProjectName, appDomain, appName, appDescription} = app;
    const {vendorProjectName, vendorDomain, vendorName, vendorDescription} =
      vendor;
    /**
     * General modifications
     */

    // docs/ (remove)
    this.fileService.removeFiles([resolve(projectPath, 'docs')]);

    // angular.json
    await this.fileService.changeContent(
      resolve(projectPath, 'angular.json'),
      {
        [vendorProjectName]: appProjectName,
      },
      true
    );

    // package.json
    await this.fileService.changeContent(resolve(projectPath, 'package.json'), {
      '"name": "starter-blank"': `"name": "${appProjectName}"`,
      [vendorDescription]: appDescription,
      [vendorDomain]: appDomain,
    });

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
  }

  private async modifyTheme(
    projectPath: string,
    themeChanging: CompareAndExtractResult
  ) {
    const {toChange, toAdds, toRemoves} = themeChanging;
    // change
    if (toChange) {
      const {from, to} = toChange;
      // src/styles.scss
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'styles.scss'),
        {
          [`@lamnhan/unistylus/scss/themes/${from}-default`]: `@lamnhan/unistylus/scss/themes/${to}-default`,
          [`[data-theme=${from}]`]: `[data-theme=${to}]`,
        }
      );
      // src/theming/app.component.scss
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'theming', 'app.component.scss'),
        {
          [from]: to,
        },
        true
      );
    }
    // remove
    if (toRemoves.length) {
      const stylesRemoving = {} as Record<string, string>;
      const compRemoving = {} as Record<string, string>;
      toRemoves.forEach(toRemove => {
        // styles.scss (import)
        stylesRemoving[
          `\n@import '@lamnhan/unistylus/scss/themes/${toRemove}';`
        ] = '';
        // styles.scss (customization, may be)
        stylesRemoving[
          `[data-theme=${toRemove}]`
        ] = `/* TODO: delete this -> [data-theme=${toRemove}] */`;
        stylesRemoving[
          `[data-theme=${toRemove}],`
        ] = `/* TODO: delete this -> [data-theme=${toRemove}], */`;
        // app.component.scss (data)
        compRemoving[
          `$${toRemove}_theme_icons:`
        ] = `/* TODO: delete this -> $${toRemove}_theme_icons: */`;
        // app.component.scss (register)
        compRemoving[`\n    ${toRemove}: $${toRemove}_theme_icons,`] = '';
      });
      // src/styles.scss
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'styles.scss'),
        stylesRemoving
      );
      // src/theming/app.component.scss
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'theming', 'app.component.scss'),
        compRemoving
      );
    }
    // add
    if (toAdds.length) {
      const stylesAdding1 = [] as string[];
      const stylesAdding2 = [] as string[];
      const compAdding1 = [] as string[];
      const compAdding2 = [] as string[];
      toAdds.forEach(toAdd => {
        // styles.scss (import)
        stylesAdding1.push(
          `@import '@lamnhan/unistylus/scss/themes/${toAdd}';`
        );
        // styles.scss (customization, may be)
        stylesAdding2.push(`[data-theme=${toAdd}],`);
        // app.component.scss (data)
        compAdding1.push(`$${toAdd}_theme_icons: ();`);
        // app.component.scss (register)
        compAdding2.push(`    ${toAdd}: $${toAdd}_theme_icons,`);
      });
      // src/styles.scss
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'styles.scss'),
        {
          "-default';\n": "-default';\n" + stylesAdding1.join('\n') + '\n',
          '[data-theme=default],\n':
            '[data-theme=default],\n' + stylesAdding2.join('\n') + '\n',
        }
      );
      // src/theming/app.component.scss
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'theming', 'app.component.scss'),
        {
          '\n@include register_app_icons(':
            '\n' + compAdding1.join('\n\n') + '\n@include register_app_icons(',
          '\n    default: ': '\n' + compAdding2.join('\n') + '\n    default: ',
        }
      );
    }
  }

  private async modifyLocale(
    projectPath: string,
    localeChanging: CompareAndExtractResult
  ) {
    const {toChange, toAdds, toRemoves} = localeChanging;
    // ...
  }
}
