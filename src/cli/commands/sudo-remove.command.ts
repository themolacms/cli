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
      const sadminUser = await auth.getUserByEmail(backend.sadmin);
      if (sadminUser) {
        const {uid, customClaims} = sadminUser;
        await auth.setCustomUserClaims(uid, {
          ...customClaims,
          role: 'subscriber',
        });
        await this.projectService.updateMolaDotJson({
          backend: {...molaDotJson.backend, sadmin: ''},
        });
        console.log('The super admin is removed.');
      }
    } else {
      console.log('This app has no super admin.');
    }
  }
}
