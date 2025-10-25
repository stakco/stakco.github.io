export declare const HEART_RATE_RESULT_STATUS: {
    TOO_LOW: string;
    TOO_HIGH: string;
    PROCESSING: string;
    READY: string;
};
export interface HeartRateResult {
    status: string;
    value?: number;
}
export declare class HeartRateProcessor {
    private _filters;
    private _resultArray;
    private _inputArray;
    private _xf;
    constructor();
    private _log;
    private _initFilters;
    getStatusForInput(input: number): string;
    processSingleInput(input: number): HeartRateResult;
    processMultiInput(inputArray: number[]): HeartRateResult;
    process(): number | null;
    private _process;
    private _updateAllFilters;
}
