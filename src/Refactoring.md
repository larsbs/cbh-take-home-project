# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

The main optimizations I've made to the legibility of the code is listing the early exits of the function as soon as possible. This way, when reading the function, it's easier to know what you should keep track of and what you can forget about as you're reading the code.

For example, we check early if the event is null, so we can forget about checking it again in the rest of the code, otherwise, the function would have already returned and we wouldn't be there.

Also, listing the returns early helps easily visualize the different outputs of the function and let you focus only on the specific use case you're interested in. For example, if the function is returning the wrong results for when the `partitionKey` is not found, you can just focus on the `if` block that handles that case forgetting about the rest.

Once we've made clear when and why our function exits, the rest of the refactor almost happens by itself.

The rest of the refactor is focused on making clearer that a normalization of the type of the `partitionKey` to `string` exists (line 19) and that the `partitionKey` itself will be hashed if it exceeds a certain amount of characters.

The only "controversial" change I see here is that we could have just normalized the `partitionKey` without exiting early in case it's `null` (line 12). For example:

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

However, even though this approach would lead to shorter code, it would not necessarily make it easier to read since it either involves a complicated nested ternary or it doesn't as clearly list what happens when the `partitionKey` is `null`. And most of the time, I prefer to optimize for reading code rather than for writing code.

Another thing important to mention probably, is how there are no more `let` variables, and instead, `const` has been used, so it's easier to keep track of values and assignments. We have also removed the not super appropiately named `candidate` variable.
