import type { Promisify } from './interface';

import { cast, proxymify, isFunction } from './utils';

export * from './interface';

export function async<T>(getPromise: () => PromiseLike<T>): Promisify<T>;

export function async<T>(getPromise: () => T): Promisify<T>;

export function async<T>(promise: PromiseLike<T>): Promisify<T>;

export function async<T>(data: T): Promisify<T>;

/**
 * The function allows you to work flatly with promises using the `Proxy` object.
 *
 * The value you pass will be patched using the `Promisify` type in such a way that
 * each of its members will be wrapped in a promise. However, you can still work with this value
 * without worrying about the nested promises.
 *
 * @param value
 * Can be any value or a function that returns any value.
 * The final value will be wrapped in the `Promise`.
 *
 * @example
 * ```typescript
 * function getData(): Promise<Promise<number>[]> {
 *  return Promise.resolve([Promise.resolve(21)]);
 * }
 *
 * // "21"
 * const str1 = await flatAsync(getData)()[0].toFixed(1);
 * // "21"
 * const str2 = await flatAsync(getData())[0].toFixed(1);
 * ```
 */
export function async<T>(value: T | PromiseLike<T> | ((...args: any[]) => any)): Promisify<T> {
	if (isFunction(value)) {
		return cast(proxymify(
			(...args: unknown[]) => Promise.resolve(value(...args))
		));
	}

	return cast(proxymify(() => Promise.resolve(value)));
}
