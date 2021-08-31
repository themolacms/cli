import {FirebaseService} from '../../lib/services/firebase.service';

export class DatabaseInitCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run() {
    const firestore = await this.firebaseService.firestore();
  }
}
