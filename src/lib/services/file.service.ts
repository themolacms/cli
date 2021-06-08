import {
  pathExists,
  readFile,
  readJson,
  writeJson,
  outputFile,
  remove,
} from 'fs-extra';
import * as recursiveReaddir from 'recursive-readdir';

export class FileService {
  constructor() {}

  exists(path: string) {
    return pathExists(path);
  }

  readText(filePath: string) {
    return readFile(filePath, 'utf8');
  }

  createFile(filePath: string, content: string) {
    return outputFile(filePath, content);
  }

  readJson<T>(filePath: string) {
    return readJson(filePath) as Promise<T>;
  }

  createJson<T>(filePath: string, jsonData: T) {
    return writeJson(filePath, jsonData, {spaces: 2});
  }

  removeFiles(paths: string[]) {
    return Promise.all(paths.map(filePath => remove(filePath)));
  }

  async changeContent(
    filePath: string,
    modifier: {[str: string]: string} | ((content: string) => string),
    multipleReplaces = false
  ) {
    let content = await readFile(filePath, 'utf8');
    if (modifier instanceof Function) {
      content = modifier(content);
    } else {
      Object.keys(modifier).forEach(
        str =>
          (content = content.replace(
            !multipleReplaces ? str : new RegExp(str, 'g'),
            modifier[str]
          ))
      );
    }
    return outputFile(filePath, content);
  }

  async listDir(path: string, ignores: string[] = []) {
    return recursiveReaddir(path, ignores);
  }
}
