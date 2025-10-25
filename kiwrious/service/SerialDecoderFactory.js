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
exports.SerialDecoderFactory = void 0;
var SerialRawValue_1 = require("./SerialRawValue");
var SerialHumidityDecoder_1 = require("./SerialHumidityDecoder");
var SerialUVDecoder_1 = require("./SerialUVDecoder");
var SerialVOCDecoder_1 = require("./SerialVOCDecoder");
var SerialConductivityDecoder_1 = require("./SerialConductivityDecoder");
var SerialHeartRateDecoder_1 = require("./SerialHeartRateDecoder");
var SerialHeartRate2Decoder_1 = require("./SerialHeartRate2Decoder");
var SerialTemperatureDecoder_1 = require("./SerialTemperatureDecoder");
var SerialTemperature2Decoder_1 = require("./SerialTemperature2Decoder");
var ValueReader_1 = require("./ValueReader");
var SerialDecoderFactory = /** @class */ (function () {
    function SerialDecoderFactory() {
    }
    SerialDecoderFactory._log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(['|SerialDecoderFactory|'], msg, false));
    };
    SerialDecoderFactory._err = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArray(["|SerialDecoderFactory|"], msg, false));
    };
    SerialDecoderFactory.createDecoder = function (type) {
        SerialDecoderFactory._log('createDecoder');
        SerialDecoderFactory._log('type = ' + type);
        switch (type) {
            case SerialRawValue_1.SENSOR_TYPE.UV:
            case SerialRawValue_1.SENSOR_TYPE.UV2:
                return new SerialUVDecoder_1.UVSerialDecoder();
            case SerialRawValue_1.SENSOR_TYPE.HUMIDITY: return new SerialHumidityDecoder_1.HumiditySerialDecoder();
            case SerialRawValue_1.SENSOR_TYPE.HEART_RATE: return new SerialHeartRateDecoder_1.SerialHeartRateDecoder();
            case SerialRawValue_1.SENSOR_TYPE.HEART_RATE2: return new SerialHeartRate2Decoder_1.SerialHeartRate2Decoder();
            case SerialRawValue_1.SENSOR_TYPE.VOC: return new SerialVOCDecoder_1.VOCSerialDecoder();
            case SerialRawValue_1.SENSOR_TYPE.CONDUCTIVITY: return new SerialConductivityDecoder_1.ConductivitySerialDecoder();
            case SerialRawValue_1.SENSOR_TYPE.TEMPERATURE: return new SerialTemperatureDecoder_1.TemperatureSerialDecoder();
            case SerialRawValue_1.SENSOR_TYPE.TEMPERATURE2: return new SerialTemperature2Decoder_1.Temperature2SerialDecoder();
            case SerialRawValue_1.SENSOR_TYPE.HEART_RATE2: return new SerialHeartRate2Decoder_1.SerialHeartRate2Decoder();
            default:
                throw new Error("invalid type ".concat(type));
        }
    };
    SerialDecoderFactory.createReader = function (type) {
        SerialDecoderFactory._log('createReader');
        switch (type) {
            case SerialRawValue_1.SENSOR_TYPE.UV:
            case SerialRawValue_1.SENSOR_TYPE.UV2:
            case SerialRawValue_1.SENSOR_TYPE.HUMIDITY:
            case SerialRawValue_1.SENSOR_TYPE.HEART_RATE:
            case SerialRawValue_1.SENSOR_TYPE.VOC:
            case SerialRawValue_1.SENSOR_TYPE.CONDUCTIVITY:
            case SerialRawValue_1.SENSOR_TYPE.TEMPERATURE:
            case SerialRawValue_1.SENSOR_TYPE.TEMPERATURE2:
                return new ValueReader_1.SingleValueReader();
            case SerialRawValue_1.SENSOR_TYPE.HEART_RATE2:
                return new ValueReader_1.TenValuesReader();
            default:
                throw new Error("invalid type ".concat(type));
        }
    };
    return SerialDecoderFactory;
}());
exports.SerialDecoderFactory = SerialDecoderFactory;
