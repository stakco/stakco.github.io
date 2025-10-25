"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialDecoder = void 0;
var SerialDecoder = /** @class */ (function () {
    function SerialDecoder() {
    }
    SerialDecoder.prototype._log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(['|SerialDecoder|'], msg, false));
    };
    SerialDecoder.prototype._err = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArray(["|SerialDecoder|"], msg, false));
    };
    return SerialDecoder;
}());
exports.SerialDecoder = SerialDecoder;
