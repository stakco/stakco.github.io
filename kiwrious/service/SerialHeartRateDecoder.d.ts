import { SensorReadResult } from "../data/SensorReadResult";
import { HeartRateProcessor } from "./HeartRateProcessor";
import { SerialDecoder } from "./SerialDecoder";
import { SerialRawValue } from "./SerialRawValue";
export declare class SerialHeartRateDecoder extends SerialDecoder {
    _processor: HeartRateProcessor;
    constructor();
    _log(...msg: any): void;
    decode(rawValues: SerialRawValue[]): Promise<SensorReadResult | null>;
}
