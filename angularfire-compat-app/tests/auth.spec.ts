/**
 * @jest-environment node
 *
 * @group emulator-required
 */
import { clearDatabase, clearUserAccounts } from '#libs/emulator';

import { setup } from './setup';

import { FirebaseError } from '@firebase/util';

jest.retryTimes(3);

describe('Auth - createUserWithEmailAndPassword', () => {
  beforeEach(async () => {
    await clearUserAccounts('demo-1');
    return clearDatabase('demo-1');
  });

  it('should succeed', async () => {
    const { angularFireAuth } = await setup();
    angularFireAuth.createUserWithEmailAndPassword;

    const userCredential = await angularFireAuth.createUserWithEmailAndPassword(
      'a.a@a.com',
      'password'
    );

    expect(userCredential).toBeDefined();
    expect(userCredential.user).toBeTruthy();

    const user = userCredential.user;

    if (user !== null) {
      expect(user.displayName).toBeNull();
      expect(user.email).toEqual('a.a@a.com');
      expect(user.uid).toBeTruthy();
    }
  });

  it('should fail with (auth/invalid-email)', async () => {
    const { angularFireAuth } = await setup();
    angularFireAuth.createUserWithEmailAndPassword;
    try {
      await angularFireAuth.createUserWithEmailAndPassword('aaa', 'bbbb');
    } catch (e) {
      expect(e).toBeInstanceOf(FirebaseError);

      if (e instanceof FirebaseError) {
        expect(e.name).toEqual('FirebaseError');
        expect(e.code).toEqual('auth/invalid-email');
        expect(e.message).toEqual(
          'Firebase: The email address is badly formatted. (auth/invalid-email).'
        );
      }
    }
  });
});
