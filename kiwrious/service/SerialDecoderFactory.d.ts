import { SerialDecoder } from "./SerialDecoder";
import { ValueReader } from "./ValueReader";
export declare class SerialDecoderFactory {
    static _log(...msg: any): void;
    static _err(...msg: any): void;
    static createDecoder(type: string): SerialDecoder;
    static createReader(type: string): ValueReader;
}
