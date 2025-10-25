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
exports.HeartRateProcessor = exports.HEART_RATE_RESULT_STATUS = void 0;
var fft = require('jsfft');
var MIN_INPUT_VALUE = 300000;
var MAX_INPUT_VALUE = 900000;
var SAMPLE_RATE = 200;
var INPUT_ARRAY_SIZE = 2048;
var RESULT_ARRAY_SIZE = 100;
var SOS = [
    [[1.0000, 0, -1.0000], [1.0000, -1.9794, 0.9847]],
    [[1.0000, 0, -1.0000], [1.0000, -1.9948, 0.9953]],
    [[1.0000, 0, -1.0000], [1.0000, -1.9537, 0.9583]],
    [[1.0000, 0, -1.0000], [1.0000, -1.9849, 0.9855]],
    [[1.0000, 0, -1.0000], [1.0000, -1.9730, 0.9737]],
    [[1.0000, 0, -1.0000], [1.0000, -1.9392, 0.9426]],
    [[1.0000, 0, -1.0000], [1.0000, -1.9571, 0.9583]],
    [[1.0000, 0, -1.0000], [1.0000, -1.9410, 0.9432]]
];
var GAIN = [0.0256, 0.0256, 0.0254, 0.0254, 0.0252, 0.0252, 0.0251, 0.0251, 1.0000];
exports.HEART_RATE_RESULT_STATUS = {
    TOO_LOW: 'TOO_LOW',
    TOO_HIGH: 'TOO_HIGH',
    PROCESSING: 'PROCESSING',
    READY: 'READY',
};
var FixedArray = /** @class */ (function () {
    function FixedArray(size) {
        this._size = size;
        this._array = [];
        this._sum = 0;
    }
    FixedArray.prototype._log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(['|FixedArray|'], msg, false));
    };
    Object.defineProperty(FixedArray.prototype, "isAverageReady", {
        get: function () {
            return this._array.length >= this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FixedArray.prototype, "average", {
        get: function () {
            return FixedArray.calcAverage(this._sum, this._array.length);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FixedArray.prototype, "array", {
        get: function () {
            return this._array;
        },
        enumerable: false,
        configurable: true
    });
    FixedArray.prototype._cleanup = function () {
        while (this._array.length > this._size) {
            var removed = this._array.shift();
            if (removed) {
                this._sum -= removed;
            }
        }
    };
    FixedArray.prototype._add = function (item) {
        this._array.push(item);
        this._sum += item;
    };
    FixedArray.prototype.add = function (item) {
        this._add(item);
        this._cleanup();
    };
    FixedArray.prototype.addItems = function (items) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var i = items_1[_i];
            this._add(i);
        }
        this._cleanup();
    };
    FixedArray.calcSum = function (array) {
        return array.reduce(function (item, curr) { return item + curr; }, 0);
    };
    FixedArray.calcAverage = function (sum, length) {
        if (!length) {
            return 0;
        }
        return sum / length;
    };
    FixedArray.createSteppedArray = function (startValue, stopValue, cardinality) {
        var arr = [];
        var step = (stopValue - startValue) / (cardinality - 1);
        for (var i = 0; i < cardinality; i++) {
            arr.push(startValue + (step * i));
        }
        return arr;
    };
    return FixedArray;
}());
// Biquad filter object
var Biquad = /** @class */ (function () {
    // Biquad direct form II representation, g1 and g2 are input and output gains respectively
    function Biquad(b, a, g1, g2) {
        this.b = b;
        this.a = a;
        this.g1 = g1;
        this.g2 = g2;
        this.w = [1, 1, 1];
    }
    Biquad.prototype._log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(['|Biquad|'], msg, false));
    };
    Biquad.prototype.updateFilter = function (x) {
        var xGained = x * this.g1;
        this.w[2] = this.w[1];
        this.w[1] = this.w[0];
        this.w[0] = xGained - this.a[1] * this.w[1] - this.a[2] * this.w[2];
        var y = this.b[0] * this.w[0] + this.b[1] * this.w[1] + this.b[2] * this.w[2];
        var yGained = y * this.g2;
        return yGained;
    };
    return Biquad;
}());
var HeartRateProcessor = /** @class */ (function () {
    function HeartRateProcessor() {
        this._log('ctor');
        this._initFilters();
        var halfSampleRate = Math.floor(SAMPLE_RATE / 2);
        this._resultArray = new FixedArray(RESULT_ARRAY_SIZE);
        this._inputArray = new FixedArray(INPUT_ARRAY_SIZE);
        var L = INPUT_ARRAY_SIZE;
        var halfL = Math.floor(L / 2);
        this._xf = FixedArray.createSteppedArray(0, halfSampleRate, halfL);
    }
    HeartRateProcessor.prototype._log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(['|HeartRateProcessor|'], msg, false));
    };
    HeartRateProcessor.prototype._initFilters = function () {
        this._filters = SOS.map(function (s, i) { return new Biquad(s[0], s[1], GAIN[i], 1); });
    };
    HeartRateProcessor.prototype.getStatusForInput = function (input) {
        if (input < MIN_INPUT_VALUE) {
            return exports.HEART_RATE_RESULT_STATUS.TOO_LOW;
        }
        else if (input > MAX_INPUT_VALUE) {
            return exports.HEART_RATE_RESULT_STATUS.TOO_HIGH;
        }
        return exports.HEART_RATE_RESULT_STATUS.PROCESSING;
    };
    HeartRateProcessor.prototype.processSingleInput = function (input) {
        var status = this.getStatusForInput(input);
        if (status !== exports.HEART_RATE_RESULT_STATUS.PROCESSING) {
            var result_1 = { status: status };
            return result_1;
        }
        this._inputArray.add(input);
        var output = this.process();
        if (!output) {
            var result_2 = { status: exports.HEART_RATE_RESULT_STATUS.PROCESSING };
            return result_2;
        }
        var result = { status: exports.HEART_RATE_RESULT_STATUS.READY, value: output };
        return result;
    };
    HeartRateProcessor.prototype.processMultiInput = function (inputArray) {
        for (var _i = 0, inputArray_1 = inputArray; _i < inputArray_1.length; _i++) {
            var input = inputArray_1[_i];
            var status_1 = this.getStatusForInput(input);
            if (status_1 !== exports.HEART_RATE_RESULT_STATUS.PROCESSING) {
                var result_3 = { status: status_1 };
                return result_3;
            }
        }
        this._inputArray.addItems(inputArray);
        var output = this.process();
        if (!output) {
            var result_4 = { status: exports.HEART_RATE_RESULT_STATUS.PROCESSING };
            return result_4;
        }
        var result = { status: exports.HEART_RATE_RESULT_STATUS.READY, value: output };
        return result;
    };
    HeartRateProcessor.prototype.process = function () {
        if (!this._inputArray.isAverageReady) {
            return null;
        }
        var heartRate = this._process(this._inputArray);
        if (!heartRate) {
            return null;
        }
        this._resultArray.add(heartRate);
        if (!this._resultArray.isAverageReady) {
            return null;
        }
        return this._resultArray.average;
    };
    HeartRateProcessor.prototype._process = function (inputArray) {
        var _this = this;
        if (!inputArray.isAverageReady) {
            throw new Error("average is not ready. arr len: ".concat(inputArray.array.length));
        }
        var filtered = inputArray.array.map(function (value) {
            var adjustedV = value - inputArray.average;
            return _this._updateAllFilters(adjustedV);
        });
        var dataFFT = new fft.ComplexArray(filtered.length).map(function (value, i, n) {
            value.real = filtered[i];
        });
        var spectrum = dataFFT.FFT();
        var mag = spectrum.magnitude();
        var minVal = 0;
        var minIndex = 0;
        for (var index = 0; index < mag.length / 2; index++) {
            var element = mag[index];
            if (element > minVal) {
                minVal = element;
                minIndex = index;
            }
        }
        var heartRate = this._xf[minIndex] * 60;
        return heartRate;
    };
    HeartRateProcessor.prototype._updateAllFilters = function (input) {
        var output;
        var current = input;
        for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
            var f = _a[_i];
            output = f.updateFilter(current);
            current = output;
        }
        return output;
    };
    return HeartRateProcessor;
}());
exports.HeartRateProcessor = HeartRateProcessor;
