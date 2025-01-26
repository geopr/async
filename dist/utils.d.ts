export declare function cast<T>(value: any): T;
/**
 * Checks if provided value is a type of function
 *
 * @param value
 */
export declare function isFunction(value: any): value is ((...args: any[]) => any);
/**
 * The function implements the logic of chaining promises flatly using the `Proxy` object.
 * It creates a chain of promises where each next promise takes a value from the previous one.
 *
 * @param getPrevPromiseLike - the function that returns the previous `PromiseLike` in chain
 */
export declare function proxymify<T>(getPrevPromiseLike: (...args: unknown[]) => PromiseLike<T>): unknown;
declare type Fn<T> = (<V>() => V extends T ? 1 : 0);
declare type AreEquals<A, B> = Fn<A> extends Fn<B> ? unknown : never;
/**
 * Util for checking two types equality
 */
export declare function expectType<A, B extends A & AreEquals<A, B>>(): void;
export {};
