import { SensorReadResult } from "../data/SensorReadResult";
import { SerialDecoder } from "./SerialDecoder";
import { SerialRawValue } from "./SerialRawValue";
export declare class UVSerialDecoder extends SerialDecoder {
    constructor();
    _log(...msg: any): void;
    decode(rawValues: SerialRawValue[]): Promise<SensorReadResult | null>;
}
