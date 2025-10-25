import { SensorReadResult } from "../data/SensorReadResult";
import { HeartRateProcessor } from "./HeartRateProcessor";
import { MinValueThreshold } from "./MinValueThreshold";
import { SerialDecoder } from "./SerialDecoder";
import { SerialRawValue } from "./SerialRawValue";
export declare class SerialHeartRate2Decoder extends SerialDecoder {
    _processor: HeartRateProcessor;
    _detector: any;
    _thresholdChecker: MinValueThreshold;
    _postProcessor: HeartRateValuePostProcessor;
    constructor();
    _log(...msg: any): void;
    decode(array: SerialRawValue[]): Promise<SensorReadResult | null>;
}
declare class HeartRateValuePostProcessor {
    _wasReady: boolean;
    process(heartrateValue: any): any;
}
export {};
