import {yellow} from 'chalk';

import {OK, WARN, ERROR} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoSetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(email: string) {
    if (!email) {
      return console.log(ERROR + "Missing required 'email' param.");
    }
    const sadmin = await this.firebaseService.getSadmin();
    if (sadmin) {
      return console.log(
        WARN +
          'There is a super admin already, remove the current first before setting new one: $ ' +
          yellow('mola sudo remove')
      );
    }
    const userData = await this.firebaseService.getUserDataByEmail(email);
    if (!userData) {
      return console.log(ERROR + `No user with the email '${email}' found.`);
    }
    // set the new super admin
    const {uid, id: username} = userData.profileDoc;
    try {
      // set user claims
      await this.firebaseService.updateClaims(uid, username, {role: 'sadmin'});
      // result
      console.log(OK + 'A new super admin is setted.');
    } catch (e: any) {
      console.log(ERROR + e.message);
    }
  }
}
