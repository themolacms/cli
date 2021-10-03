import {resolve} from 'path';
import {gray} from 'chalk';

import {OK, WARN} from '../../lib/services/message.service';
import {FileService} from '../../lib/services/file.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class DatabaseImportCommand {
  constructor(
    private fileService: FileService,
    private firebaseService: FirebaseService
  ) {}

  async run(collections: string[]) {
    const firestore = await this.firebaseService.firestore();
    // no inputs
    if (!collections.length) {
      return console.log(WARN + 'No collections to import.');
    }
    // import all collections
    const filePaths: string[] = [];
    await Promise.all(
      collections.map(async collection => {
        const filePath = `firebase/firestore_exports/${collection}.json`;
        const filePathFull = resolve(filePath);
        // file not exists
        if (!(await this.fileService.exists(filePathFull))) {
          filePaths.push(filePath + ` ${gray('(skipped - data not exists)')}`);
          return Promise.resolve();
        }
        // load data and save collection;
        const data = (await this.fileService.readJson(filePathFull)) as Record<
          string,
          any
        >;
        filePaths.push(filePath);
        return Promise.all(
          Object.keys(data).map(async id =>
            firestore.collection(collection).doc(id).set(data[id])
          )
        );
      })
    );
    console.log(
      OK +
        'Data from files import to collections:' +
        '\n   + ' +
        filePaths.join('\n   + ')
    );
  }
}
