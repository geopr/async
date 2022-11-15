import type { Promisify } from './interface';

export * from './interface';

import { cast } from './utils';

export function async<Data>(data: Data): Promisify<Data>;

export function async<Data>(promise: PromiseLike<Data>): Promisify<Data>;

export function async<Data>(getPromise: () => PromiseLike<Data>): Promisify<Data>;

export function async<Data>(value: Data | PromiseLike<Data> | (() => PromiseLike<Data>)): Promisify<Data> {
	if (typeof value === 'function') {
		return cast(proxymify(cast(value)));
	}

	return cast(proxymify(() => Promise.resolve(value)));
}

function proxymify<Data>(getData: () => PromiseLike<Data>): unknown {
	const promise = getData();

	return new Proxy(getData, {
		get(_, prop) {
			return handleNativePromise(promise, prop) ?? proxymifyNextValue(promise, prop);
		},

		apply(target, _, args) {
			return proxymifyNextValueFromFunctionCall(cast(target), args);
		},
	});
}

function handleNativePromise<Data>(promise: PromiseLike<Data>, prop: string | symbol) {
	if (!Object.hasOwn(Promise.prototype, prop)) return;

	const value = promise[cast<keyof PromiseLike<Data>>(prop)];

	if (typeof value === 'function') {
		return value.bind(promise);
	}

	return value;
}

function proxymifyNextValue<Data>(promise: PromiseLike<Data>, prop: string | symbol) {
	return proxymify(() => getNextValueFromPrevPromise(promise, prop));
}

async function getNextValueFromPrevPromise<Data>(promise: PromiseLike<Data>, prop: string | symbol): Promise<unknown> {
	const data = await promise;
	const value = data[cast<keyof Data>(prop)];
	return typeof value === 'function' ? value.bind(data) : value;
}

function proxymifyNextValueFromFunctionCall(getFn: () => Promise<Function>, args: any[]) {
	return proxymify(() => getNextValueFromFunction(getFn, args));
}

async function getNextValueFromFunction(getFn: () => Promise<Function>, args: any[]) {
	const fn = await getFn();
	return fn(...args);
}
