import { FirebaseError } from '@firebase/util';
import {
  EmailAlreadyInUseError,
  createEmailAlreadyInUseError,
  FirebaseErrorCode,
} from './create-user-with-email-and-password';
import * as UnknownErrors from './unknown-errors';
import { MapFirebaseError, wrapFirebasePromise } from './wrap-firebase-promise';

const mapFirebaseError: MapFirebaseError<
  EmailAlreadyInUseError | UnknownErrors.UnknownFirebaseError
> = (firebaseError: FirebaseError) => {
  if (firebaseError.code === FirebaseErrorCode.EmailAlreadyInUse) {
    return createEmailAlreadyInUseError();
  }

  return UnknownErrors.createUnknownFirebaseError(firebaseError);
};

describe('wrapFirebasePromise', () => {
  it('should return a reolved promise', async () => {
    const expected = 'resolved-promise';

    const result = await wrapFirebasePromise(
      'ssss',
      Promise.resolve('resolved-promise'),
      mapFirebaseError
    );

    expect(result.isOk()).toEqual(true);

    if (result.isOk()) {
      expect(result.value).toEqual(expected);
    }
  });

  it('should return a Firebase error', async () => {
    const errorCode = FirebaseErrorCode.EmailAlreadyInUse;
    const expected = createEmailAlreadyInUseError();

    const result = await wrapFirebasePromise(
      'ssss',
      Promise.reject(new FirebaseError(errorCode, 'dddd')),
      mapFirebaseError
    );

    expect(result.isErr()).toEqual(true);

    if (result.isErr()) {
      expect(result.error).toEqual(expected);
    }
  });

  describe('Unknown Errors', () => {
    it('should return UnknownError', async () => {
      const expected = UnknownErrors.unknownError('wrapFirebasePromise:ssss');

      const result = await wrapFirebasePromise(
        'ssss',
        Promise.reject('fff'),
        mapFirebaseError
      );

      expect(result.isErr()).toEqual(true);

      if (result.isErr()) {
        expect(result.error).toEqual(expected);
      }
    });

    it('should return UnknownCaughtError', async () => {
      const expected = UnknownErrors.unknownCaughtError(new Error('fred'));

      const result = await wrapFirebasePromise(
        'ssss',
        Promise.reject(new Error('fred')),
        mapFirebaseError
      );

      expect(result.isErr()).toEqual(true);

      if (result.isErr()) {
        expect(result.error).toEqual(expected);
      }
    });

    it('should return UnknownFirebaseError', async () => {
      const expected = UnknownErrors.createUnknownFirebaseError(
        new FirebaseError('fred', 'dddd')
      );

      const result = await wrapFirebasePromise(
        'ssss',
        Promise.reject(new FirebaseError('fred', 'dddd')),
        mapFirebaseError
      );

      expect(result.isErr()).toEqual(true);

      if (result.isErr()) {
        expect(result.error).toEqual(expected);
      }
    });
  });
});
