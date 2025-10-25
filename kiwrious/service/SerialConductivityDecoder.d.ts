import { SensorReadResult } from "../data/SensorReadResult";
import { SerialDecoder } from "./SerialDecoder";
import { SerialRawValue } from "./SerialRawValue";
export declare const CONDUCTIVITY_RESULT_STATUS: {
    MAX: string;
    MIN: string;
    READY: string;
};
export interface ConductivityResult {
    status: string;
    value: number | string;
}
export declare class ConductivitySerialDecoder extends SerialDecoder {
    constructor();
    _log(...msg: any): void;
    decode(rawValues: SerialRawValue[]): Promise<SensorReadResult | null>;
    private static calculateConductivity;
}
