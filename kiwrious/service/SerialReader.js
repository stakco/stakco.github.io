"use strict";
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
exports.SerialReader = void 0;
var SerialRawValue_1 = require("./SerialRawValue");
var SerialUtil_1 = require("./SerialUtil");
var EXPECTED_ARRAY_SIZE = 26;
var SerialReader = /** @class */ (function () {
    function SerialReader(reader) {
        this._reader = reader;
        this._array = new Uint8Array();
    }
    SerialReader.prototype._log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(['|SerialReader|'], msg, false));
    };
    SerialReader.prototype._err = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArray(['|SerialReader|'], msg, false));
    };
    SerialReader.prototype._read = function () {
        return __awaiter(this, void 0, void 0, function () {
            var spliced, readInstance, value, done;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //If we have enough in the array use that don't read...
                        if (this._array.length >= EXPECTED_ARRAY_SIZE) {
                            spliced = this._array.subarray(0, EXPECTED_ARRAY_SIZE);
                            this._array = this._array.subarray(EXPECTED_ARRAY_SIZE);
                            //this._log('reading from array..', this._array.length, spliced.length);
                            return [2 /*return*/, new SerialRawValue_1.SerialRawValue(spliced)];
                        }
                        if (!this._reader) {
                            this._err('readLoop - no reader. returning');
                            throw new Error('no reader');
                        }
                        return [4 /*yield*/, this._reader.read()];
                    case 1:
                        readInstance = _a.sent();
                        value = readInstance.value, done = readInstance.done;
                        if (done) {
                            //this._log("[readOnce] DONE", done);
                            throw new Error('reader done');
                        }
                        //this._log('reading length', value.length);
                        // if match expectation, clear buffer and return..
                        if (value.length === EXPECTED_ARRAY_SIZE) {
                            //this._log('array length matched. clearing temp array..');
                            this._array = new Uint8Array();
                            return [2 /*return*/, new SerialRawValue_1.SerialRawValue(value.subarray(0))];
                        }
                        //otherwise, append to array
                        this._array = SerialUtil_1.SerialUtil.concatArray(this._array, value);
                        return [4 /*yield*/, this.readOnce()];
                    case 2: 
                    //this._log('added to array. length:', this._array.length);
                    //then read again (recursive)
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SerialReader.prototype.readMultiple = function () {
        return __awaiter(this, arguments, void 0, function (numberToRead) {
            var array, value;
            if (numberToRead === void 0) { numberToRead = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        array = [];
                        _a.label = 1;
                    case 1:
                        if (!(array.length < numberToRead)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._read()];
                    case 2:
                        value = _a.sent();
                        array.push(value);
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, array];
                }
            });
        });
    };
    SerialReader.prototype.readOnce = function () {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._read()];
                    case 1:
                        value = _a.sent();
                        if (value) {
                            // this._log('readOnce', value.header2Bytes, value.footer2Bytes, value.rawValue.length, value.sensorTypeRaw);
                        }
                        return [2 /*return*/, value];
                }
            });
        });
    };
    return SerialReader;
}());
exports.SerialReader = SerialReader;
