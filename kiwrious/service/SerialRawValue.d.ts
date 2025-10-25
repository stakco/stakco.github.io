import { SerialHexValue } from "./SerialHexValue";
export declare const SENSOR_TYPE: {
    UNKNOWN: string;
    UV: string;
    UV2: string;
    HUMIDITY: string;
    VOC: string;
    CONDUCTIVITY: string;
    HEART_RATE: string;
    HEART_RATE2: string;
    TEMPERATURE: string;
    TEMPERATURE2: string;
};
export declare const SENSOR_VALUE: {
    UNKNOWN: string;
    UV_INDEX: string;
    LUX: string;
    HUMIDITY: string;
    TEMPERATURE: string;
    VOC: string;
    CONDUCTIVITY: string;
    HEART_RATE: string;
    INFRARED_TEMPERATURE: string;
    AMBIENT_TEMPERATURE: string;
};
export declare const LATEST_SENSOR_VERSION: Map<string, number | undefined>;
export declare class SerialRawValue {
    rawValue: Uint8Array;
    dataView: DataView;
    constructor(rawValue: Uint8Array);
    get isValidLength(): boolean;
    get sensorTypeRaw(): number;
    get header2Bytes(): number;
    get sequence2Bytes(): number;
    get footer2Bytes(): number;
    get decoderType(): string;
    get isFirmwareOutdated(): boolean;
    get sensorType(): string;
    getTwoBytesSignedByIndex(index: number): number;
    getTwoBytesUnsignedByIndex(index: number): number;
    getTwoBytesByIndex(index: number): number;
    getFourBytesByIndex(index: number): number;
    getFourBytesFloatByIndex(index: number): number;
    sliceBytes(index: number, numberOfBytes: number): Uint8Array;
    getByteByIndex(index: number): number;
    getHexDigitByIndex(index: number): string;
    getHexString2(index0: number, index1: number): SerialHexValue;
    getHexString4(index0: number, index1: number, index2: number, index3: number): SerialHexValue;
}
