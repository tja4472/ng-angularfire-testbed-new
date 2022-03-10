import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';

// firebase.auth.UserCredential
import firebase from 'firebase/compat/app';

import { ResultAsync } from 'neverthrow';

import * as CreateUser from './create-user-with-email-and-password';
import * as SignIn from './sign-in-with-email-and-password';
import * as SignOut from './sign-out';
import * as UnknownErrors from './unknown-errors';
import { wrapFirebasePromise } from './wrap-firebase-promise';

export type AuthError = {
  name: string;
  code: string;
  message: string;
};

export interface User {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private readonly angularFireAuth: AngularFireAuth) {}

  /**
   *
   * @see https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword
   *
   */
  public createUserWithEmailAndPassword(
    email: string,
    password: string
  ): ResultAsync<
    User,
    | CreateUser.All
    | UnknownErrors.UnknownCaughtError
    | UnknownErrors.UnknownError
    | UnknownErrors.UnknownFirebaseError
  > {
    return wrapFirebasePromise(
      'createUserWithEmailAndPassword',
      this.angularFireAuth.createUserWithEmailAndPassword(email, password),
      CreateUser.mapFirebaseError
    ).map((userCredential) => {
      if (userCredential.user === null) {
        throw UnknownErrors.unknownError('userCredential.user is null');
      }

      if (userCredential.user.email === null) {
        throw UnknownErrors.unknownError('user.email is null');
      }

      const result: User = {
        name: userCredential.user.email,
      };

      return result;
    });
  }

  /**
   *
   * @see https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithemailandpassword
   *
   */
  public signInWithEmailAndPassword(
    email: string,
    password: string
  ): ResultAsync<
    User,
    | SignIn.All
    | UnknownErrors.UnknownCaughtError
    | UnknownErrors.UnknownError
    | UnknownErrors.UnknownFirebaseError
  > {
    return wrapFirebasePromise(
      'signInWithEmailAndPassword',
      this.angularFireAuth.signInWithEmailAndPassword(email, password),
      SignIn.mapFirebaseError
    ).map((userCredential) => {
      if (userCredential.user === null) {
        throw UnknownErrors.unknownError('userCredential.user is null');
      }

      if (userCredential.user.email === null) {
        throw UnknownErrors.unknownError('user.email is null');
      }

      const result: User = {
        name: userCredential.user.email,
      };

      return result;
    });
  }

  /**
   *
   * @see https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signout
   *
   */
  public signOut(): ResultAsync<
    void,
    | UnknownErrors.UnknownCaughtError
    | UnknownErrors.UnknownError
    | UnknownErrors.UnknownFirebaseError
  > {
    return wrapFirebasePromise(
      'signOut',
      this.angularFireAuth.signOut(),
      SignOut.mapFirebaseError
    );
  }
}
