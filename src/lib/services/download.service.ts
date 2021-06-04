import axios from 'axios';
import {
  ensureDir,
  copy,
  remove,
  readdir,
  lstatSync,
  createWriteStream,
} from 'fs-extra';
import * as zipper from 'adm-zip';

export class DownloadService {
  constructor() {}

  async downloadAndUnzip(url: string, filePath: string) {
    // download
    await this.download(url, filePath);
    // unzip
    await this.unzip(filePath);
    // remove the zip file
    await remove(filePath);
    // unnest if wrapped
    const {folderPath} = this.extractFilePath(filePath);
    await this.unnest(folderPath);
  }

  download(url: string, filePath: string): Promise<void> {
    const {folderPath} = this.extractFilePath(filePath);
    return new Promise((resolve, reject) => {
      ensureDir(folderPath)
        .catch(reject)
        .then(() => {
          axios({
            method: 'GET',
            url,
            responseType: 'stream',
          }).then(downloadResponse => {
            downloadResponse.data.pipe(createWriteStream(filePath));
            downloadResponse.data.on('end', () => resolve());
            downloadResponse.data.on('error', reject);
          }, reject);
        }, reject);
    });
  }

  unzip(filePath: string): Promise<void> {
    const {folderPath} = this.extractFilePath(filePath);
    return new Promise(resolve => {
      setTimeout(() => {
        const zip = new zipper(filePath);
        zip.extractAllTo(folderPath, true);
        resolve();
      }, 1000);
    });
  }

  unnest(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      readdir(dir, (err, localPathChildren) => {
        const firstItem = dir + '/' + localPathChildren[0];
        if (
          localPathChildren.length === 1 &&
          lstatSync(firstItem).isDirectory()
        ) {
          // unnest
          copy(firstItem, dir)
            .catch(reject)
            // remove dir
            .then(() => remove(firstItem))
            // done
            .then(() => resolve(), reject);
        }
      });
    });
  }

  extractFilePath(filePath: string) {
    const pathSegments = filePath.split('/');
    const fileFullName = pathSegments.pop() as string;
    const fileName = fileFullName.split('.').shift() as string;
    const folderPath = pathSegments.join('/');
    const folderName = pathSegments.pop();
    return {
      pathSegments,
      folderPath,
      folderName,
      filePath,
      fileName,
      fileFullName,
    };
  }
}
