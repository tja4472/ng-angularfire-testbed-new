import { FirebaseError } from '@firebase/util';

enum Kind {
  UNKNOWN_ERROR = 'unknown-error',
  UNKNOWN_CAUGHT_ERROR = 'unknown-caught-error',
  UNKNOWN_FIREBASE_ERROR = 'unknown-firebase-error',
}

export type UnknownError = {
  kind: Kind.UNKNOWN_ERROR;
  error: any;
};

export type UnknownCaughtError = {
  kind: Kind.UNKNOWN_CAUGHT_ERROR;
  error: Error;
};

export type UnknownFirebaseError = {
  kind: Kind.UNKNOWN_FIREBASE_ERROR;
  error: FirebaseError;
};

export const unknownError = (error: any): UnknownError => ({
  kind: Kind.UNKNOWN_ERROR,
  error,
});

export const unknownCaughtError = (error: Error): UnknownCaughtError => ({
  kind: Kind.UNKNOWN_CAUGHT_ERROR,
  error,
});

export const createUnknownFirebaseError = (
  error: FirebaseError
): UnknownFirebaseError => ({
  kind: Kind.UNKNOWN_FIREBASE_ERROR,
  error,
});
