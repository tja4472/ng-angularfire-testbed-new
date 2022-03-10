import { ok, err } from 'neverthrow';

describe('neverthrow ok err', () => {
  it('err', () => {
    const example = err({ a: 's', b: 'd' });

    if (example.isErr()) {
      expect(example.error).toEqual({ a: 's', b: 'd' });
    } else {
      // example.value
    }

    if (example.isOk()) {
      // example.value
    } else {
      expect(example.error).toEqual({ a: 's', b: 'd' });
    }
  });

  it('ok', () => {
    const example = ok({ a: 's', b: 'd' });

    if (example.isErr()) {
      // example.error
    } else {
      expect(example.value).toEqual({ a: 's', b: 'd' });
    }

    if (example.isOk()) {
      expect(example.value).toEqual({ a: 's', b: 'd' });
    } else {
      // example.error
    }
  });
});
