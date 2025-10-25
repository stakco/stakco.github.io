import { SerialRawValue } from "./SerialRawValue";
export declare class SerialReader {
    private _array;
    private readonly _reader;
    constructor(reader: ReadableStreamDefaultReader);
    _log(...msg: any): void;
    _err(...msg: any): void;
    private _read;
    readMultiple(numberToRead?: number): Promise<SerialRawValue[]>;
    readOnce(): Promise<SerialRawValue>;
}
