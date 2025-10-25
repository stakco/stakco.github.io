import { SensorReadResult } from "../data/SensorReadResult";
import { SerialRawValue } from "./SerialRawValue";
export declare abstract class SerialDecoder {
    constructor();
    _log(...msg: any): void;
    _err(...msg: any): void;
    abstract decode(rawValue: SerialRawValue[]): Promise<SensorReadResult | null>;
}
