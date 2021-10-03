import {execSync} from 'child_process';
import {resolve} from 'path';
import {yellow, green, gray} from 'chalk';
import {move} from 'fs-extra';

import {
  HelperService,
  CompareAndExtractResult,
} from '../../lib/services/helper.service';
import {OK, INFO} from '../../lib/services/message.service';
import {FileService} from '../../lib/services/file.service';
import {DownloadService} from '../../lib/services/download.service';
import {ProjectService} from '../../lib/services/project.service';

interface NewCommandOptions {
  source?: string;
  deploy?: 'github' | 'firebase';
  locale?: string;
  skin?: string;
  soul?: string;
  skipGit?: boolean;
  skipInstall?: boolean;
}

export class NewCommand {
  constructor(
    private helperService: HelperService,
    private fileService: FileService,
    private downloadService: DownloadService,
    private projectService: ProjectService
  ) {}

  async run(
    theme: string,
    projectName: string,
    appDomain: string,
    appName: string,
    appDescription: string,
    commandOptions: NewCommandOptions
  ) {
    const resourceUrl = this.proccessInput(commandOptions.source || theme);
    const validProjectName = projectName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, ' ')
      .replace(/ /g, '-');
    const projectPath = resolve(validProjectName);
    appDomain = appDomain || 'yours.domain';
    appName = appName || 'Mola App';
    appDescription = appDescription || 'Just another awesome Mola app.';
    const deployTarget = commandOptions.deploy || 'github';
    const appLocales = this.helperService.parseParams(
      commandOptions.locale || ''
    );
    const appSkins = this.helperService.parseParams(commandOptions.skin || '');
    const appSoul = commandOptions.soul || '';
    // create
    await this.create(resourceUrl, projectPath);
    // modify
    await this.modify(
      projectPath,
      deployTarget,
      appDomain,
      appName,
      appDescription,
      appLocales,
      appSkins,
      appSoul
    );
    // listing
    const files = await this.fileService.listDir(projectPath);
    console.log(
      OK + `Create a new ${yellow(theme)} project:`,
      green(validProjectName)
    );
    console.log('From: ' + gray(resourceUrl));
    files.forEach(file =>
      console.log(file.replace(projectPath, '').replace(/\\/g, '/').substr(1))
    );
    // install dependencies
    if (!commandOptions.skipInstall) {
      execSync('npm install', {stdio: 'inherit', cwd: projectPath});
    }
    // init git
    if (!commandOptions.skipGit) {
      execSync('git init', {stdio: 'inherit', cwd: projectPath});
    }
    // if there are key.json
    if (await this.fileService.exists(resolve('key.json'))) {
      // move key.json to firebase/key.json
      await move(
        resolve('key.json'),
        resolve(projectPath, 'firebase', 'key.json')
      );
      // run setup
      execSync('mola setup', {stdio: 'inherit', cwd: projectPath});
      // notify key.json
      console.log(
        INFO + `Firebase key.json was moved to ${validProjectName}/firebase/`
      );
    }
  }

  proccessInput(input: string) {
    // direct url or local file
    if (input.endsWith('.zip')) {
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
      return `https://github.com/themolacms/${theme}/archive/${tag}.zip`;
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
    appLocales: string[],
    appSkins: string[],
    appSoul: string
  ) {
    // load mola.json
    const molaDotJson = await this.projectService.getMolaDotJson(projectPath);
    const {
      domain: vendorDomain,
      name: vendorName,
      description: vendorDescription,
      locales,
      skins,
      soul,
    } = molaDotJson;
    const vendorLocales = [...locales];
    const vendorSkins = [...skins];
    const vendorSoul = soul;
    const localeChanging = this.helperService.compareAndExtract(
      vendorLocales,
      appLocales
    );
    const skinChanging = this.helperService.compareAndExtract(
      vendorSkins,
      appSkins
    );
    const soulChanging = appSoul && vendorSoul !== appSoul;

    // update mola.json
    molaDotJson.domain = appDomain;
    molaDotJson.name = appName;
    molaDotJson.description = appDescription;
    molaDotJson.deployTarget = deployTarget;
    molaDotJson.locales = localeChanging.latestValues;
    molaDotJson.skins = skinChanging.latestValues;
    molaDotJson.soul = soulChanging ? appSoul : vendorSoul;
    await this.fileService.createJson(
      resolve(projectPath, 'mola.json'),
      molaDotJson
    );

    // modify content
    await this.modifyContent(
      projectPath,
      deployTarget,
      {appDomain, appName, appDescription},
      {vendorDomain, vendorName, vendorDescription}
    );

    // modify locales
    await this.modifyLocale(projectPath, localeChanging);

    // modify skins
    await this.modifySkin(projectPath, skinChanging);

    // modify soul
    if (soulChanging) {
      await this.modifySoul(projectPath, vendorSoul, appSoul);
    }
  }

  private async modifyContent(
    projectPath: string,
    deployTarget: string,
    app: {
      appDomain: string;
      appName: string;
      appDescription: string;
    },
    vendor: {
      vendorDomain: string;
      vendorName: string;
      vendorDescription: string;
    }
  ) {
    const {appDomain, appName, appDescription} = app;
    const {vendorDomain, vendorName, vendorDescription} = vendor;
    /**
     * General modifications
     */

    // docs/ (remove)
    this.fileService.removeFiles([resolve(projectPath, 'docs')]);

    // .ngxerrc.json
    await this.fileService.changeContent(
      resolve(projectPath, '.ngxerrc.json'),
      {
        [vendorDomain]: appDomain,
      }
    );

    // package.json
    await this.fileService.changeContent(resolve(projectPath, 'package.json'), {
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

    // src/app/app.module.ts
    await this.fileService.changeContent(
      resolve(projectPath, 'src', 'app', 'app.module.ts'),
      {
        [vendorDomain]: appDomain,
        [vendorName]: appName,
        [vendorDescription]: appDescription,
      },
      true
    );

    // src/environments/environment.prod.ts
    await this.fileService.changeContent(
      resolve(projectPath, 'src', 'environments', 'environment.prod.ts'),
      {
        [vendorName]: appName,
      }
    );

    // src/environments/environment.ts
    await this.fileService.changeContent(
      resolve(projectPath, 'src', 'environments', 'environment.ts'),
      {
        [vendorName]: appName,
      }
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

    // firebase
    else {
      // .ngxerrc.json
      await this.fileService.changeContent(
        resolve(projectPath, '.ngxerrc.json'),
        {
          '"out": "docs"': `"out": "${deployTarget}/public"`,
        }
      );

      // angular.json
      await this.fileService.changeContent(
        resolve(projectPath, 'angular.json'),
        {
          '"outputPath": "docs"': `"outputPath": "${deployTarget}/public"`,
          '\n              "src/404.html",': '',
          '\n              "src/CNAME",': '',
        }
      );

      // package.json (deploy script)
      await this.fileService.changeContent(
        resolve(projectPath, 'package.json'),
        {
          '"deploy:app": "git add . && git commit -m \'deploy:app\' && git push"': `"deploy:app": "cd ${deployTarget} && ${deployTarget} deploy --only hosting && cd .."`,
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
              content.indexOf('\n  <!-- Github Pages Only -->'),
              content.indexOf('</script>') + 11
            ),
            ''
          )
      );
    }
  }

  private async modifyLocale(
    projectPath: string,
    localeChanging: CompareAndExtractResult
  ) {
    const {toChange, toAdds, toRemoves} = localeChanging;

    /**
     * change
     */
    if (toChange) {
      const {from, to} = toChange;
      const [fromLang] = from.split('-');
      const [toLang] = to.split('-');
      // src/index.html
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'index.html'),
        {
          [`lang="${fromLang}"`]: `lang="${toLang}"`,
          [from]: to,
        },
        true
      );
      // src/app/app.module.ts
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'app', 'app.module.ts'),
        {
          [from]: to,
          "text: 'English'": `text: 'Locale: ${to}'`,
        },
        true
      );
      // assets/i18n/${from}.json
      const i18nFromPath = resolve(
        projectPath,
        'src',
        'assets',
        'i18n',
        `${from}.json`
      );
      const i18nJson = await this.fileService.readJson(i18nFromPath);
      await this.fileService.createJson(
        resolve(projectPath, 'src', 'assets', 'i18n', `${to}.json`),
        i18nJson
      );
      await this.fileService.removeFiles([i18nFromPath]);
      // manifests/${from}.webmanifest
      const manifestFromPath = resolve(
        projectPath,
        'src',
        'manifests',
        `${from}.webmanifest`
      );
      const manifestJson = await this.fileService.readJson(manifestFromPath);
      await this.fileService.createJson(
        resolve(projectPath, 'src', 'manifests', `${to}.webmanifest`),
        manifestJson
      );
      await this.fileService.removeFiles([manifestFromPath]);
    }

    /**
     * remove
     */

    if (toRemoves.length) {
      // prepare
      const moduleRemoving = {} as Record<string, string>;
      const i18nRemoving = [] as string[];
      const manifestRemoving = [] as string[];
      toRemoves.forEach(toRemove => {
        // src/app/app.module.ts
        moduleRemoving[`'${toRemove}'`] = '';
        moduleRemoving[`'${toRemove}',`] = '';
        // assets/i18n/
        i18nRemoving.push(
          resolve(projectPath, 'src', 'assets', 'i18n', `${toRemove}.json`)
        );
        // manifests/
        manifestRemoving.push(
          resolve(projectPath, 'src', 'manifests', `${toRemove}.webmanifest`)
        );
      });
      // src/app/app.module.ts
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'app', 'app.module.ts'),
        moduleRemoving
      );
      // assets/i18n/
      await this.fileService.removeFiles(i18nRemoving);
      // manifests/
      await this.fileService.removeFiles(manifestRemoving);
    }

    /**
     * add
     */

    if (toAdds.length) {
      // prepare
      const moduleAdding = toAdds;
      const i18nAdding = toAdds;
      const manifestAdding = toAdds;
      // src/app/app.module.ts
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'app', 'app.module.ts'),
        {
          '/* MOLA:META_TRANSLATIONS */':
            '{\n' +
            moduleAdding
              .map(toAdd =>
                [
                  `        '${toAdd}': {`,
                  "          url: '',",
                  "          title: '',",
                  "          description: '',",
                  "          image: '',",
                  `          locale: '${toAdd}',`,
                  '        },',
                ].join('\n')
              )
              .join('\n') +
            '\n      },',
          'availableLangs: [':
            'availableLangs: [' +
            "'" +
            moduleAdding.reverse().join("', '") +
            "', ",
        }
      );
      // assets/i18n/
      await Promise.all(
        i18nAdding.map(toAdd =>
          this.fileService.createJson(
            resolve(projectPath, 'src', 'assets', 'i18n', `${toAdd}.json`),
            {}
          )
        )
      );
      // manifests/
      await Promise.all(
        manifestAdding.map(toAdd =>
          this.fileService.createJson(
            resolve(projectPath, 'src', 'manifests', `${toAdd}.webmanifest`),
            {}
          )
        )
      );
    }
  }

  private async modifySkin(
    projectPath: string,
    skinChanging: CompareAndExtractResult
  ) {
    const {toChange, toAdds, toRemoves} = skinChanging;

    /**
     * change
     */
    if (toChange) {
      const {from, to} = toChange;
      // src/styles.scss
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'styles.scss'),
        {
          [`@unistylus/core/scss/skins/${from}-default`]: `@unistylus/core/scss/skins/${to}-default`,
          [`[data-theme=${from}]`]: `[data-theme=${to}]`,
          [`[data-theme="${from}"]`]: `[data-theme="${to}"]`,
          [`[data-theme='${from}']`]: `[data-theme='${to}']`,
        }
      );
      // src/app/app.module.ts
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'app', 'app.module.ts'),
        {
          [`theme: '${from}'`]: `theme: '${to}'`,
          [`value: '${from}'`]: `value: '${to}'`,
          "text: 'THEME.LIGHT'": `text: 'Theme: ${to}'`,
        }
      );
    }

    /**
     * remove
     */

    if (toRemoves.length) {
      // prepare
      const stylesRemoving = {} as Record<string, string>;
      toRemoves.forEach(toRemove => {
        // styles.scss (import)
        stylesRemoving[`\n@use '@unistylus/core/scss/skins/${toRemove}';`] = '';
        // styles.scss (customization, may be)
        const stylesRemovingText = `// TODO: delete this line/block -> [data-theme=${toRemove}]`;
        stylesRemoving[`[data-theme=${toRemove}]`] = stylesRemovingText;
        stylesRemoving[`[data-theme="${toRemove}"]`] = stylesRemovingText;
        stylesRemoving[`[data-theme='${toRemove}']`] = stylesRemovingText;
        stylesRemoving[`[data-theme=${toRemove}],`] = stylesRemovingText;
        stylesRemoving[`[data-theme="${toRemove}"],`] = stylesRemovingText;
        stylesRemoving[`[data-theme='${toRemove}'],`] = stylesRemovingText;
      });
      // src/styles.scss
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'styles.scss'),
        stylesRemoving
      );
    }

    /**
     * add
     */

    if (toAdds.length) {
      // prepare
      const stylesAdding1 = [] as string[];
      const stylesAdding2 = [] as string[];
      toAdds.forEach(toAdd => {
        // styles.scss (import)
        stylesAdding1.push(`@use '@unistylus/core/scss/skins/${toAdd}';`);
        // styles.scss (customization)
        stylesAdding2.push(
          `// modify "${toAdd}" skin\n// [data-theme=${toAdd}] {}`
        );
      });
      // src/styles.scss
      await this.fileService.changeContent(
        resolve(projectPath, 'src', 'styles.scss'),
        {
          "-default';\n": "-default';\n" + stylesAdding1.join('\n') + '\n',
          '\n// register soul':
            '\n' + stylesAdding2.join('\n\n') + '\n\n// register soul',
        }
      );
    }
  }

  private async modifySoul(projectPath: string, from: string, to: string) {
    // src/styles.scss
    await this.fileService.changeContent(
      resolve(projectPath, 'src', 'styles.scss'),
      {
        [`@unistylus/${from}`]: `@unistylus/${to}`,
      },
      true
    );
  }
}
