var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { cast, proxymify, isFunction } from './utils';
export * from './interface';
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
export function async(value) {
    if (isFunction(value)) {
        return cast(proxymify(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.resolve(value.apply(void 0, __spreadArray([], __read(args), false)));
        }));
    }
    return cast(proxymify(function () { return Promise.resolve(value); }));
}
