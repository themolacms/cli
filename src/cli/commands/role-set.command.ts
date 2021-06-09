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
    const firestore = this.firebaseService.firestore();
    // get the user
    const user = await auth.getUserByEmail(email);
    if (user) {
      const {uid, customClaims} = user;
      const claims = {...customClaims, role} as Record<string, unknown>;
      // update claims
      await auth.setCustomUserClaims(uid, claims);
      // update profile
      const dbUser = (await firestore.doc(`users/${uid}`).get()).data();
      if (dbUser) {
        const badges = Object.keys(claims).map(key => claims[key]);
        await firestore.doc(`profiles/${dbUser.username}`).update({badges});
      }
      // result
      console.log(
        `The user '${email}' is setted to the role of: ` +
          yellow(capitalCase(role))
      );
    } else {
      console.log(ERROR + `No user with the email '${green(email)}' found.`);
    }
  }
}
