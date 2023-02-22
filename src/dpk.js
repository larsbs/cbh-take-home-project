const crypto = require('crypto');

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = '0';
  const MAX_PARTITION_KEY_LENGTH = 256;

  // Hit returns early
  if (event == null) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (event.partitionKey == null) {
    // We don't need to check for size here since this will always return an appropiately sized
    // partition key.
    return crypto.createHash('sha3-512').update(JSON.stringify(event)).digest('hex');
  }

  // Normalize partition key
  const partitionKey =
    typeof event.partitionKey !== 'string'
      ? JSON.stringify(event.partitionKey)
      : event.partitionKey;

  // If partitionKey is too long, hash it. Otherwise, just return it
  return partitionKey.length > MAX_PARTITION_KEY_LENGTH
    ? crypto.createHash('sha3-512').update(partitionKey).digest('hex')
    : partitionKey;
};
