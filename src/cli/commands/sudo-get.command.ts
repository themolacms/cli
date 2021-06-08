import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoGetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run() {
    await this.firebaseService.initializeApp();
    console.log('sudo get');
  }
}
