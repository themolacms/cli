import {yellow, green} from 'chalk';

import {OK, WARN} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoSetCommand {
  constructor(
    private projectService: ProjectService,
    private firebaseService: FirebaseService
  ) {}

  async run(email: string) {
    if (!email) {
      throw new Error("Missing required 'email' param.");
    }
    const molaDotJson = await this.projectService.getMolaDotJson();
    const {backend} = molaDotJson;
    if (!backend?.sadmin) {
      // init firebase
      await this.firebaseService.initializeApp();
      const auth = this.firebaseService.auth();
      // get the user
      const sadminUser = await auth.getUserByEmail(email);
      if (sadminUser) {
        const {uid, customClaims} = sadminUser;
        await auth.setCustomUserClaims(uid, {...customClaims, role: 'sadmin'});
        await this.projectService.updateMolaDotJson({
          backend: {...molaDotJson.backend, sadmin: email},
        });
        console.log(OK + 'A new super admin is setted.');
      }
    } else {
      console.log(
        WARN +
          `There is a super admin already - ${green(
            backend.sadmin
          )}, to set another one you need to remove the current first: $` +
          yellow('mola sudo remove')
      );
    }
  }
}
