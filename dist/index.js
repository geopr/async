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
export * from './interface';
import { cast } from './utils';
export function async(value) {
    if (typeof value === 'function') {
        return cast(proxymify(cast(value)));
    }
    return cast(proxymify(function () { return Promise.resolve(value); }));
}
function proxymify(getData) {
    var promise = getData();
    return new Proxy(getData, {
        get: function (_, prop) {
            var _a;
            return (_a = handleNativePromise(promise, prop)) !== null && _a !== void 0 ? _a : proxymifyNextValue(promise, prop);
        },
        apply: function (target, _, args) {
            return proxymifyNextValueFromFunctionCall(cast(target), args);
        },
    });
}
function handleNativePromise(promise, prop) {
    if (!Object.hasOwn(Promise.prototype, prop))
        return;
    var value = promise[cast(prop)];
    if (typeof value === 'function') {
        return value.bind(promise);
    }
    return value;
}
function proxymifyNextValue(promise, prop) {
    return proxymify(function () { return getNextValueFromPrevPromise(promise, prop); });
}
function getNextValueFromPrevPromise(promise, prop) {
    return __awaiter(this, void 0, void 0, function () {
        var data, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promise];
                case 1:
                    data = _a.sent();
                    value = data[cast(prop)];
                    return [2 /*return*/, typeof value === 'function' ? value.bind(data) : value];
            }
        });
    });
}
function proxymifyNextValueFromFunctionCall(getFn, args) {
    return proxymify(function () { return getNextValueFromFunction(getFn, args); });
}
function getNextValueFromFunction(getFn, args) {
    return __awaiter(this, void 0, void 0, function () {
        var fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFn()];
                case 1:
                    fn = _a.sent();
                    return [2 /*return*/, fn.apply(void 0, __spreadArray([], __read(args), false))];
            }
        });
    });
}
