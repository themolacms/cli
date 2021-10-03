import {blue, yellow, green, red} from 'chalk';

import {OK, WARN, ERROR} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class ClaimSetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(email: string, claimInputs: string[] = []) {
    // process claims
    const claims = {} as Record<string, unknown>;
    claimInputs.forEach(claim => {
      const [name, value] = claim.split('=').map(x => x.trim());
      // filter roles
      if (name === 'role') {
        const supportedRoles = [
          'admin',
          'editor',
          'author',
          'contributor',
          'subscriber',
        ];
        if (value === 'sdamin') {
          console.log(
            WARN +
              `Unsupported: role=${red('sadmin')}, please use: $ ` +
              yellow('mola sudo set <email>')
          );
          return;
        }
        if (supportedRoles.indexOf(value) === -1) {
          console.log(
            WARN +
              `Unsupported: role=${red(value)} (${green(
                supportedRoles.join('|')
              )})`
          );
          return;
        }
      }
      // set claims
      claims[name] = value;
    });
    // set claims
    if (Object.keys(claims).length) {
      const userData = await this.firebaseService.getUserDataByEmail(email);
      if (!userData) {
        return console.log(ERROR + `No user with the email "${email}"" found.`);
      }
      // set the claims
      const {uid, id: username} = userData.profileDoc;
      try {
        // set user claims && profile role
        await this.firebaseService.updateClaims(uid, username, claims);
        // result
        console.log(OK + `The roles is applied to the user ${blue(email)}.`);
      } catch (e: any) {
        console.log(ERROR + e.message);
      }
    }
  }
}
