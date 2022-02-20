/**
 * @jest-environment node
 *
 * @group emulator-required
 */
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { setup } from './setup';

describe('AngularFirestore', () => {
  it('default setup', async () => {
    const { angularFireAuth, angularFirestore, firebaseApp } = await setup();
    expect(angularFireAuth).toBeInstanceOf(AngularFireAuth);
    expect(angularFirestore).toBeInstanceOf(AngularFirestore);
    expect(firebaseApp).toBeDefined();
    expect(firebaseApp.name).toEqual('[DEFAULT]');
  });

  it('setup with app name', async () => {
    const firebaseAppName = 'testy';
    const { angularFireAuth, angularFirestore, firebaseApp } = await setup(
      firebaseAppName
    );
    expect(angularFireAuth).toBeInstanceOf(AngularFireAuth);
    expect(angularFirestore).toBeInstanceOf(AngularFirestore);
    expect(firebaseApp).toBeDefined();
    expect(firebaseApp.name).toEqual(firebaseAppName);
  });
});
