import type { PromisifyValue } from '../index';

import { cast } from './utils';

function handleNativePromise<Data>(promise: PromiseLike<Data>, prop: string | symbol) {
	if (!Object.hasOwn(Promise.prototype, prop)) return;

	const value = promise[cast<keyof PromiseLike<Data>>(prop)];

	if (typeof value === 'function') {
		return value.bind(promise);
	}

	return value;
}

async function getNextValueFromPrevPromise<Data>(promise: PromiseLike<Data>, prop: string | symbol): Promise<unknown> {
	const data = await promise;
	const value = data[cast<keyof Data>(prop)];
	return typeof value === 'function' ? value.bind(data) : value;
}

function proxymify<Data>(getData: () => PromiseLike<Data>): unknown {
	const promise = getData();

	return new Proxy(getData, {
		get(_, prop) {
			return (
				handleNativePromise(promise, prop)
				?? proxymify(() => getNextValueFromPrevPromise(promise, prop))
			);
		},

		apply(target, _, args) {
			return proxymify(async () => {
				const fn = await target();
				return cast<Function>(fn)(...args);
			});
		},
	});
}

export function async<Data>(data: Data): PromisifyValue<Data>;

export function async<Data>(promise: PromiseLike<Data>): PromisifyValue<Data>;

export function async<Data>(getPromise: () => PromiseLike<Data>): PromisifyValue<Data>;

export function async<Data>(value: Data | PromiseLike<Data> | (() => PromiseLike<Data>)): PromisifyValue<Data> {
	if (typeof value === 'function') {
		return cast(proxymify(cast(value)));
	}

	return cast(proxymify(() => Promise.resolve(value)));
}
