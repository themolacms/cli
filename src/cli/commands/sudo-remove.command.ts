import {yellow} from 'chalk';

import {OK, WARN, ERROR} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoRemoveCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run() {
    const sadmin = await this.firebaseService.getSadmin();
    if (sadmin) {
      const {uid, id: username} = sadmin;
      try {
        // set user claims
        await this.firebaseService.updateClaims(
          uid as string,
          username as string,
          {role: 'subscriber'}
        );
        // result
        console.log(OK + 'The super admin is removed.');
      } catch (e: any) {
        console.log(ERROR + e.message);
      }
    } else {
      console.log(
        WARN +
          'This app has no super admin, set one: $ ' +
          yellow('mola sudo set <email>')
      );
    }
  }
}
