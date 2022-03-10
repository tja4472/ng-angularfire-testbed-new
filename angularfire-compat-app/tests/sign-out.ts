import { FirebaseError } from '@firebase/util';

import { MapFirebaseError } from './wrap-firebase-promise';

import {
  createUnknownFirebaseError,
  UnknownFirebaseError,
} from './unknown-errors';

export const mapFirebaseError: MapFirebaseError<UnknownFirebaseError> = (
  firebaseError: FirebaseError
) => {
  /*
  if (firebaseError.code === FirebaseErrorCode.InvalidEmail) {
    return createInvalidEmailError();
  }
*/

  return createUnknownFirebaseError(firebaseError);
};
