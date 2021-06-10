import {yellow, green} from 'chalk';

import {OK, WARN, ERROR} from '../../lib/services/message.service';
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
      try {
        // set user claims & profiles.badges
        await this.firebaseService.updateClaims(email, {role: 'sadmin'});
        // update mola.json (mola.backend.sadmin)
        await this.projectService.updateMolaDotJson({
          backend: {...molaDotJson.backend, sadmin: email},
        });
        // result
        console.log(OK + 'A new super admin is setted.');
      } catch (e) {
        console.log(ERROR + e.message);
      }
    } else {
      console.log(
        WARN +
          `There is a super admin already - ${green(
            backend.sadmin
          )}, remove the current first before setting new one: $ ` +
          yellow('mola sudo remove')
      );
    }
  }
}
