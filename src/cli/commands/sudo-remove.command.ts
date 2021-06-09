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
      // get the user
      const email = backend.sadmin;
      const sadminUser = await auth.getUserByEmail(email);
      if (sadminUser) {
        const {uid, customClaims} = sadminUser;
        await auth.setCustomUserClaims(uid, {
          ...customClaims,
          role: 'subscriber',
        });
        await this.projectService.updateMolaDotJson({
          backend: {...molaDotJson.backend, sadmin: ''},
        });
        console.log(OK + 'The super admin is removed.');
      } else {
        console.log(ERROR + `No user with the email '${green(email)}' found.`);
      }
    } else {
      console.log(WARN + 'This app has no super admin.');
    }
  }
}
