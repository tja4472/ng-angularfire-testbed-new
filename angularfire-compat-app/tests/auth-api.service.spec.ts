/**
 * @jest-environment node
 *
 * @group emulator-required
 */
import { TestBed } from '@angular/core/testing';

import { clearDatabase, clearUserAccounts } from '#libs/emulator';
import { AuthApiService, User } from './auth-api.service';

import { setup } from './setup';
// import { FirebaseError } from '@angular/fire/app/firebase';
import firebase from 'firebase/compat/app';

import { FirebaseError } from '@firebase/util';

import {
  FirebaseErrorCode,
  createInvalidEmailError,
  createOperationNotAllowedError,
  createWeakPasswordError,
} from './create-user-with-email-and-password';
import * as CreateUser from './create-user-with-email-and-password';
import * as UnknownErrors from './unknown-errors';
import { AngularFireAuth } from '@angular/fire/compat/auth';

jest.retryTimes(3);

describe('AuthApiService', () => {
  beforeEach(async () => {
    await clearUserAccounts('demo-1');
    return clearDatabase('demo-1');
  });

  it('should be created', async () => {
    let service: AuthApiService;
    await setup();
    service = TestBed.inject(AuthApiService);
    expect(service).toBeTruthy();
  });

  describe('createUserWithEmailAndPassword', () => {
    it('should create user', async () => {
      let service: AuthApiService;
      await setup();
      service = TestBed.inject(AuthApiService);

      const user = {
        email: 'a.a@a.com',
        password: 'password',
      };

      const expected: User = {
        name: user.email,
      };

      const result = await service.createUserWithEmailAndPassword(
        user.email,
        user.password
      );

      expect(result.isOk()).toEqual(true);

      if (result.isOk()) {
        expect(result.value).toEqual(expected);
      }
    });
    describe('Unknown Errors', () => {
      it('should return UnknownError', async () => {
        let service: AuthApiService;
        const { angularFireAuth } = await setup();
        service = TestBed.inject(AuthApiService);

        jest
          .spyOn(angularFireAuth, 'createUserWithEmailAndPassword')
          .mockRejectedValue('aaaa');

        const user = {
          email: 'a.a@a.com',
          password: 'password',
        };

        const expected = UnknownErrors.unknownError(
          'wrapFirebasePromise:createUserWithEmailAndPassword'
        );

        const result = await service.createUserWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });

      it('should return UnknownCaughtError', async () => {
        let service: AuthApiService;
        const { angularFireAuth } = await setup();
        service = TestBed.inject(AuthApiService);

        jest
          .spyOn(angularFireAuth, 'createUserWithEmailAndPassword')
          .mockRejectedValue(new Error('error-message'));

        const user = {
          email: 'a.a@a.com',
          password: 'password',
        };

        const expected = UnknownErrors.unknownCaughtError(
          new Error('error-message')
        );

        const result = await service.createUserWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });

      it('should return UnknownFirebaseError', async () => {
        let service: AuthApiService;
        const { angularFireAuth } = await setup();
        service = TestBed.inject(AuthApiService);

        jest
          .spyOn(angularFireAuth, 'createUserWithEmailAndPassword')
          .mockRejectedValue(new FirebaseError('dummy-firebase-code', '????'));

        const user = {
          email: 'a.a@a.com',
          password: 'password',
        };

        const expected = UnknownErrors.createUnknownFirebaseError(
          new FirebaseError('dummy-firebase-code', '????')
        );

        const result = await service.createUserWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });
    });

    describe('Other Errors', () => {
      it('should return EmailAlreadyInUse error', async () => {
        let service: AuthApiService;
        await setup();
        service = TestBed.inject(AuthApiService);

        const user = {
          email: 'a.a@a.com',
          password: 'password',
        };

        const expected = CreateUser.createEmailAlreadyInUseError();

        const createResult = await service.createUserWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(createResult.isOk()).toEqual(true);

        const signOutResult = await service.signOut();

        expect(signOutResult.isOk()).toEqual(true);

        const result = await service.createUserWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });

      it('should return InvalidEmail error', async () => {
        let service: AuthApiService;
        await setup();
        service = TestBed.inject(AuthApiService);

        const user = {
          email: 'a',
          password: 'password',
        };

        const expected = createInvalidEmailError();

        const result = await service.createUserWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });

      it('should return OperationNotAllowed error', async () => {
        let service: AuthApiService;
        const { angularFireAuth } = await setup();
        service = TestBed.inject(AuthApiService);

        jest
          .spyOn(angularFireAuth, 'createUserWithEmailAndPassword')
          .mockRejectedValue(
            new FirebaseError(FirebaseErrorCode.OperationNotAllowed, '????')
          );

        const user = {
          email: 'a.a@a.com',
          password: 'password',
        };

        const expected = createOperationNotAllowedError();

        const result = await service.createUserWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });

      it('should return WeakPassword error', async () => {
        let service: AuthApiService;
        await setup();
        service = TestBed.inject(AuthApiService);

        const user = {
          email: 'a.a@a.com',
          password: 'a',
        };

        const expected = createWeakPasswordError();

        const result = await service.createUserWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });
    });
  });

  describe('signInWithEmailAndPassword', () => {
    const user = {
      email: 'a.a@a.com',
      password: 'password',
    };

    let angularFireAuth: AngularFireAuth;
    let service: AuthApiService;

    beforeEach(async () => {
      const { angularFireAuth: a } = await setup();
      angularFireAuth = a;
      service = TestBed.inject(AuthApiService);

      const createResult = await service.createUserWithEmailAndPassword(
        user.email,
        user.password
      );

      expect(createResult.isOk()).toEqual(true);

      const signOutResult = await service.signOut();

      expect(signOutResult.isOk()).toEqual(true);
    });

    it('should signIn user', async () => {
      const expected: User = {
        name: user.email,
      };

      const signInResult = await service.signInWithEmailAndPassword(
        user.email,
        user.password
      );

      if (signInResult.isOk()) {
        expect(signInResult.value).toEqual(expected);
      }
    });

    describe('Unknown Errors', () => {
      it('should return UnknownError', async () => {
        jest
          .spyOn(angularFireAuth, 'signInWithEmailAndPassword')
          .mockRejectedValue('aaaa');

        const user = {
          email: 'a.a@a.com',
          password: 'password',
        };

        const expected = UnknownErrors.unknownError(
          'wrapFirebasePromise:signInWithEmailAndPassword'
        );

        const result = await service.signInWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });

      it('should return UnknownCaughtError', async () => {
        jest
          .spyOn(angularFireAuth, 'signInWithEmailAndPassword')
          .mockRejectedValue(new Error('error-message'));

        const user = {
          email: 'a.a@a.com',
          password: 'password',
        };

        const expected = UnknownErrors.unknownCaughtError(
          new Error('error-message')
        );

        const result = await service.signInWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });

      it('should return UnknownFirebaseError', async () => {
        jest
          .spyOn(angularFireAuth, 'signInWithEmailAndPassword')
          .mockRejectedValue(new FirebaseError('dummy-firebase-code', '????'));

        const user = {
          email: 'a.a@a.com',
          password: 'password',
        };

        const expected = UnknownErrors.createUnknownFirebaseError(
          new FirebaseError('dummy-firebase-code', '????')
        );

        const result = await service.signInWithEmailAndPassword(
          user.email,
          user.password
        );

        expect(result.isErr()).toEqual(true);

        if (result.isErr()) {
          expect(result.error).toEqual(expected);
        }
      });
    });

    describe('Other Errors', () => {
      //
    });
  });

  describe('signOut', () => {
    it('should signOut user', async () => {
      let service: AuthApiService;
      await setup();
      service = TestBed.inject(AuthApiService);

      const user = {
        email: 'a.a@a.com',
        password: 'password',
      };

      const createResult = await service.createUserWithEmailAndPassword(
        user.email,
        user.password
      );

      expect(createResult.isOk()).toEqual(true);

      const result = await service.signOut();

      expect(result.isOk()).toEqual(true);

      if (result.isOk()) {
        expect(result.value).toBeUndefined();
      }
    });
  });
});
