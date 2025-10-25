"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinValueThreshold = void 0;
var MinValueThreshold = /** @class */ (function () {
    function MinValueThreshold() {
        this.LOW_THRESHOLD = 1e5;
        this.HIGH_THRESHOLD = 2e6;
        this._isAboveHigh = false;
    }
    MinValueThreshold.prototype.check = function (value) {
        if (value > this.HIGH_THRESHOLD) {
            this._isAboveHigh = true;
            return true;
        }
        if (this._isAboveHigh) {
            if (value > this.LOW_THRESHOLD) {
                // still above low
                return true;
            }
            else {
                this._isAboveHigh = false;
                return false;
            }
        }
        // not reached high yet
        return false;
    };
    return MinValueThreshold;
}());
exports.MinValueThreshold = MinValueThreshold;
