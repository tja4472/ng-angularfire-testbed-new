import * as SignOut from './sign-out';
import * as UnknownErrors from './unknown-errors';

import { FirebaseError } from '@firebase/util';

describe('signOut', () => {
  describe('mapFirebaseError', () => {
    it('should return UnknownFirebaseError', async () => {
      const errorCode = 'dummy-error-code';
      const expected = UnknownErrors.createUnknownFirebaseError(
        new FirebaseError(errorCode, 'dummy-message')
      );

      const result = SignOut.mapFirebaseError(
        new FirebaseError(errorCode, 'dummy-message')
      );

      expect(result).toEqual(expected);
    });
  });
});
