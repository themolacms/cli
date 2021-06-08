import {blue} from 'chalk';
import * as open from 'open';

export class DocsCommand {
  constructor() {}

  run() {
    const docsUrl = 'https://mola.lamnhan.com/docs';
    console.log('Documetation link: ' + blue(docsUrl));
    open(docsUrl);
  }
}
