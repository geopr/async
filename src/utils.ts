// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cast<T>(value: any): T {
	return value;
}

/**
 * Checks if provided value is a type of function
 * 
 * @param value
 */
export function isFunction(value: any): value is ((...args: any[]) => any) {
  return typeof value === 'function';
}

/**
 * The function implements the logic of chaining promises flatly using the `Proxy` object.
 * It creates a chain of promises where each next promise takes a value from the previous one.
 *
 * @param getPrevPromiseLike - the function that returns the previous `PromiseLike` in chain
 */
export function proxymify<T>(getPrevPromiseLike: (...args: unknown[]) => PromiseLike<T>): unknown {
	return new Proxy(getPrevPromiseLike, {
		get(_: unknown, nextProp: string): unknown {
			const prevPromiseLike = getPrevPromiseLike();
			return handleNativePromise(prevPromiseLike, nextProp) ?? proxymifyNextValue(prevPromiseLike, nextProp);
		},

		apply(target: (...args: unknown[]) => PromiseLike<Function>, _: unknown, args: unknown[]): unknown {
			return proxymifyNextValueFromMethodCall(target, args);
		}
	});
}

/**
 * Checks if the passed prop is in the `Promise.prototype` and tries to get value by this prop.
 *
 * @param prevPromiseLike - previous `PromiseLike`
 * @param nextProp - possible key from `Promise.prototype`
 */
function handleNativePromise<T>(prevPromiseLike: PromiseLike<T>, nextProp: string | symbol): unknown {
	if (!Object.hasOwn(Promise.prototype, nextProp)) {
		return;
	}

	const value = prevPromiseLike[cast<keyof PromiseLike<T>>(nextProp)];
	return isFunction(value) ? value.bind(prevPromiseLike) : value;
}

/**
 * Creates next promise in chain that gets a value from the previous one by accessing it using the specified prop.
 *
 * @param prevPromiseLike - previous `PromiseLike`
 * @param nextProp - key to get next value
 */
function proxymifyNextValue<Data>(prevPromiseLike: PromiseLike<Data>, nextProp: string | symbol): unknown {
	return proxymify(async () => {
		const data = await prevPromiseLike;
		const value = cast<Record<string, any>>(data)[cast<string>(nextProp)];
		return isFunction(value) ? value.bind(data) : value;
	});
}

/**
 * Creates next promise in chain that gets value from the previous one by calling the function.
 * This function is called when we try to call a method on the previous proxied object.
 *
 * @param getMethod - the function that returns `PromiseLike` with currently calling method
 * @param args - arguments for the method
 */
function proxymifyNextValueFromMethodCall(getMethod: () => PromiseLike<Function>, args: unknown[]): unknown {
	return proxymify(async () => {
		const method = await getMethod();
		return method(...args);
	});
}

type Fn<T> = (<V>() => V extends T ? 1 : 0);

type AreEquals<A, B> = Fn<A> extends Fn<B> ? unknown : never;

/**
 * Util for checking two types equality
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function expectType<A, B extends A & AreEquals<A, B>>(): void {}
