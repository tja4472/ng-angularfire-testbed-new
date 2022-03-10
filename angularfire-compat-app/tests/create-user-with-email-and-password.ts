import { FirebaseError } from '@firebase/util';

import { MapFirebaseError } from './wrap-firebase-promise';

import * as UnknownErrors from './unknown-errors';

export enum FirebaseErrorCode {
  EmailAlreadyInUse = 'auth/email-already-in-use',
  InvalidEmail = 'auth/invalid-email',
  OperationNotAllowed = 'auth/operation-not-allowed',
  WeakPassword = 'auth/weak-password',
}

enum Kind {
  EmailAlreadyInUseError = 'auth/email-already-in-use',
  InvalidEmailError = 'auth/invalid-email',
  OperationNotAllowedError = 'auth/operation-not-allowed',
  WeakPasswordError = 'auth/weak-password',
}

//#region EmailAlreadyInUseError
export type EmailAlreadyInUseError = {
  kind: Kind.EmailAlreadyInUseError;
};

export const createEmailAlreadyInUseError = (): EmailAlreadyInUseError => ({
  kind: Kind.EmailAlreadyInUseError,
});
//#endregion

//#region InvalidEmailError
export type InvalidEmailError = {
  kind: Kind.InvalidEmailError;
};

export const createInvalidEmailError = (): InvalidEmailError => ({
  kind: Kind.InvalidEmailError,
});
//#endregion

//#region OperationNotAllowedError
export type OperationNotAllowedError = {
  kind: Kind.OperationNotAllowedError;
};

export const createOperationNotAllowedError = (): OperationNotAllowedError => ({
  kind: Kind.OperationNotAllowedError,
});
//#endregion

//#region WeakPasswordError
export type WeakPasswordError = {
  kind: Kind.WeakPasswordError;
};

export const createWeakPasswordError = (): WeakPasswordError => ({
  kind: Kind.WeakPasswordError,
});
//#endregion

export type All =
  | EmailAlreadyInUseError
  | InvalidEmailError
  | OperationNotAllowedError
  | WeakPasswordError;

export const mapFirebaseError: MapFirebaseError<
  All | UnknownErrors.UnknownFirebaseError
> = (firebaseError: FirebaseError) => {
  if (firebaseError.code === FirebaseErrorCode.EmailAlreadyInUse) {
    return createEmailAlreadyInUseError();
  }

  if (firebaseError.code === FirebaseErrorCode.InvalidEmail) {
    return createInvalidEmailError();
  }

  if (firebaseError.code === FirebaseErrorCode.OperationNotAllowed) {
    return createOperationNotAllowedError();
  }

  if (firebaseError.code === FirebaseErrorCode.WeakPassword) {
    return createWeakPasswordError();
  }

  return UnknownErrors.createUnknownFirebaseError(firebaseError);
};
