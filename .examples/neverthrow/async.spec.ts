import { ok, err, ResultAsync, Result, combine } from 'neverthrow';

interface User {
  name: string;
}

/**
 *
 * A function to test returning a Promise.
 *
 * @param userId
 * @returns a User if userId is 1.
 *
 * @throws error-type-1
 * Thrown if userId is 2.
 *
 * @throws error-type-2
 * Thrown if userId is 3.
 *
 * @throws error-type-4
 * Thrown if userId is 4.
 */
function promiseFunction(userId: number): Promise<User> {
  return new Promise<User>((resolve, reject) => {
    switch (userId) {
      case 1:
        return resolve({ name: 'Mark' });
      case 2:
        return reject(new Error('error-type-1'));
      case 3:
        return reject(new Error('error-type-2'));
      case 4:
        return reject(new Error('error-type-4'));
    }
  });
}

enum ErrorKinds {
  ERROR_1,
  ERROR_2,
  ERROR_UNKNOWN,
}

type Error1 = {
  kind: ErrorKinds.ERROR_1;
  code1: string;
  message1: string;
};

type Error2 = {
  kind: ErrorKinds.ERROR_2;
  code2: string;
  message2: string;
};

type ErrorUnknown = {
  kind: ErrorKinds.ERROR_UNKNOWN;
  code2: string;
  message2: string;
};

/**
 * Errors returned by resultAsyncFunction.
 */
type Errors = Error1 | Error2 | ErrorUnknown;

type DbResult<T> = ResultAsync<T, Errors>;

namespace Errors {
  export const error1 = (code: string, message: string): Error1 => ({
    kind: ErrorKinds.ERROR_1,
    code1: code,
    message1: message,
  });

  export const error2 = (code: string, message: string): Error2 => ({
    kind: ErrorKinds.ERROR_2,
    code2: code,
    message2: message,
  });

  export const unknown = (code: string, message: string): ErrorUnknown => ({
    kind: ErrorKinds.ERROR_UNKNOWN,
    code2: code,
    message2: message,
  });
}

const mapPromiseErrorToErrors = (err: Error): Errors => {
  if (err.message === 'error-type-1') {
    return Errors.error1('type-1', 'type-1 message');
  }

  if (err.message === 'error-type-2') {
    return Errors.error2('type-2', 'type-2 message');
  }

  return Errors.unknown(
    'unknown',
    'AAAAA-Something went wrong. Please try again!'
  );
};

/**
 *
 * neverthrow wrapper around the promiseFunction.
 * Translates the thrown errors from the promiseFunction
 * to those used by the resultAsyncFunction.
 *
 * @param userId
 * @returns
 */
function resultAsyncFunction(userId: number): DbResult<User> {
  return ResultAsync.fromPromise(promiseFunction(userId), (error) => {
    if (error instanceof Error) {
      return mapPromiseErrorToErrors(error);
    } else {
      const result: ErrorUnknown = {
        kind: ErrorKinds.ERROR_UNKNOWN,
        code2: 'unknown',
        message2: 'BBBBB-Something went wrong. Please try again!',
      };
      return result;
    }
  });
}

/**
 *
 * Function to test the resultAsyncFunction.
 *
 * @param userId
 * @returns
 */
