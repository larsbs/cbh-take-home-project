const crypto = require('crypto');
const { deterministicPartitionKey } = require('./dpk');

describe('deterministicPartitionKey', () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe('0');
  });

  describe("When no 'partitionKey' is found in the event", () => {
    it("Returns a hash of the stringified input if no 'partitionKey' is found in the event", () => {
      const hashKeyString = deterministicPartitionKey('string');
      const hashKeyInteger = deterministicPartitionKey(1);
      const hashKeyObject = deterministicPartitionKey({});

      expect(hashKeyString).toBe(
        crypto.createHash('sha3-512').update(JSON.stringify('string')).digest('hex'),
      );
      expect(hashKeyInteger).toBe(
        crypto.createHash('sha3-512').update(JSON.stringify(1)).digest('hex'),
      );
      expect(hashKeyObject).toBe(
        crypto.createHash('sha3-512').update(JSON.stringify({})).digest('hex'),
      );
    });

    it('Returns the same hash for the same input', () => {
      const hashKeyA = deterministicPartitionKey('string');
      const hashKeyB = deterministicPartitionKey('string');

      expect(hashKeyA).toBe(hashKeyB);
    });
  });

  describe("When 'partitionKey' is found in the event", () => {
    it("Returns the found 'partitionKey' stringified if it doesn't exceeds 256 characters", () => {
      const keyA = deterministicPartitionKey({ partitionKey: 'my-key' });
      const keyB = deterministicPartitionKey({ partitionKey: 1 });

      expect(keyA).toBe('my-key');
      expect(keyB).toBe('1');
    });

    it("Returns a hash of the found 'partitionKey' if 'partitionKey' exceeds 256 characters", () => {
      const shortKey = deterministicPartitionKey({
        partitionKey: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut tellus euismod, malesuada eros ac, bibendum nunc. Nullam sodales nulla augue, a congue ante congue eu. Pellentesque ut massa eget libero bibendum fermentum quis a nisl.`,
      });
      const longKey = deterministicPartitionKey({
        partitionKey: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut tellus euismod, malesuada eros ac, bibendum nunc. Nullam sodales nulla augue, a congue ante congue eu. Pellentesque ut massa eget libero bibendum fermentum quis a nisl. Vestibulum rhoncus.`,
      });

      expect(shortKey).toBe(
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut tellus euismod, malesuada eros ac, bibendum nunc. Nullam sodales nulla augue, a congue ante congue eu. Pellentesque ut massa eget libero bibendum fermentum quis a nisl.`,
      );
      expect(longKey).toBe(
        crypto
          .createHash('sha3-512')
          .update(
            `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut tellus euismod, malesuada eros ac, bibendum nunc. Nullam sodales nulla augue, a congue ante congue eu. Pellentesque ut massa eget libero bibendum fermentum quis a nisl. Vestibulum rhoncus.`,
          )
          .digest('hex'),
      );
    });
  });
});
