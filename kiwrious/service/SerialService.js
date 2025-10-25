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
var SerialReader_1 = require("./SerialReader");
var SerialDecoderFactory_1 = require("./SerialDecoderFactory");
var SerialService = /** @class */ (function () {
    function SerialService() {
        this._isConnected = false;
        this._isReading = false;
        this._log('ctor');
    }
    SerialService.prototype._log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(['|SerialService|'], msg, false));
    };
    SerialService.prototype._err = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArray(["|SerialService|"], msg, false));
    };
    SerialService.prototype._warn = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.warn.apply(console, __spreadArray(["|SerialService|"], msg, false));
    };
    Object.defineProperty(SerialService.prototype, "isReading", {
        get: function () {
            return this._isReading;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SerialService.prototype, "canResumeReading", {
        get: function () {
            // if the port is not null then we probably can resume
            return !!this._port;
        },
        enumerable: false,
        configurable: true
    });
    SerialService.prototype.triggerStopReading = function () {
        // This will cause to exit the reading loop gracefuly
        this._isReading = false;
    };
    SerialService.prototype.closeReader = function () {
        this._log('closing reader..');
        if (!this._reader) {
            this._log('no reader found. exiting..');
            return;
        }
        this.triggerStopReading();
        this._log('cancelling..');
        this._reader.cancel();
        this._log('releasing lock..');
        this._reader.releaseLock();
        this._reader = null;
        this._log('reader closed');
    };
    SerialService.prototype.closePortAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._log('closing port..');
                        if (!this._port) {
                            this._log('no port found. exiting..');
                            return [2 /*return*/];
                        }
                        this._isConnected = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._port.close()];
                    case 2:
                        _a.sent();
                        this._log('port closed');
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this._err('failed to close port', e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        // DO NOT UNCOMMECNT THE NEXT LINE. We keep a reference to the port so we can reuse it later
                        // this.port = null;
                        if (this.onSerialConnection) {
                            this.onSerialConnection(this._isConnected);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SerialService.prototype.resumeReading = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._log('resume reading..');
                        if (!!this._port) return [3 /*break*/, 2];
                        this._log('port not found, restarting..');
                        return [4 /*yield*/, this.connectAndReadAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this.startStage2ConnectPortAsync(this._port)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SerialService.prototype.disconnectAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._log('disconnecting..');
                this.triggerStopReading();
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.stopStage2ClosePortAsync()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, 0);
                return [2 /*return*/];
            });
        });
    };
    SerialService.prototype.connectAndReadAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var port;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._log('connect and read..');
                        return [4 /*yield*/, this.startStage1RequestPortAsync()];
                    case 1:
                        port = _a.sent();
                        if (!port) {
                            this._err('unable to request port');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.startStage2ConnectPortAsync(port)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SerialService.prototype.startStage1RequestPortAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serial, port;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serial = navigator.serial;
                        if (!serial) {
                            alert("This feature only works on Chrome with 'Experimental Web Platform features' enabled");
                            return [2 /*return*/, null];
                        }
                        serial.onconnect = function () {
                            _this._log('serial connect');
                        };
                        serial.ondisconnect = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this._log('serial disconnect');
                                        return [4 /*yield*/, this.disconnectAsync()];
                                    case 1:
                                        _a.sent();
                                        this._port = null;
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        this._log('requesting port..');
                        return [4 /*yield*/, serial
                                .requestPort({
                                filters: [{ usbVendorId: 0x04d8, vendorId: 0x04d8 }, { usbVendorId: 0x0d28, usbProductId: 0x0204 }],
                            })
                                .catch(function (e) {
                                _this._err("failed to serial.requestPort", e);
                            })];
                    case 1:
                        port = _a.sent();
                        if (!port) {
                            this._err("unable to find port value");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, port];
                }
            });
        });
    };
    SerialService.prototype.startStage2ConnectPortAsync = function (port) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._log('startStage2ReadingAsync');
                        return [4 /*yield*/, this.connectPortAsync(port)];
                    case 1:
                        connection = _a.sent();
                        if (!connection) {
                            this._err('failed to connect');
                            return [2 /*return*/];
                        }
                        this._isConnected = true;
                        this._port = connection.port;
                        this._reader = connection.reader;
                        if (this.onSerialConnection) {
                            this.onSerialConnection(this._isConnected);
                        }
                        this.startReading();
                        return [2 /*return*/];
                }
            });
        });
    };
    SerialService.prototype.stopStage2ClosePortAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._log('stopStage2ClosePortAsync');
                        this.closeReader();
                        return [4 /*yield*/, this.closePortAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //TODO: PORT ANY
    SerialService.prototype.connectPortAsync = function (port) {
        return __awaiter(this, void 0, void 0, function () {
            var portInfo, reader;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        portInfo = port.getInfo();
                        this._log('port info', portInfo);
                        if (port.readable) {
                            this._err("port is already readable");
                            return [2 /*return*/, null];
                        }
                        this._log('openning port..');
                        return [4 /*yield*/, port
                                .open({ baudrate: 230400, baudRate: 230400 })
                                .catch(function (e) {
                                _this._err("failed to port.open", e);
                            })];
                    case 1:
                        _a.sent();
                        if (!port.readable) {
                            this._err("port is not readable..");
                            return [2 /*return*/, null];
                        }
                        reader = port.readable.getReader();
                        if (reader.locked) {
                            this._err("reader is locked");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, { port: port, reader: reader }];
                }
            });
        });
    };
    SerialService.prototype.startReading = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serialReader, serialValueForDecoder, decoderType, sensorType, valueReader, decoder, serialValues, decodedValues, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, 7, 8]);
                        this._log('starting reader..');
                        serialReader = new SerialReader_1.SerialReader(this._reader);
                        this._log('creating decoder..');
                        return [4 /*yield*/, serialReader.readOnce()];
                    case 1:
                        serialValueForDecoder = _a.sent();
                        if (this.onFirmwareUpdateAvailable) {
                            this.onFirmwareUpdateAvailable(serialValueForDecoder.isFirmwareOutdated);
                            this._warn("New firmware available ? ".concat(serialValueForDecoder.isFirmwareOutdated));
                        }
                        decoderType = serialValueForDecoder.decoderType;
                        sensorType = serialValueForDecoder.sensorType;
                        valueReader = SerialDecoderFactory_1.SerialDecoderFactory.createReader(decoderType);
                        decoder = SerialDecoderFactory_1.SerialDecoderFactory.createDecoder(decoderType);
                        this._log('starting loop..');
                        this._isReading = true;
                        _a.label = 2;
                    case 2:
                        if (!this._isReading) return [3 /*break*/, 5];
                        return [4 /*yield*/, valueReader.readValue(serialReader)];
                    case 3:
                        serialValues = _a.sent();
                        return [4 /*yield*/, decoder.decode(serialValues)];
                    case 4:
                        decodedValues = _a.sent();
                        if (decodedValues) {
                            if (sensorType !== decodedValues.sensorType) {
                                this._err("invalid sensor type. expecting ".concat(sensorType, ", but got ").concat(decodedValues.sensorType, "."));
                                return [3 /*break*/, 2];
                            }
                            if (this.onSerialData) {
                                this.onSerialData(decodedValues);
                            }
                        }
                        return [3 /*break*/, 2];
                    case 5:
                        this._log('loop complete..');
                        return [3 /*break*/, 8];
                    case 6:
                        e_2 = _a.sent();
                        this._err('error reading loop startReading', e_2);
                        return [3 /*break*/, 8];
                    case 7:
                        this.stopStage2ClosePortAsync();
                        this._log('startReading complete');
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return SerialService;
}());
var singletonInstance = new SerialService();
exports.default = singletonInstance;
