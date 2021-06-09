import {grey, green, yellow} from 'chalk';
import {capitalCase} from 'change-case';

import {ERROR} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class RoleSetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(role: string, email: string) {
    const supportedRoles = [
      'admin',
      'editor',
      'author',
      'contributor',
      'subscriber',
    ];
    if (supportedRoles.indexOf(role) === -1) {
      throw new Error('Unsupported role!');
    }
    // init firebase
    await this.firebaseService.initializeApp();
    const auth = this.firebaseService.auth();
    // get the user
    const user = await auth.getUserByEmail(email);
    if (user) {
      const {uid, customClaims} = user;
      await auth.setCustomUserClaims(uid, {...customClaims, role});
      console.log(
        `The user '${email}' is setted to the role of: ` +
          yellow(capitalCase(role))
      );
    } else {
      console.log(ERROR + `No user with the email '${green(email)}' found.`);
    }
  }
}
