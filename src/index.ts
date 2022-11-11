import type { PromisifyValue } from '../index';

import { cast } from './utils';

function proxymify<Data>(getData: () => PromiseLike<Data>): unknown {
	const promise = getData();

	return new Proxy(getData, {
		get(_, prop) {
			if (Object.hasOwn(Promise.prototype, prop)) {
				const value = promise[cast<keyof PromiseLike<Data>>(prop)];

				if (typeof value === 'function') {
					return value.bind(promise);
				}

				return value;
			}

			return proxymify(() => getPromise(cast(prop)))
		},

		apply(target, _, args) {
			return proxymify(() => {
				return target().then((fn) => cast<Function>(fn)(...args))
			});
		},
	});

	async function getPromise(key: string): Promise<unknown> {
		const data = await promise;
		const value = data[cast<keyof Data>(key)];
		return typeof value === 'function' ? value.bind(data) : value;
	}
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
