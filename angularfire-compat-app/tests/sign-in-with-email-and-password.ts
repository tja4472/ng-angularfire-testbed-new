import { FirebaseError } from '@firebase/util';

import { MapFirebaseError } from './wrap-firebase-promise';

import * as UnknownErrors from './unknown-errors';

export enum FirebaseErrorCode {
  InvalidEmail = 'auth/invalid-email',
  UserDisabled = 'auth/user-disabled',
  UserNotFound = 'auth/user-not-found',
  WrongPassword = 'auth/wrong-password',
}

enum Kind {
  InvalidEmailError = 'auth/invalid-email',
  UserDisabledError = 'auth/user-disabled',
  UserNotFoundError = 'auth/user-not-found',
  WrongPasswordError = 'auth/wrong-password',
}

//#region InvalidEmailError
export type InvalidEmailError = {
  kind: Kind.InvalidEmailError;
};

export const createInvalidEmailError = (): InvalidEmailError => ({
  kind: Kind.InvalidEmailError,
});
//#endregion

//#region UserDisabledError
export type UserDisabledError = {
  kind: Kind.UserDisabledError;
};

export const createUserDisabledError = (): UserDisabledError => ({
  kind: Kind.UserDisabledError,
});
//#endregion

//#region UserNotFoundError
export type UserNotFoundError = {
  kind: Kind.UserNotFoundError;
};

export const createUserNotFoundError = (): UserNotFoundError => ({
  kind: Kind.UserNotFoundError,
});
//#endregion

//#region WrongPasswordError
export type WrongPasswordError = {
  kind: Kind.WrongPasswordError;
};

export const createWrongPasswordError = (): WrongPasswordError => ({
  kind: Kind.WrongPasswordError,
});
//#endregion

export type All =
  | InvalidEmailError
  | UserDisabledError
  | UserNotFoundError
  | WrongPasswordError;

export const mapFirebaseError: MapFirebaseError<
  All | UnknownErrors.UnknownFirebaseError
> = (firebaseError: FirebaseError) => {
  if (firebaseError.code === FirebaseErrorCode.InvalidEmail) {
    return createInvalidEmailError();
  }

  if (firebaseError.code === FirebaseErrorCode.UserDisabled) {
    return createUserDisabledError();
  }

  if (firebaseError.code === FirebaseErrorCode.UserNotFound) {
    return createUserNotFoundError();
  }

  if (firebaseError.code === FirebaseErrorCode.WrongPassword) {
    return createWrongPasswordError();
  }

  return UnknownErrors.createUnknownFirebaseError(firebaseError);
};
