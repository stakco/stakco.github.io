"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.SerialHeartRate2Decoder = void 0;
var HeartRateProcessor_1 = require("./HeartRateProcessor");
var MinValueThreshold_1 = require("./MinValueThreshold");
var SerialDecoder_1 = require("./SerialDecoder");
var SerialRawValue_1 = require("./SerialRawValue");
var SerialUtil_1 = require("./SerialUtil");
var SerialHeartRate2Decoder = /** @class */ (function (_super) {
    __extends(SerialHeartRate2Decoder, _super);
    function SerialHeartRate2Decoder() {
        var _this = _super.call(this) || this;
        _this._thresholdChecker = new MinValueThreshold_1.MinValueThreshold();
        _this._postProcessor = new HeartRateValuePostProcessor();
        _this._processor = new HeartRateProcessor_1.HeartRateProcessor();
        // Detector 
        _this._detector = new HeartRateDetector();
        return _this;
    }
    SerialHeartRate2Decoder.prototype._log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(['|SerialHeartRateDecoder|'], msg, false));
    };
    SerialHeartRate2Decoder.prototype.decode = function (array) {
        return __awaiter(this, void 0, void 0, function () {
            var sliced, rawValue, data0, isValid, value0, result, subArrays, rawData, heartRateResult, postProcessedResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sliced = array[0].rawValue.slice(0, 26);
                        rawValue = new SerialRawValue_1.SerialRawValue(sliced);
                        data0 = rawValue.getFourBytesByIndex(6);
                        isValid = this._thresholdChecker.check(data0);
                        this._log('rawValue', data0, isValid);
                        value0 = {
                            label: SerialRawValue_1.SENSOR_VALUE.HEART_RATE,
                            value: {
                                status: HeartRateProcessor_1.HEART_RATE_RESULT_STATUS.TOO_LOW,
                                value: 0
                            },
                            type: "object"
                        };
                        result = {
                            sensorType: array[0].sensorType,
                            decodedValues: [value0]
                        };
                        subArrays = array.map(function (i) { return i.rawValue.subarray(6, 22); });
                        rawData = SerialUtil_1.SerialUtil.concatMultiArrays(subArrays);
                        if (!isValid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._detector.detectHeartRate(rawData)];
                    case 1:
                        heartRateResult = _a.sent();
                        this._log('heartrate-result', heartRateResult);
                        postProcessedResult = this._postProcessor.process(heartRateResult);
                        value0.value = postProcessedResult;
                        _a.label = 2;
                    case 2: return [2 /*return*/, result];
                }
            });
        });
    };
    return SerialHeartRate2Decoder;
}(SerialDecoder_1.SerialDecoder));
exports.SerialHeartRate2Decoder = SerialHeartRate2Decoder;
var HeartRateValuePostProcessor = /** @class */ (function () {
    function HeartRateValuePostProcessor() {
        this._wasReady = false;
    }
    HeartRateValuePostProcessor.prototype.process = function (heartrateValue) {
        // if the value is processing, but the previous one was "READY", consider this one ready to avoid temporary status change
        if (heartrateValue.status === HeartRateProcessor_1.HEART_RATE_RESULT_STATUS.PROCESSING && this._wasReady) {
            heartrateValue.status = HeartRateProcessor_1.HEART_RATE_RESULT_STATUS.READY;
        }
        this._wasReady = heartrateValue.status === HeartRateProcessor_1.HEART_RATE_RESULT_STATUS.READY;
        return heartrateValue;
    };
    return HeartRateValuePostProcessor;
}());
