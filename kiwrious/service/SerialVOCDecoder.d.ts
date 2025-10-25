import { SensorReadResult } from "../data/SensorReadResult";
import { SerialDecoder } from "./SerialDecoder";
import { SerialRawValue } from "./SerialRawValue";
export declare class VOCSerialDecoder extends SerialDecoder {
    private _hasStartedWaitingForData;
    private _dataReadyPercentage;
    private _dataReadyIntervalId;
    private _incrementPercentage;
    constructor();
    decode(rawValues: SerialRawValue[]): Promise<SensorReadResult | null>;
    private clearIntervalIfRunning;
    private startIntervalForDataReady;
    private runOneInterval;
}
export declare const VOC_RESULT_STATUS: {
    PROCESSING: string;
    READY: string;
};
export interface VocResult {
    dataReadyPercentage: number;
    status: string;
    value?: number;
}
