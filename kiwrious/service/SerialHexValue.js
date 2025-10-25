"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialNumberValue = exports.SerialHexValue = void 0;
var SerialHexValue = /** @class */ (function () {
    function SerialHexValue(rawHexValue) {
        this.rawHexValue = rawHexValue;
    }
    SerialHexValue.prototype.toFloat = function () {
        var raw = Number(this.rawHexValue);
        var s = raw & 0x80000000 ? -1 : 1;
        var e = ((raw >> 23) & 0xff) - 127;
        var c = 1 + (raw & 0x7fffff) / 0x7fffff;
        return s * c * Math.pow(2, e);
    };
    SerialHexValue.prototype.toInt = function () {
        return Number((parseInt(this.rawHexValue)).toFixed());
    };
    SerialHexValue.prototype.divideByHundred = function () {
        return Number((parseInt(this.rawHexValue) / 100).toFixed());
    };
    return SerialHexValue;
}());
exports.SerialHexValue = SerialHexValue;
var SerialNumberValue = /** @class */ (function () {
    function SerialNumberValue(value) {
        this._raw = value;
    }
    Object.defineProperty(SerialNumberValue.prototype, "value", {
        get: function () {
            return this._raw;
        },
        enumerable: false,
        configurable: true
    });
    SerialNumberValue.prototype.toInt = function () {
        return Number(this._raw.toFixed());
    };
    SerialNumberValue.prototype.divideByHundred = function () {
        return Number((this._raw / 100).toFixed());
    };
    return SerialNumberValue;
}());
exports.SerialNumberValue = SerialNumberValue;
