"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialUtil = void 0;
var SerialUtil = /** @class */ (function () {
    function SerialUtil() {
    }
    SerialUtil.concatArray = function (a, b) {
        var c = new Uint8Array(a.length + b.length);
        c.set(a, 0);
        c.set(b, a.length);
        return c;
    };
    SerialUtil.concatMultiArrays = function (arrays) {
        var totalLen = arrays.reduce(function (a, c) {
            return a + c.length;
        }, 0);
        var result = new Uint8Array(totalLen);
        arrays.reduce(function (a, c) {
            result.set(c, a);
            return a + c.length;
        }, 0);
        return result;
    };
    return SerialUtil;
}());
exports.SerialUtil = SerialUtil;
