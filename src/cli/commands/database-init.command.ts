import {gray} from 'chalk';

import {OK, WARN} from '../../lib/services/message.service';
import {FirebaseService} from '../../lib/services/firebase.service';

export class DatabaseInitCommand {
  constructor(private firebaseService: FirebaseService) {}

  async run(collections: string[]) {
    const firestore = await this.firebaseService.firestore();
    // no inputs
    if (!collections.length) {
      return console.log(WARN + 'No collections to init.');
    }
    // init collections
    await Promise.all(
      collections.map(async collection =>
        this.initCollection(firestore, collection)
      )
    );
    console.log(
      OK +
        'Database collections initialized: ' +
        '\n   + ' +
        collections.join('\n   + ')
    );
  }

  async initCollection(
    firestore: FirebaseFirestore.Firestore,
    collection: string,
    types = ['default'],
    locales = ['en-US']
  ) {
    const timestamp = new Date().toISOString();
    // search index
    const searchId = firestore.collection('metas').doc().id;
    const seachIndexDoc: Record<string, unknown> = {
      uid: '',
      id: searchId,
      title: `${collection}_search-index-0`,
      type: 'default',
      status: 'publish',
      createdAt: timestamp,
      updatedAt: timestamp,
      master: collection,
      group: 'search_index',
      value: {
        items: {},
      },
    };
    await firestore.collection('metas').doc(searchId).set(seachIndexDoc);
    // collection meta
    const collectionMetaId = `$${collection}`;
    const documentCounting = types.reduce((result, type) => {
      result[type] = locales.reduce((result2, locale) => {
        result2[locale] = {
          draft: 0,
          publish: 0,
          archive: 0,
          trash: 0,
        };
        return result2;
      }, {} as Record<string, unknown>);
      return result;
    }, {} as Record<string, unknown>);
    const collectionMetaDoc: Record<string, unknown> = {
      uid: '',
      id: collectionMetaId,
      title: `${collection}_collection-metas`,
      type: 'default',
      status: 'publish',
      createdAt: timestamp,
      updatedAt: timestamp,
      master: collection,
      group: 'collection_meta',
      value: {
        documentCounting,
        searchIndexing: {
          currentId: searchId,
          map: {
            [searchId]: {
              count: 0,
            },
          },
        },
      },
    };
    return firestore
      .collection('metas')
      .doc(collectionMetaId)
      .set(collectionMetaDoc);
  }
}
