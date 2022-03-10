import { FirebaseError } from '@firebase/util';

import { ResultAsync } from 'neverthrow';

import * as UnknownErrors from './unknown-errors';

export type MapFirebaseError<E> = { (firebaseError: FirebaseError): E };

export const wrapFirebasePromise = <T, E>(
  descriptor: string,
  firebasePromise: Promise<T>,
  mapFirebaseError: MapFirebaseError<E>
): ResultAsync<
  T,
  E | UnknownErrors.UnknownCaughtError | UnknownErrors.UnknownError
> =>
  ResultAsync.fromPromise(firebasePromise, (error) => {
    if (error instanceof FirebaseError) {
      return mapFirebaseError(error);
    }
    if (error instanceof Error) {
      return UnknownErrors.unknownCaughtError(error);
    }

    return UnknownErrors.unknownError(`wrapFirebasePromise:${descriptor}`);
  });
