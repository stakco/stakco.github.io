"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialRawValue = exports.LATEST_SENSOR_VERSION = exports.SENSOR_VALUE = exports.SENSOR_TYPE = void 0;
var SerialHexValue_1 = require("./SerialHexValue");
exports.SENSOR_TYPE = {
    UNKNOWN: 'UNKNOWN',
    UV: 'UV',
    UV2: 'UV2',
    HUMIDITY: 'HUMIDITY',
    VOC: 'VOC',
    CONDUCTIVITY: 'CONDUCTIVITY',
    HEART_RATE: 'HEART_RATE',
    HEART_RATE2: 'HEART_RATE2',
    TEMPERATURE: 'TEMPERATURE',
    TEMPERATURE2: 'TEMPERATURE2',
    // TODO: other sensor types
};
exports.SENSOR_VALUE = {
    UNKNOWN: 'UNKNOWN',
    UV_INDEX: 'Uv',
    LUX: 'Lux',
    HUMIDITY: 'Hum',
    TEMPERATURE: 'Temp',
    VOC: 'Voc',
    CONDUCTIVITY: 'Con',
    HEART_RATE: 'HeartRate',
    INFRARED_TEMPERATURE: 'InfraredTemp',
    AMBIENT_TEMPERATURE: 'AmbientTemp',
};
// sensor version = undefined indicates sensor is having the initial firmware
exports.LATEST_SENSOR_VERSION = new Map([
    ['UV', 2],
    ['HUMIDITY', undefined],
    ['VOC', undefined],
    ['CONDUCTIVITY', undefined],
    ['HEART_RATE', 2],
    ['TEMPERATURE', 2]
]);
var SerialRawValue = /** @class */ (function () {
    function SerialRawValue(rawValue) {
        this.rawValue = rawValue;
        this.dataView = new DataView(rawValue.buffer);
        if (!this.isValidLength) {
            throw new Error("invalid array length. expected [] but got [".concat(rawValue.length, "]"));
        }
    }
    Object.defineProperty(SerialRawValue.prototype, "isValidLength", {
        get: function () {
            return this.rawValue.length === 26;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SerialRawValue.prototype, "sensorTypeRaw", {
        get: function () {
            return this.rawValue[2];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SerialRawValue.prototype, "header2Bytes", {
        get: function () {
            return this.getTwoBytesByIndex(0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SerialRawValue.prototype, "sequence2Bytes", {
        get: function () {
            return this.getTwoBytesByIndex(22);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SerialRawValue.prototype, "footer2Bytes", {
        get: function () {
            return this.getTwoBytesByIndex(24);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SerialRawValue.prototype, "decoderType", {
        get: function () {
            switch (this.sensorTypeRaw) {
                case 1: return exports.SENSOR_TYPE.UV;
                case 2: return exports.SENSOR_TYPE.TEMPERATURE;
                case 4: return exports.SENSOR_TYPE.CONDUCTIVITY;
                case 5: return exports.SENSOR_TYPE.HEART_RATE;
                case 6: return exports.SENSOR_TYPE.VOC;
                case 7: return exports.SENSOR_TYPE.HUMIDITY;
                case 9: return exports.SENSOR_TYPE.TEMPERATURE2;
                // updated firmware sensor
                case 10: return exports.SENSOR_TYPE.HEART_RATE2;
                case 11: return exports.SENSOR_TYPE.UV2;
                // TODO OTHER SENSORS
                default:
                    throw new Error("invalid sensor type ".concat(this.sensorTypeRaw));
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SerialRawValue.prototype, "isFirmwareOutdated", {
        get: function () {
            var _a;
            var regex = /\d$/gm;
            var currentSensorVersion = (_a = this.decoderType.match(regex)) === null || _a === void 0 ? void 0 : _a.toString();
            return currentSensorVersion != exports.LATEST_SENSOR_VERSION.get(this.sensorType);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SerialRawValue.prototype, "sensorType", {
        get: function () {
            var regex = /\d$/gm;
            var sensorName = this.decoderType.replace(regex, '');
            return sensorName;
        },
        enumerable: false,
        configurable: true
    });
    // For humidity and temp sensor
    SerialRawValue.prototype.getTwoBytesSignedByIndex = function (index) {
        var value = this.dataView.getInt16(index, true);
        return value;
    };
    SerialRawValue.prototype.getTwoBytesUnsignedByIndex = function (index) {
        var value = this.dataView.getUint16(index, true);
        return value;
    };
    SerialRawValue.prototype.getTwoBytesByIndex = function (index) {
        var value = this.dataView.getUint16(index, true);
        return value;
    };
    SerialRawValue.prototype.getFourBytesByIndex = function (index) {
        var value = this.dataView.getUint32(index, true);
        return value;
    };
    SerialRawValue.prototype.getFourBytesFloatByIndex = function (index) {
        var value = this.dataView.getFloat32(index, true);
        return value;
    };
    SerialRawValue.prototype.sliceBytes = function (index, numberOfBytes) {
        if (index + numberOfBytes > this.rawValue.length) {
            throw new Error("invalid index [".concat(index, "] for array length [").concat(this.rawValue.length, "]"));
        }
        var sliced = this.rawValue.slice(index, index + numberOfBytes);
        return sliced;
    };
    SerialRawValue.prototype.getByteByIndex = function (index) {
        if (index >= this.rawValue.length) {
            throw new Error("invalid index [".concat(index, "] for array length [").concat(this.rawValue.length, "]"));
        }
        var value = this.rawValue[index];
        return value;
    };
    SerialRawValue.prototype.getHexDigitByIndex = function (index) {
        if (index >= this.rawValue.length) {
            throw new Error("invalid index [".concat(index, "] for array length [").concat(this.rawValue.length, "]"));
        }
        var value16 = this.rawValue[index]
            .toString(16)
            .padStart(2, '0');
        return value16;
    };
    // obsolete, use getTwoBytesByIndex() istead
    // TODO: refactor to use getTwoBytesByIndex()
    SerialRawValue.prototype.getHexString2 = function (index0, index1) {
        var data0_a = this.getHexDigitByIndex(index0);
        var data0_b = this.getHexDigitByIndex(index1);
        var data0 = "0x".concat(data0_a).concat(data0_b);
        return new SerialHexValue_1.SerialHexValue(data0);
    };
    // obsolete, use getFourBytesByIndex() istead
    // TODO: refactor to use getFourBytesByIndex()
    SerialRawValue.prototype.getHexString4 = function (index0, index1, index2, index3) {
        var data0_a = this.getHexDigitByIndex(index0);
        var data0_b = this.getHexDigitByIndex(index1);
        var data0_c = this.getHexDigitByIndex(index2);
        var data0_d = this.getHexDigitByIndex(index3);
        var data0 = "0x".concat(data0_a).concat(data0_b).concat(data0_c).concat(data0_d);
        return new SerialHexValue_1.SerialHexValue(data0);
    };
    return SerialRawValue;
}());
exports.SerialRawValue = SerialRawValue;
