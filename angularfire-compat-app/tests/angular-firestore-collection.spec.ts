/**
 * @jest-environment node
 *
 * @group emulator-required
 */
import { clearDatabase } from '#libs/emulator';
import { FAKE_STOCK_DATA, randomName, Stock } from '#libs/test-utils';

import { firstValueFrom } from 'rxjs';

import { setup } from './setup';

jest.retryTimes(3);

describe('angularFirestore collection', () => {
  beforeEach(async () => {
    // await clearUserAccounts('demo-1');
    return clearDatabase('demo-1');
  });

  it('should set and get data', async () => {
    const PATH = 'path-a';
    const { angularFirestore } = await setup(randomName());
    const stocks = angularFirestore.collection<Stock>('Collection-b');
    await stocks.doc(PATH).set(FAKE_STOCK_DATA);
    const documentSnapshot = await firstValueFrom(stocks.doc(PATH).get());

    try {
      expect(documentSnapshot.data()).toEqual(FAKE_STOCK_DATA);
    } finally {
      angularFirestore.firestore.terminate();
    }
  });

  it('should create collection if missing', async () => {
    //
  });

  it('valueChanges without idField', (done) => {
    (async () => {
      const { angularFirestore } = await setup(randomName());
      const stocks = angularFirestore.collection<Stock>('Collection-b');

      await stocks.doc('path-a').set(FAKE_STOCK_DATA);

      const sub = stocks.valueChanges().subscribe((data) => {
        sub.unsubscribe();
        try {
          expect(data.length).toEqual(1);
          expect(data).toEqual([FAKE_STOCK_DATA]);
          done();
        } catch (error) {
          done(error);
        } finally {
          angularFirestore.firestore.terminate();
        }
      });
    })();
  });

  it('valueChanges with idField', (done) => {
    (async function () {
      const { angularFirestore } = await setup(randomName());
      const stocks = angularFirestore.collection<Stock>('Collection-b');

      await stocks.doc('path-a').set(FAKE_STOCK_DATA);

      const EXPECTED_DATA: Stock & { customID: string } = {
        customID: 'path-a',
        name: 'FAKE',
        price: 1,
      };

      const sub = stocks
        .valueChanges({ idField: 'customID' })
        .subscribe((data) => {
          sub.unsubscribe();
          try {
            expect(data.length).toEqual(1);
            expect(data).toEqual([EXPECTED_DATA]);
            done();
          } catch (error) {
            done(error);
          } finally {
            angularFirestore.firestore.terminate();
          }
        });
    })();
  });
});
