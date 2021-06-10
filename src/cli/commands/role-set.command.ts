import {yellow} from 'chalk';
import {capitalCase} from 'change-case';

import {OK, ERROR} from '../../lib/services/message.service';
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
    try {
      // set user claims & profiles.badges
      await this.firebaseService.updateClaims(email, {role});
      // result
      console.log(
        OK +
          `The user '${email}' is setted to the role of: ` +
          yellow(capitalCase(role))
      );
    } catch (e) {
      console.log(ERROR + e.message);
    }
  }
}
