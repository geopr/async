type Fn<Return, Args> = <
	R extends Return = Return,
	A extends Args = Args,
>(...args: A) => PromisifyValue<R>;

type AnyFunction = (...params: any[]) => any;

type Overloads<T> = T extends () => infer R
	? <Return extends R = Return>() => PromisifyValue<Return>

	: T extends {
			(...args: infer A1): infer R1;
			(...args: infer A2): infer R2;
			(...args: infer A3): infer R3;
			(...args: infer A4): infer R4;
		}
		? Fn<R1, A1> |
			Fn<R2, A2> |
			Fn<R3, A3> |
			Fn<R4, A4>

	: T extends {
			(...args: infer A1): infer R1;
			(...args: infer A2): infer R2;
			(...args: infer A3): infer R3;
		}
	? Fn<R1, A1> |
		Fn<R2, A2> |
		Fn<R3, A3>

	: T extends {
			(...args: infer A1): infer R1;
			(...args: infer A2): infer R2;
		}
	? Fn<R1, A1> |
		Fn<R2, A2>

	: T extends (...args: infer A1) => infer R1
	? Fn<R1, A1>

	: never;

type UnionToIntersection<Fn> =
	(Fn extends any ? (fn: Fn) => void : never) extends (fn: infer F) => void ? F : never;

type WithPromise<Wrapped, Origin> = Wrapped & Promise<Origin>;

type GetSchema<Value> = Value extends string
	? String
	: Value extends number
	? Number
	: Value extends boolean
	? Boolean
	: Value extends bigint
	? BigInt
	: Value extends PromiseLike<infer Item>
	? GetSchema<Item>
	: Value extends any[]
	? WithPromise<Value, Value>
	: Value;

type PromisifySchema<Schema, Origin> = WithPromise<
	{
		[Key in keyof Schema]: Schema[Key] extends AnyFunction
			? UnionToIntersection<Overloads<Schema[Key]>>
			: PromisifyValue<Schema[Key]>;
	},
	Origin
>;

export type PromisifyValue<Value> = PromisifySchema<GetSchema<Value>, Value>;

declare namespace async {
	type Promisify<Value> = PromisifyValue<Value>

	function async<Data>(data: Data): Promisify<Data>;

	function async<Data>(promise: PromiseLike<Data>): Promisify<Data>;

	function async<Data>(getPromise: () => PromiseLike<Data>): Promisify<Data>;
}

export = async;

