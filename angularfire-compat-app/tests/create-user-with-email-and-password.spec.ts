import * as CreateUser from './create-user-with-email-and-password';
import * as UnknownErrors from './unknown-errors';

import { FirebaseError } from '@firebase/util';

describe('createUserWithEmailAndPassword', () => {
  describe('mapFirebaseError', () => {
    it('should return EmailAlreadyInUseError', () => {
      const errorCode = CreateUser.FirebaseErrorCode.EmailAlreadyInUse;
      const expected = CreateUser.createEmailAlreadyInUseError();

      const result = CreateUser.mapFirebaseError(
        new FirebaseError(errorCode, 'dddd')
      );

      expect(result).toEqual(expected);
    });

    it('should return InvalidEmailError', () => {
      const errorCode = CreateUser.FirebaseErrorCode.InvalidEmail;
      const expected = CreateUser.createInvalidEmailError();

      const result = CreateUser.mapFirebaseError(
        new FirebaseError(errorCode, 'dddd')
      );

      expect(result).toEqual(expected);
    });

    it('should return OperationNotAllowedError', () => {
      const errorCode = CreateUser.FirebaseErrorCode.OperationNotAllowed;
      const expected = CreateUser.createOperationNotAllowedError();

      const result = CreateUser.mapFirebaseError(
        new FirebaseError(errorCode, 'dddd')
      );

      expect(result).toEqual(expected);
    });

    it('should return WeakPasswordError', () => {
      const errorCode = CreateUser.FirebaseErrorCode.WeakPassword;
      const expected = CreateUser.createWeakPasswordError();

      const result = CreateUser.mapFirebaseError(
        new FirebaseError(errorCode, 'dddd')
      );

      expect(result).toEqual(expected);
    });

    it('should return unknownFirebaseError', () => {
      const errorCode = 'dummy-error-code';
      const expected = UnknownErrors.createUnknownFirebaseError(
        new FirebaseError(errorCode, 'dummy-message')
      );

      const result = CreateUser.mapFirebaseError(
        new FirebaseError(errorCode, 'dummy-message')
      );

      expect(result).toEqual(expected);
    });
  });
});
