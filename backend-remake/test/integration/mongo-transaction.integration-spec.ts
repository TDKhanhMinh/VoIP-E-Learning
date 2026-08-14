import mongoose, { type Connection } from 'mongoose';
import { assertTestDatabaseUri } from '../support/mongo-test-database';

describe('Mongo transaction topology (integration)', () => {
  let connection: Connection;

  beforeAll(async () => {
    assertTestDatabaseUri(process.env.MONGO_URI);
    connection = await mongoose
      .createConnection(process.env.MONGO_URI!, {
        serverSelectionTimeoutMS: 5_000,
      })
      .asPromise();
  });
  beforeEach(async () => connection.db?.dropDatabase());
  afterAll(async () => connection.close());

  it('runs a majority-write transaction on a replica set', async () => {
    const database = connection.db!;
    const hello = await database.admin().command({ hello: 1 });
    expect(hello.setName).toBe('rs0');
    expect(hello.logicalSessionTimeoutMinutes).toEqual(expect.any(Number));

    const session = await connection.startSession();
    try {
      await session.withTransaction(
        async () => {
          await database
            .collection('transaction_probe')
            .insertOne({ marker: 'committed' }, { session });
        },
        { writeConcern: { w: 'majority' } },
      );
    } finally {
      await session.endSession();
    }
    await expect(
      database.collection('transaction_probe').countDocuments(),
    ).resolves.toBe(1);
  });
});
