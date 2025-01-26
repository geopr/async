import type { Promisify } from './interface';
export * from './interface';
export declare function async<T>(getPromise: () => PromiseLike<T>): Promisify<T>;
export declare function async<T>(getPromise: () => T): Promisify<T>;
export declare function async<T>(promise: PromiseLike<T>): Promisify<T>;
export declare function async<T>(data: T): Promisify<T>;
