import {green} from 'chalk';

import {OK, WARN, ERROR} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoRemoveCommand {
  constructor(
    private projectService: ProjectService,
    private firebaseService: FirebaseService
  ) {}

  async run() {
    await this.firebaseService.initializeApp();
    const molaDotJson = await this.projectService.getMolaDotJson();
    const {backend} = molaDotJson;
    if (backend?.sadmin) {
      // init firebase
      await this.firebaseService.initializeApp();
      const auth = this.firebaseService.auth();
      const firestore = this.firebaseService.firestore();
      // get the user
      const email = backend.sadmin;
      const user = await auth.getUserByEmail(email);
      if (user) {
        const {uid, customClaims} = user;
        const claims = {...customClaims, role: 'subscriber'} as Record<
          string,
          unknown
        >;
        // update claims
        await auth.setCustomUserClaims(uid, claims);
        await this.projectService.updateMolaDotJson({
          backend: {...molaDotJson.backend, sadmin: ''},
        });
        // update profile
        const dbUser = (await firestore.doc(`users/${uid}`).get()).data();
        if (dbUser) {
          const badges = Object.keys(claims).map(key => claims[key]);
          await firestore.doc(`profiles/${dbUser.username}`).update({badges});
        }
        // result
        console.log(OK + 'The super admin is removed.');
      } else {
        console.log(ERROR + `No user with the email '${green(email)}' found.`);
      }
    } else {
      console.log(WARN + 'This app has no super admin.');
    }
  }
}
