import type { Promisify } from './interface';
export * from './interface';
export declare function async<Data>(data: Data): Promisify<Data>;
export declare function async<Data>(promise: PromiseLike<Data>): Promisify<Data>;
export declare function async<Data>(getPromise: () => PromiseLike<Data>): Promisify<Data>;
