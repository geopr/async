var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cast(value) {
    return value;
}
/**
 * Checks if provided value is a type of function
 *
 * @param value
 */
export function isFunction(value) {
    return typeof value === 'function';
}
/**
 * The function implements the logic of chaining promises flatly using the `Proxy` object.
 * It creates a chain of promises where each next promise takes a value from the previous one.
 *
 * @param getPrevPromiseLike - the function that returns the previous `PromiseLike` in chain
 */
export function proxymify(getPrevPromiseLike) {
    return new Proxy(getPrevPromiseLike, {
        get: function (_, nextProp) {
            var _a;
            var prevPromiseLike = getPrevPromiseLike();
            return (_a = handleNativePromise(prevPromiseLike, nextProp)) !== null && _a !== void 0 ? _a : proxymifyNextValue(prevPromiseLike, nextProp);
        },
        apply: function (target, _, args) {
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
function handleNativePromise(prevPromiseLike, nextProp) {
    if (!Object.hasOwn(Promise.prototype, nextProp)) {
        return;
    }
    var value = prevPromiseLike[cast(nextProp)];
    return isFunction(value) ? value.bind(prevPromiseLike) : value;
}
/**
 * Creates next promise in chain that gets a value from the previous one by accessing it using the specified prop.
 *
 * @param prevPromiseLike - previous `PromiseLike`
 * @param nextProp - key to get next value
 */
function proxymifyNextValue(prevPromiseLike, nextProp) {
    var _this = this;
    return proxymify(function () { return __awaiter(_this, void 0, void 0, function () {
        var data, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prevPromiseLike];
                case 1:
                    data = _a.sent();
                    value = cast(data)[cast(nextProp)];
                    return [2 /*return*/, isFunction(value) ? value.bind(data) : value];
            }
        });
    }); });
}
/**
 * Creates next promise in chain that gets value from the previous one by calling the function.
 * This function is called when we try to call a method on the previous proxied object.
 *
 * @param getMethod - the function that returns `PromiseLike` with currently calling method
 * @param args - arguments for the method
 */
function proxymifyNextValueFromMethodCall(getMethod, args) {
    var _this = this;
    return proxymify(function () { return __awaiter(_this, void 0, void 0, function () {
        var method;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMethod()];
                case 1:
                    method = _a.sent();
                    return [2 /*return*/, method.apply(void 0, __spreadArray([], __read(args), false))];
            }
        });
    }); });
}
/**
 * Util for checking two types equality
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function expectType() { }
