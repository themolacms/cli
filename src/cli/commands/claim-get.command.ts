import {grey, green, yellow} from 'chalk';
import {capitalCase} from 'change-case';
const ttyTable = require('tty-table');

import {ERROR} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class ClaimGetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(email: string) {
    const auth = await this.firebaseService.auth();
    // get the user
    const user = await auth.getUserByEmail(email);
    if (user) {
      const table = ttyTable(
        [
          {value: 'Name', width: 50, align: 'left'},
          {value: 'Value', width: 200, align: 'left'},
        ],
        []
      );
      const claims = user.customClaims || {};
      if (!Object.keys(claims).length) {
        table.push(['role', green('subscriber') + grey(' (not setted)')]);
      } else {
        for (const key of Object.keys(claims)) {
          table.push([key, green(claims[key])]);
        }
      }
      // result
      console.log(`The user '${email}' has these claims:`);
      console.log(table.render());
    } else {
      console.log(ERROR + `No user with the email '${green(email)}' found.`);
    }
  }
}
