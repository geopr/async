declare type Fn<Return, Args extends any[]> = <R extends Return = Return, A extends Args = Args>(...args: A) => Promisify<R>;
declare type AnyFunction = (...params: any[]) => any;
declare type Overloads<T> = T extends () => infer R ? <Return extends R = R>() => Promisify<Return> : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
    (...args: infer A4): infer R4;
} ? Fn<R1, A1> | Fn<R2, A2> | Fn<R3, A3> | Fn<R4, A4> : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
} ? Fn<R1, A1> | Fn<R2, A2> | Fn<R3, A3> : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
} ? Fn<R1, A1> | Fn<R2, A2> : T extends (...args: infer A1) => infer R1 ? Fn<R1, A1> : never;
declare type UnionToIntersection<Fn> = (Fn extends any ? (fn: Fn) => void : never) extends (fn: infer F) => void ? F : never;
declare type WithPromise<Wrapped, Origin> = Wrapped & Promise<Origin>;
declare type GetSchema<Value> = Value extends string ? String : Value extends number ? Number : Value extends boolean ? Boolean : Value extends bigint ? BigInt : Value extends PromiseLike<infer Item> ? GetSchema<Item> : Value extends any[] ? WithPromise<Value, Value> : Value;
declare type PromisifySchema<Schema, Origin> = WithPromise<{
    [Key in keyof Schema]: Schema[Key] extends AnyFunction ? UnionToIntersection<Overloads<Schema[Key]>> : Promisify<Schema[Key]>;
}, Origin>;
export declare type Promisify<Value> = PromisifySchema<GetSchema<Value>, Value>;
export {};
