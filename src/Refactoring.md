# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

The main optimization I have made to improve code legibility is by listing the early exits of the function as soon as possible. This approach makes it easier to understand what needs to be kept track of and what can be disregarded while reading the code.

For instance, we check if the event is null early on in the function so that we can avoid checking it repeatedly throughout the code.

Additionally, listing the returns early on in the function helps us to visualize the different outputs of the function, allowing us to focus on specific use cases that we are interested in. For instance, if the function returns incorrect results when the `partitionKey` is not found, we can concentrate on the if block that handles that case and ignore the rest of the code.

By clearly defining when and why the function exits, the remainder of the refactoring process becomes more straightforward.

The other part of the refactoring process involves making it clear that the type of `partitionKey` is normalized to `string` (line 19) and that it will be hashed if it exceeds a certain character limit (line 25).

The only "controversial" change I see here is that we could have normalized the `partitionKey` without exiting early even taking into account that it can be `null` (line 12). For example:

```ts
const partitionKey = event.partitionKey == null ? JSON.stringify(event) : event.partitionKey;
const normalizedPartitionKey =
  typeof partitionKey !== 'string' ? JSON.stringify(partitionKey) : partitionKey;
```

or even more consisely:

```ts
const partitionKey = event.partitionKey == null
  ? JSON.stringify(event)
  : typeof event.partitionKey !== 'string' ? JSON.stringify(event.partitionKey) : event.partitionKey;
```

Although this approach would result in shorter code, it may not necessarily make it easier to read since it either involves a complicated nested ternary or it does not as clearly state what happens when the `partitionKey` is `null`. In most cases, I prefer to optimize for code readability rather than code length.

It is also important to mention that there are no more `let` variables used in the refactored code. Instead, `const` has been used to make it easier to keep track of values and assignments. Additionally, I have removed the variable `candidate`, which was not appropriately named.