async function testResultAsyncFunctionErrors(userId: number) {
  const result = await resultAsyncFunction(userId);

  if (result.isOk()) {
    const expected: User = { name: 'Mark' };
    expect(result.value).toEqual(expected);
  }

  if (result.isErr()) {
    switch (result.error.kind) {
      case ErrorKinds.ERROR_1: {
        const error = result.error;
        const expected: Error1 = {
          kind: ErrorKinds.ERROR_1,
          code1: 'type-1',
          message1: 'type-1 message',
        };
        expect(error).toEqual(expected);
        break;
      }

      case ErrorKinds.ERROR_2: {
        const error = result.error;
        const expected: Error2 = {
          kind: ErrorKinds.ERROR_2,
          code2: 'type-2',
          message2: 'type-2 message',
        };
        expect(error).toEqual(expected);
        break;
      }

      case ErrorKinds.ERROR_UNKNOWN: {
        const error = result.error;
        const expected: ErrorUnknown = {
          kind: ErrorKinds.ERROR_UNKNOWN,
          code2: 'unknown',
          message2: 'AAAAA-Something went wrong. Please try again!',
        };
        expect(error).toEqual(expected);
        break;
      }

      default: {
        const _exhaustiveCheck: never = result.error;
        return _exhaustiveCheck;
      }
    }
  }

  return null;
}

describe('new async testing', () => {
  it('works with async/await', async () => {
    expect.assertions(1);
    const result = await ResultAsync.fromPromise(
      promiseFunction(1),
      (error) => error
    );

    if (result.isOk()) {
      expect(result.value).toEqual({ name: 'Mark' });
    }
  });

  it('works with then', async () => {
    expect.assertions(1);
    return ResultAsync.fromPromise(promiseFunction(1), (error) => error).then(
      (result) => {
        if (result.isOk()) {
          expect(result.value).toEqual({ name: 'Mark' });
        }
      }
    );
  });

  it('tests error-type-1 with async/await', async () => {
    expect.assertions(1);
    const result = await ResultAsync.fromPromise(
      promiseFunction(2),
      (error: any) => error
    );

    if (result.isErr()) {
      expect(result.error.message).toEqual('error-type-1');
    }
  });

  it('tests error-type-2 with async/await', async () => {
    expect.assertions(1);
    const result = await ResultAsync.fromPromise(
      promiseFunction(3),
      (error: any) => error
    );

    if (result.isErr()) {
      expect(result.error.message).toEqual('error-type-2');
    }
  });

  it('xxxx tests error-type-2 with async/await', async () => {
    expect.assertions(1);
    const result = await ResultAsync.fromPromise(
      promiseFunction(3),
      (error: any) => {
        const message = error.message;
        switch (message) {
          case 'error-type-1':
            return {
              code: 'type-1',
              message: 'type-1 message',
            };

          case 'error-type-2':
            return {
              code: 'type-2',
              message: 'type-2 message',
            };

          default:
            return {
              code: 'unknown',
              message: 'Something went wrong. Please try again!',
            };
        }
      }
    );

    if (result.isErr()) {
      expect(result.error).toEqual({
        code: 'type-2',
        message: 'type-2 message',
      });
    }
  });

  it('xxxx 3', async () => {
    // success
    await testResultAsyncFunctionErrors(1);
    // errors
    await testResultAsyncFunctionErrors(2);
    await testResultAsyncFunctionErrors(3);
    await testResultAsyncFunctionErrors(4);
  });

  /*
    it('xxxx tests resultAsyncFunction with async/await', async () => {
    expect.assertions(1);
    const result = await resultAsyncFunction(3);

    if (result.isErr()) {
      switch (result.error.type) {
        case 'ErrorType1': {
          const error = result.error;
          const expected: ErrorType1 = {
            type: 'ErrorType1',
            code1: 'type-2',
            message1: 'type-2 message',
          };
          expect(error).toEqual(expected);
          break;
        }

        case 'ErrorType2': {
          const error = result.error;
          expect(error).toEqual({
            type: 'ErrorType2',
            code2: 'type-2',
            message2: 'type-2 message',
          });
          break;
        }

        case 'ErrorUnknown': {
          const error = result.error;
          const expected: ErrorUnknown = {
            type: 'ErrorUnknown',
            code2: 'type-2',
            message2: 'type-2 message',
          };
          expect(error).toEqual(expected);
          break;
        }

        default: {
          const _exhaustiveCheck: never = result.error;
          return _exhaustiveCheck;
        }
      }
    }

    return null;
  });
  */
});
