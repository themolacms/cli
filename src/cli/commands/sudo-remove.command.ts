import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoRemoveCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run() {
    await this.firebaseService.initializeApp();
    console.log('sudo remove');
  }
}
