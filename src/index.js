const { deterministicPartitionKey } = require('./dpk');

console.log(deterministicPartitionKey());
console.log(deterministicPartitionKey({}));
console.log(deterministicPartitionKey({ partitionKey: 'my-key' }));
console.log(deterministicPartitionKey({ foo: 'bar' }));
console.log(deterministicPartitionKey('string'));
console.log(deterministicPartitionKey('string'));
console.log(deterministicPartitionKey(1));
console.log(deterministicPartitionKey(1));
console.log(
  deterministicPartitionKey({
    partitionKey: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut tellus euismod, malesuada eros ac, bibendum nunc. Nullam sodales nulla augue, a congue ante congue eu. Pellentesque ut massa eget libero bibendum fermentum quis a nisl.`,
  }),
);
console.log(
  deterministicPartitionKey({
    partitionKey: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut tellus euismod, malesuada eros ac, bibendum nunc. Nullam sodales nulla augue, a congue ante congue eu. Pellentesque ut massa eget libero bibendum fermentum quis a nisl. Vestibulum rhoncus.`,
  }),
);
