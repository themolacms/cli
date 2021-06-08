import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoSetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(email: string) {
    await this.firebaseService.initializeApp();
    console.log('sudo-set', {email});
  }
}
