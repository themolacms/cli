import {yellow} from 'chalk';

import {OK, WARN, ERROR} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class ClaimSetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(email: string, claimInputs: string[] = []) {
    // process claims
    const claims = {} as Record<string, unknown>;
    claimInputs.forEach(claim => {
      const [name, value] = claim.split(':').map(x => x.trim());
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
              "Unsupported role = 'sadmin', please use: $" +
              yellow('mola sudo set <email>')
          );
        }
        if (supportedRoles.indexOf(value) === -1) {
          console.log(
            WARN +
              `Unsupported role = '${value}' (${supportedRoles.join(', ')})`
          );
        }
        return;
      }
      // filter legits
      if (name === 'legit') {
        const supportedLegits = ['average', 'official', 'suspicious'];
        if (supportedLegits.indexOf(value) === -1) {
          console.log(
            WARN +
              `Unsupported legit = '${value}' (${supportedLegits.join(', ')})`
          );
        }
        return;
      }
      // set claims
      claims[name] = value;
    });
    // set claims
    try {
      // set user claims & profiles.badges
      await this.firebaseService.updateClaims(email, claims);
      // result
      console.log(OK + `The roles is applied to the user '${email}'.`);
    } catch (e) {
      console.log(ERROR + e.message);
    }
  }
}
