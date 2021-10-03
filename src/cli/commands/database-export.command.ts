import {resolve} from 'path';
import {gray} from 'chalk';
import {ensureFile} from 'fs-extra';

import {OK, WARN} from '../../lib/services/message.service';
import {FileService} from '../../lib/services/file.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class DatabaseExportCommand {
  constructor(
    private fileService: FileService,
    private firebaseService: FirebaseService
  ) {}

  async run(collections: string[]) {
    const firestore = await this.firebaseService.firestore();
    // no inputs
    if (!collections.length) {
      return console.log(WARN + 'No collections to export.');
    }
    // export all collections
    const filePaths: string[] = [];
    await Promise.all(
      collections.map(async collection => {
        const filePath = `firebase/firestore_exports/${collection}.json`;
        const filePathFull = resolve(filePath);
        // file exists
        if (await this.fileService.exists(filePathFull)) {
          filePaths.push(filePath + ` ${gray('(skipped - file exists)')}`);
          return Promise.resolve();
        }
        // get data and save file
        const data = (await firestore.collection(collection).get()).docs.reduce(
          (result, doc) => {
            const item = doc.data();
            result[item.id] = item;
            return result;
          },
          {} as Record<string, any>
        );
        filePaths.push(filePath);
        await ensureFile(filePathFull);
        return this.fileService.createJson(filePathFull, data);
      })
    );
    console.log(
      OK +
        'Database collection exported to files:' +
        '\n   + ' +
        filePaths.join('\n   + ')
    );
  }
}
