import {grey, green, yellow} from 'chalk';
import {capitalCase} from 'change-case';

import {ERROR} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class RoleGetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(email: string) {
    // init firebase
    await this.firebaseService.initializeApp();
    const auth = this.firebaseService.auth();
    // get the user
    const user = await auth.getUserByEmail(email);
    if (user) {
      const role = user.customClaims?.role;
      console.log(
        `The user '${email}' has the role of: ` +
          yellow(capitalCase(role || 'subscriber')) +
          (role ? '' : grey(' (no setted)'))
      );
    } else {
      console.log(ERROR + `No user with the email '${green(email)}' found.`);
    }
  }
}
