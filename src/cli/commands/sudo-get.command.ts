import {yellow, blue} from 'chalk';

import {OK, WARN} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoGetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run() {
    const sadmin = await this.firebaseService.getSadmin();
    if (sadmin) {
      // retrieve email
      const auth = await this.firebaseService.auth();
      const email =
        sadmin.email || (await auth.getUser(sadmin.uid as string)).email;
      // show info
      const text = `${sadmin.title}` + ` (${email || sadmin.id})`;
      console.log(OK + 'The super admin of this app is: ' + blue(text));
    } else {
      console.log(
        WARN +
          'There is no super admin, set one: $ ' +
          yellow('mola sudo set <email>')
      );
    }
  }
}
