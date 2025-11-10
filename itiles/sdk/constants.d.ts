export declare const CONFIG: {
    SERVICE_UUID: string;
    CHARACTERISTIC_UUID_RX: string;
    CHARACTERISTIC_UUID_TX: string;
    DEVICE_NAME: string;
    MTU_SIZE: number;
};
export declare enum TX_COMMAND {
    START_BYTE = 170,
    END_BYTE = 239,
    BROADCAST = 1,
    UNPAIR = 4,
    QUERY_PAIRED_TILES = 5,
    QUERY_ONLINE_TILES = 6,
    TRIGGER_LIGHT = 11,
    TRIGGER_SOUND = 12,
    TRIGGER_VIBRATE = 13,
    TRIGGER_SIDE = 14,
    TRIGGER_EFFECT = 15,
    ADVANCE_TRIGGER = 16,
    SUPER_TRIGGER = 22,
    OFF_LIGHT = 17,
    STOP_EFFECT = 28,
    ENABLE_DISABLE_ACCEL = 24,
    SET_ACCEL_THRESHOLD = 25,
    ENABLE_DISABLE_TOUCH = 26,
    TILE_TIMEOUT = 27,
    CLEAR_MAC_LIST = 10,
    GET_BATTERY_LEVEL = 37,
    ASSIGN_FEEDBACK = 36,
    GAME_IN_PROGRESS = 35,
    CONFIRM_ASSIGNMENT = 9
}
export declare enum RX_COMMAND {
    START_BYTE = 170,
    REPLY_PAIRED_TILES = 7,
    REPLY_ONLINE_TILES = 8,
    TOUCH = 18,
    SIDE_UPDATE = 19,
    STEP_CHANGE = 20,
    SHAKE = 21,
    TILE_TIMEOUT = 23,
    REPLY_BATTERY_LEVEL = 38,
    END_BYTE = 239
}
export declare enum CONNECTION_STATE {
    DISCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
    DISCONNECTING = 3
}
export declare enum SELECT_ITILE {
    I = 1,
    II = 2,
    III = 3,
    IV = 4,
    V = 5,
    VI = 6,
    VII = 7,
    VIII = 8,
    IX = 9,
    X = 10,
    XI = 11,
    XII = 12,
    XIII = 13,
    XIV = 14,
    XV = 15,
    XVI = 16,
    ALL = 255
}
export declare enum TILE_SIDE {
    I = 1,
    II = 2,
    III = 3,
    IV = 4,
    V = 5,
    VI = 6
}
export declare enum LOG_REACTION_TIME {
    NONE = 0,
    TOUCH_OR_STEP = 1,
    SHAKE_ONLY = 2,
    TOUCH_OR_STEP_OR_SHAKE = 3,
    SIDE_PARING = 4
}
export declare enum TIMEOUT_DELAY {
    NOPE = 0,
    SEC_1 = 1,
    SEC_2 = 2,
    SEC_3 = 3,
    SEC_4 = 4,
    SEC_5 = 5,
    SEC_10 = 10,
    SEC_15 = 15,
    SEC_20 = 20,
    SEC_30 = 30,
    SEC_40 = 40,
    SEC_45 = 45,
    SEC_90 = 90,
    MIN_1 = 60,
    MIN_2 = 120,
    MIN_3 = 180,
    MIN_4 = 240,
    MIN_4_25 = 255
}
export declare enum TIMEOUT_RESPONSE {
    IMMEDIATE = 0,
    SEC_1 = 1,
    SEC_2 = 2,
    SEC_3 = 3,
    SEC_4 = 4,
    SEC_5 = 5,
    SEC_10 = 10,
    SEC_15 = 15,
    SEC_20 = 20,
    SEC_30 = 30,
    SEC_40 = 40,
    SEC_45 = 45,
    SEC_90 = 90,
    MIN_1 = 60,
    MIN_2 = 120,
    MIN_3 = 180,
    MIN_4 = 240,
    MIN_4_25 = 255
}
export declare enum STEP {
    ON_ITILE = 0,
    OFF_ITILE = 1
}
export declare enum PAIR_STATUS {
    UNPAIRED = 0,
    PAIRED = 1
}
export declare enum VIBRATION_PATTERN {
    NONE = 0,
    I = 1,
    II = 2,
    III = 3,
    IV = 4,
    V = 5,
    VI = 6,
    VII = 7,
    VIII = 8,
    IX = 9
}
export declare enum SOUND_TRACK {
    NONE = 0,
    DEFAULT = 1
}
export declare enum REPEAT_COUNT {
    I = 1,
    II = 2,
    III = 3,
    IV = 4,
    V = 5,
    VI = 6,
    VII = 7,
    VIII = 8,
    IX = 9
}
export declare enum TOGGLE_SENSOR {
    OFF = 0,
    ON = 1
}
export declare enum GAME_STATUS {
    NOT_IN_GAME = 0,
    IN_GAME = 1
}
export declare enum FEEDBACK_STATUS {
    OFF = 0,
    ON = 1
}
export declare enum TILE_TYPE {
    WALL_TILE = 0,
    FLOOR_TILE = 1
}
export declare class TileColor {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number);
    static fromBytes(rgb: number[]): TileColor;
    getBytes(): number[];
    static random(): TileColor;
    static readonly WHITE: TileColor;
    static readonly RED: TileColor;
    static readonly GREEN: TileColor;
    static readonly BLUE: TileColor;
    static readonly CYAN: TileColor;
    static readonly YELLOW: TileColor;
    static readonly MAGENTA: TileColor;
}
export declare class SideColors {
    side1: TileColor;
    side2: TileColor;
    side3: TileColor;
    side4: TileColor;
    side5: TileColor;
    side6: TileColor;
    constructor(side1: TileColor, side2: TileColor, side3: TileColor, side4: TileColor, side5: TileColor, side6: TileColor);
    static fromBytes(colors: number[]): SideColors;
    getBytes(): number[];
    static random(): SideColors;
}
export interface TouchResponse {
    tileId: number;
    reactionTime: number;
}
export interface ShakeResponse {
    tileId: number;
    reactionTime: number;
}
export interface SidePairResponse {
    updatedTileId: number;
    updatedTileSide: number;
    sidePairStatus: number;
}
export interface PairedTilesResponse {
    pairedTileIds: number[];
    pairedTileTotal: number;
}
export interface OnlineTilesResponse {
    tileId: number;
    tileType: number;
    macAddress: number[];
    batteryPercentage: number;
    hardwareVersion: number;
    firmwareVersion: number;
    assignedTileId: number;
}
export interface StepChangeResponse {
    tileId: number;
    stepStatus: number;
}
export interface BatteryStatusResponse {
    batteryPercentage: number;
}
