import {blue} from 'chalk';
import * as open from 'open';

import {OK} from '../../lib/services/message.service';

export class DocsCommand {
  constructor() {}

  run() {
    const docsUrl = 'https://mola.lamnhan.com/docs';
    console.log(OK + 'Documetation link: ' + blue(docsUrl));
    open(docsUrl);
  }
}
