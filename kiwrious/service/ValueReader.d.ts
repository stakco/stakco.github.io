import { SerialRawValue } from "./SerialRawValue";
import { SerialReader } from "./SerialReader";
export declare abstract class ValueReader {
    abstract readValue(serialReader: SerialReader): Promise<SerialRawValue[]>;
}
export declare class SingleValueReader {
    readValue(serialReader: SerialReader): Promise<SerialRawValue[]>;
}
export declare class TenValuesReader {
    readValue(serialReader: SerialReader): Promise<SerialRawValue[]>;
}
