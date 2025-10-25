import { SensorReadResult } from "../data/SensorReadResult";
declare class SerialService {
    onSerialData?: (data: SensorReadResult) => void;
    onSerialConnection?: (connect: boolean) => void;
    onFirmwareUpdateAvailable?: (outdated: boolean) => void;
    private _isConnected;
    private _isReading;
    private _port;
    private _reader;
    constructor();
    private _log;
    private _err;
    private _warn;
    get isReading(): boolean;
    get canResumeReading(): boolean;
    triggerStopReading(): void;
    private closeReader;
    private closePortAsync;
    resumeReading(): Promise<void>;
    disconnectAsync(): Promise<void>;
    connectAndReadAsync(): Promise<void>;
    private startStage1RequestPortAsync;
    private startStage2ConnectPortAsync;
    private stopStage2ClosePortAsync;
    private connectPortAsync;
    private startReading;
}
declare const singletonInstance: SerialService;
export default singletonInstance;
