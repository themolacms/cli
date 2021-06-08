import {FirebaseService} from '../../lib/services/firebase.service';

export class SudoSetCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(email: string) {
    await this.firebaseService.initializeApp();
    if (!email) {
      throw new Error('Missing required <email> param.');
    }
    console.log('sudo-set', {email});
    // https://firebase.google.com/docs/auth/admin/custom-claims
  }
}
