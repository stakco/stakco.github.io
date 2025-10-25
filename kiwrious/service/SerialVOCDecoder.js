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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOC_RESULT_STATUS = exports.VOCSerialDecoder = void 0;
var SerialDecoder_1 = require("./SerialDecoder");
var SerialRawValue_1 = require("./SerialRawValue");
var MAX_MS_WAIT_FOR_DATA_READY = 20000;
var INTERVAL_MS = 1000;
var MAX_PERCENTAGE = 100;
var VOCSerialDecoder = /** @class */ (function (_super) {
    __extends(VOCSerialDecoder, _super);
    function VOCSerialDecoder() {
        var _this = _super.call(this) || this;
        _this._hasStartedWaitingForData = false;
        _this._dataReadyPercentage = 0;
        _this._incrementPercentage = INTERVAL_MS * MAX_PERCENTAGE / MAX_MS_WAIT_FOR_DATA_READY;
        return _this;
    }
    VOCSerialDecoder.prototype.decode = function (rawValues) {
        return __awaiter(this, void 0, void 0, function () {
            var rawValue, data0f, data, value0, result;
            return __generator(this, function (_a) {
                if (!rawValues.length) {
                    throw new Error('invlalid input. expected 1 value at least');
                }
                rawValue = rawValues[0];
                if (!rawValue.isValidLength) {
                    this._log("invalid length ".concat(rawValue.rawValue.length, ". skipping.."));
                    return [2 /*return*/, null];
                }
                if (!this._hasStartedWaitingForData) {
                    this.startIntervalForDataReady();
                }
                data0f = rawValue.getTwoBytesByIndex(6);
                if (data0f > 0) {
                    this.clearIntervalIfRunning();
                }
                data = {
                    status: this._dataReadyPercentage !== MAX_PERCENTAGE ? exports.VOC_RESULT_STATUS.PROCESSING : exports.VOC_RESULT_STATUS.READY,
                    dataReadyPercentage: this._dataReadyPercentage,
                    value: data0f
                };
                value0 = { label: SerialRawValue_1.SENSOR_VALUE.VOC, value: data, type: "object" };
                result = {
                    sensorType: rawValue.sensorType,
                    decodedValues: [value0]
                };
                return [2 /*return*/, result];
            });
        });
    };
    VOCSerialDecoder.prototype.clearIntervalIfRunning = function () {
        if (!this._dataReadyIntervalId) {
            return;
        }
        this._log('clearIntervalIfRunning');
        clearInterval(this._dataReadyIntervalId);
        this._dataReadyIntervalId = undefined;
        this._dataReadyPercentage = MAX_PERCENTAGE;
    };
    VOCSerialDecoder.prototype.startIntervalForDataReady = function () {
        var _this = this;
        this._log('start interval for data ready..');
        this.runOneInterval();
        this._dataReadyIntervalId = setInterval(function () {
            _this.runOneInterval();
        }, INTERVAL_MS);
        this._hasStartedWaitingForData = true;
    };
    VOCSerialDecoder.prototype.runOneInterval = function () {
        if (this._dataReadyPercentage >= MAX_PERCENTAGE) {
            this.clearIntervalIfRunning();
            return;
        }
        this._dataReadyPercentage += this._incrementPercentage;
    };
    return VOCSerialDecoder;
}(SerialDecoder_1.SerialDecoder));
exports.VOCSerialDecoder = VOCSerialDecoder;
exports.VOC_RESULT_STATUS = {
    PROCESSING: 'PROCESSING',
    READY: 'READY',
};
