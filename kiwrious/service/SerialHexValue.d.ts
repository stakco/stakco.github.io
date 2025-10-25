export declare class SerialHexValue {
    rawHexValue: string;
    constructor(rawHexValue: string);
    toFloat(): number;
    toInt(): number;
    divideByHundred(): number;
}
export declare class SerialNumberValue {
    private readonly _raw;
    constructor(value: number);
    get value(): number;
    toInt(): number;
    divideByHundred(): number;
}
