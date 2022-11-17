## A small library for working with async data

### Description

the library provides only one function that you can use to wrap your async data

the function uses proxy object that stores your changes and apply them by the time your data is arrived

### Example

one of the ways of using `async` is to pass a function that returns promise-like object with your data

```ts

import { async } from 'async';

interface Data {
    foo: {
        bar: string[];
    }
}

function request(): Promise<Data> {
    // ...
}

const 
  firstUpperCaseString = await async(request).foo.bar.at(0)?.toUpperCase();
```

by the time your promise-like is resolved the `data` will have the first element from the array of strings transformed to upper case

the `async` function returns a simple promise so you can call Promise.prototype methods

```ts
async(request).foo.bar
  .then(() => {})
  .catch(() => {})
  .finally(() => {});
```

you can also create multiple independent promises

```ts
const
  foo = async(request).foo, 
  bar = foo.bar,
  firstUpperCase = bar.at(0)?.toUpperCase();
```

if you want to unwrap all of them you can use `Promise.all` or any other static method

```ts
await Promise.all([foo, bar, firstUpperCase]);
```

you can also pass a promise-like object or just simple data and it's gonna be wrapped in promise

```ts
async(Promise.resolve({ foo: 21 })).foo;
async({ then(cb) { cb({ bar: 21 }) } }).bar;
async({ baz: 21 }).baz;
```

the `async` function also will be useful when you have some functions and each of them returns a promise

```ts
const end = {
    end() {
        return Promise.resolve(21);
    }
}

const process = {
    process() {
        return Promise.resolve(end);
    }
}

const start = {
    start() {
        return Promise.resolve(process);
    }
}

```

imagine you want to get `21`

you would write something like this

```ts
const
  process = await start.start(),
  end = await process.process(),
  twentyOne = await end.end();
```

with `async` you can do the same thing this way

```ts
const twentyOne = await async(start).start().process().end();
```

### API
```ts
function async<Data>(data: Data): Promisify<Data>;

function async<Data>(promise: Promise<Data>): Promisify<Data>;

function async<Data>(getPromise: () => Promise<Data>): Promisify<Data>;
```

the `Promisify` type simply patches all of your fields and methods so they will return a promise

