import { TestBed } from '@angular/core/testing';

import { AngularFireModule, FirebaseApp } from '@angular/fire/compat';
import {
  AngularFirestoreModule,
  AngularFirestore,
  SETTINGS as FIRESTORE_SETTINGS,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
} from '@angular/fire/compat/firestore';
import {
  AngularFireAuth,
  AngularFireAuthModule,
  SETTINGS as AUTH_SETTINGS,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/compat/auth';

import firebase from 'firebase/compat/app';

// https://github.com/tja4472/ngrx-task/blob/Updated/src/app/services/task-list.data.service.ts
// https://github.com/tja4472/ngrx-task/blob/Updated/src/app/services/user-info.data.service.spec.ts
// https://github.com/tja4472/ngrx-task/blob/Updated/src/app/%2Btest-examples/example01.spec.ts
/*
valueChanges
doc delete
doc set

*/
const COMMON_CONFIG = {
  apiKey: 'dummy-apiKey',
  // authDomain: 'angularfire2-test.firebaseapp.com',
  // databaseURL: 'https://angularfire2-test.firebaseio.com',
  projectId: 'demo-1',
  // storageBucket: 'angularfire2-test.appspot.com',
  // messagingSenderId: '920323787688',
  // appId: '1:920323787688:web:2253a0e5eb5b9a8b',
  // databaseName: 'angularfire2-test',
  // measurementId: 'G-W20QDV5CZP',
};

const emulators = {
  auth: ['http://localhost:9099'],
  firestore: ['localhost', 8080],
} as const;

const providerSettings: {
  auth: Readonly<firebase.auth.AuthSettings>;
  firestore: Readonly<firebase.firestore.Settings>;
} = {
  auth: {
    appVerificationDisabledForTesting: true,
  },
  firestore: {
    experimentalAutoDetectLongPolling: true,
    merge: true,
  },
};

/**
 *
 * @param firebaseAppName Leave blank for default
 * @returns
 */
export async function setup(firebaseAppName?: string) {
  let firebaseApp: FirebaseApp;
  let angularFireAuth: AngularFireAuth;
  let angularFirestore: AngularFirestore;

  TestBed.configureTestingModule({
    imports: [
      AngularFireModule.initializeApp(COMMON_CONFIG, firebaseAppName),
      AngularFirestoreModule,
      AngularFireAuthModule,
    ],
    providers: [
      {
        provide: FIRESTORE_SETTINGS,
        useValue: providerSettings.firestore,
      },
      {
        provide: USE_FIRESTORE_EMULATOR,
        useValue: emulators.firestore,
      },
      {
        provide: AUTH_SETTINGS,
        useValue: providerSettings.auth,
      },
      {
        provide: USE_AUTH_EMULATOR,
        useValue: emulators.auth,
      },
    ],
    teardown: { destroyAfterEach: false },
  });

  firebaseApp = TestBed.inject(FirebaseApp);
  angularFireAuth = TestBed.inject(AngularFireAuth);
  angularFirestore = TestBed.inject(AngularFirestore);

  return { firebaseApp, angularFireAuth, angularFirestore };
}
