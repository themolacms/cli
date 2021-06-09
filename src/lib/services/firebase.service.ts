import {resolve} from 'path';
import * as admin from 'firebase-admin';

import {FileService} from './file.service';

export class FirebaseService {
  private keyPath = resolve('firebase', 'key.json');
  private app?: admin.app.App;

  constructor(private fileService: FileService) {}

  async initializeApp() {
    if (!this.app) {
      if (!(await this.fileService.exists(this.keyPath))) {
        throw new Error(
          "No Firebase service account key found at './firebase/key.json'"
        );
      }
      const serviceAccount =
        await this.fileService.readJson<admin.ServiceAccount>(this.keyPath);
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  auth() {
    return this.app?.auth() as admin.auth.Auth;
  }

  firestore() {
    return this.app?.firestore() as admin.firestore.Firestore;
  }
}
