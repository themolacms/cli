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

  async getUserDataByEmail(email: string) {
    const auth = await this.auth();
    const firestore = await this.firestore();
    // get user by email
    let data: null | {
      user: admin.auth.UserRecord;
      profileDoc: FirebaseFirestore.DocumentData;
    } = null;
    try {
      const user = await auth.getUserByEmail(email);
      const result = (
        await firestore
          .collection('profiles')
          .where('uid', '==', user.uid)
          .get()
      ).docs;
      if (user && result.length) {
        data = {user, profileDoc: result[0].data()};
      }
    } catch (e) {
      data = null;
    }
    return data;
  }

  async getSadmin() {
    const firestore = await this.firestore();
    let sadmin: Record<string, unknown> | null = null;
    try {
      const result = (
        await firestore
          .collection('profiles')
          .where('role', '==', 'sadmin')
          .get()
      ).docs;
      if (result.length) {
        sadmin = result[0].data();
      }
    } catch (e) {
      sadmin = null;
    }
    return sadmin;
  }

  async updateClaims(
    uid: string,
    username: string,
    updates: Record<string, unknown>
  ) {
    const auth = await this.auth();
    const firestore = await this.firestore();
    try {
      // get the user
      const {customClaims} = await auth.getUser(uid);
      const claims = {...customClaims, ...updates} as Record<string, unknown>;
      // set data
      await Promise.all([
        // update claims
        auth.setCustomUserClaims(uid, claims),
        // update profile role
        firestore.doc(`profiles/${username}`).update({role: updates.role}),
      ]);
    } catch (e) {
      throw new Error(
        `No user (or unknown error) with the uid ${blue(uid)} found.`
      );
    }
  }
}
