import {readFile, outputFile} from 'fs-extra';
import * as recursiveReaddir from 'recursive-readdir';

export class FileService {
  constructor() {}

  async changeContent(
    filePath: string,
    modifier: {[str: string]: string} | ((content: string) => string)
  ) {
    let content = await readFile(filePath, 'utf8');
    if (modifier instanceof Function) {
      content = modifier(content);
    } else {
      Object.keys(modifier).forEach(
        str => (content = content.replace(str, modifier[str]))
      );
    }
    return outputFile(filePath, content);
  }

  async readFiles(path: string, ignores: string[] = []) {
    return recursiveReaddir(path, ignores);
  }
}
