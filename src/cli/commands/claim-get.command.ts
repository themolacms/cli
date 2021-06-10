import {grey, blue, green} from 'chalk';
const ttyTable = require('tty-table');

import {OK, ERROR} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class ClaimGetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(email: string) {
    const auth = await this.firebaseService.auth();
    // get the user
    try {
      const user = await auth.getUserByEmail(email);
      const table = ttyTable(
        [
          {value: 'Name', width: 50, align: 'left'},
          {value: 'Value', width: 100, align: 'left'},
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
      console.log(OK + `The user ${blue(email)} has these claims:`);
      console.log(table.render());
    } catch (e) {
      console.log(
        ERROR +
          `No user (or unknown error) with the email ${blue(email)} found.`
      );
    }
  }
}
