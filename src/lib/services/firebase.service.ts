import {resolve} from 'path';
import {blue} from 'chalk';
import * as admin from 'firebase-admin';

import {FileService} from './file.service';

export class FirebaseService {
  private keyPath = resolve('firebase', 'key.json');
  private app?: admin.app.App;

  constructor(private fileService: FileService) {}

  private async initializeApp() {
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

  async auth() {
    await this.initializeApp();
    return this.app?.auth() as admin.auth.Auth;
  }

  async firestore() {
    await this.initializeApp();
    return this.app?.firestore() as admin.firestore.Firestore;
  }

  async updateClaims(email: string, updates: Record<string, unknown>) {
    const auth = await this.auth();
    const firestore = await this.firestore();
    // get the user
    try {
      const user = await auth.getUserByEmail(email);
      const {uid, customClaims} = user;
      const claims = {...customClaims, ...updates} as Record<string, unknown>;
      // update claims
      await auth.setCustomUserClaims(uid, claims);
      // update profile role
      if (updates.role) {
        const dbUser = (await firestore.doc(`users/${uid}`).get()).data();
        if (dbUser) {
          await firestore.doc(`profiles/${dbUser.username}`).update({
            role: updates.role,
          });
        }
      }
    } catch (e) {
      throw new Error(
        `No user (or unknown error) with the email ${blue(email)} found.`
      );
    }
  }
}
