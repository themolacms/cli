import {OK, WARN, ERROR} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoRemoveCommand {
  constructor(
    private projectService: ProjectService,
    private firebaseService: FirebaseService
  ) {}

  async run() {
    const molaDotJson = await this.projectService.getMolaDotJson();
    const {backend} = molaDotJson;
    if (backend?.sadmin) {
      const email = backend.sadmin;
      try {
        // set user claims & profiles.badges
        await this.firebaseService.updateClaims(email, {role: 'subscriber'});
        // update mola.json (mola.backend.sadmin)
        await this.projectService.updateMolaDotJson({
          backend: {...molaDotJson.backend, sadmin: ''},
        });
        // result
        console.log(OK + 'The super admin is removed.');
      } catch (e) {
        console.log(ERROR + e.message);
      }
    } else {
      console.log(WARN + 'This app has no super admin.');
    }
  }
}
