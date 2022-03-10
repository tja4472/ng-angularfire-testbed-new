import * as SignIn from './sign-in-with-email-and-password';
import * as UnknownErrors from './unknown-errors';

import { FirebaseError } from '@firebase/util';
import { Sign } from 'crypto';

describe('signInWithEmailAndPassword', () => {
  describe('mapFirebaseError', () => {
    it('should return InvalidEmailError', () => {
      const errorCode = SignIn.FirebaseErrorCode.InvalidEmail;
      const expected = SignIn.createInvalidEmailError();

      const result = SignIn.mapFirebaseError(
        new FirebaseError(errorCode, 'dddd')
      );

      expect(result).toEqual(expected);
    });

    it('should return UserDisabledError', () => {
      const errorCode = SignIn.FirebaseErrorCode.UserDisabled;
      const expected = SignIn.createUserDisabledError();

      const result = SignIn.mapFirebaseError(
        new FirebaseError(errorCode, 'dddd')
      );

      expect(result).toEqual(expected);
    });

    it('should return UserNotFoundError', () => {
      const errorCode = SignIn.FirebaseErrorCode.UserNotFound;
      const expected = SignIn.createUserNotFoundError();

      const result = SignIn.mapFirebaseError(
        new FirebaseError(errorCode, 'dddd')
      );

      expect(result).toEqual(expected);
    });

    it('should return WrongPasswordError', () => {
      const errorCode = SignIn.FirebaseErrorCode.WrongPassword;
      const expected = SignIn.createWrongPasswordError();

      const result = SignIn.mapFirebaseError(
        new FirebaseError(errorCode, 'dddd')
      );

      expect(result).toEqual(expected);
    });

    it('should return unknownFirebaseError', () => {
      const errorCode = 'dummy-error-code';
      const expected = UnknownErrors.createUnknownFirebaseError(
        new FirebaseError(errorCode, 'dummy-message')
      );

      const result = SignIn.mapFirebaseError(
        new FirebaseError(errorCode, 'dummy-message')
      );

      expect(result).toEqual(expected);
    });
  });
});
