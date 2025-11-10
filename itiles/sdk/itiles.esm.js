// BLE Configuration
const CONFIG = {
    SERVICE_UUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    CHARACTERISTIC_UUID_RX: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
    CHARACTERISTIC_UUID_TX: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    DEVICE_NAME: 'iTILES',
    MTU_SIZE: 46
};
// TX Commands (App -> Master -> Standard)
var TX_COMMAND;
(function (TX_COMMAND) {
    TX_COMMAND[TX_COMMAND["START_BYTE"] = 170] = "START_BYTE";
    TX_COMMAND[TX_COMMAND["END_BYTE"] = 239] = "END_BYTE";
    // SETUP
    TX_COMMAND[TX_COMMAND["BROADCAST"] = 1] = "BROADCAST";
    TX_COMMAND[TX_COMMAND["UNPAIR"] = 4] = "UNPAIR";
    TX_COMMAND[TX_COMMAND["QUERY_PAIRED_TILES"] = 5] = "QUERY_PAIRED_TILES";
    TX_COMMAND[TX_COMMAND["QUERY_ONLINE_TILES"] = 6] = "QUERY_ONLINE_TILES";
    // IO EVENTS, COMMANDS
    TX_COMMAND[TX_COMMAND["TRIGGER_LIGHT"] = 11] = "TRIGGER_LIGHT";
    TX_COMMAND[TX_COMMAND["TRIGGER_SOUND"] = 12] = "TRIGGER_SOUND";
    TX_COMMAND[TX_COMMAND["TRIGGER_VIBRATE"] = 13] = "TRIGGER_VIBRATE";
    TX_COMMAND[TX_COMMAND["TRIGGER_SIDE"] = 14] = "TRIGGER_SIDE";
    TX_COMMAND[TX_COMMAND["TRIGGER_EFFECT"] = 15] = "TRIGGER_EFFECT";
    TX_COMMAND[TX_COMMAND["ADVANCE_TRIGGER"] = 16] = "ADVANCE_TRIGGER";
    TX_COMMAND[TX_COMMAND["SUPER_TRIGGER"] = 22] = "SUPER_TRIGGER";
    TX_COMMAND[TX_COMMAND["OFF_LIGHT"] = 17] = "OFF_LIGHT";
    TX_COMMAND[TX_COMMAND["STOP_EFFECT"] = 28] = "STOP_EFFECT";
    // SETTINGS, CONFIGS
    TX_COMMAND[TX_COMMAND["ENABLE_DISABLE_ACCEL"] = 24] = "ENABLE_DISABLE_ACCEL";
    TX_COMMAND[TX_COMMAND["SET_ACCEL_THRESHOLD"] = 25] = "SET_ACCEL_THRESHOLD";
    TX_COMMAND[TX_COMMAND["ENABLE_DISABLE_TOUCH"] = 26] = "ENABLE_DISABLE_TOUCH";
    TX_COMMAND[TX_COMMAND["TILE_TIMEOUT"] = 27] = "TILE_TIMEOUT";
    TX_COMMAND[TX_COMMAND["CLEAR_MAC_LIST"] = 10] = "CLEAR_MAC_LIST";
    // UNCATEGORIZED
    TX_COMMAND[TX_COMMAND["GET_BATTERY_LEVEL"] = 37] = "GET_BATTERY_LEVEL";
    TX_COMMAND[TX_COMMAND["ASSIGN_FEEDBACK"] = 36] = "ASSIGN_FEEDBACK";
    TX_COMMAND[TX_COMMAND["GAME_IN_PROGRESS"] = 35] = "GAME_IN_PROGRESS";
    TX_COMMAND[TX_COMMAND["CONFIRM_ASSIGNMENT"] = 9] = "CONFIRM_ASSIGNMENT";
})(TX_COMMAND || (TX_COMMAND = {}));
// RX Commands (Master -> App)
var RX_COMMAND;
(function (RX_COMMAND) {
    RX_COMMAND[RX_COMMAND["START_BYTE"] = 170] = "START_BYTE";
    RX_COMMAND[RX_COMMAND["REPLY_PAIRED_TILES"] = 7] = "REPLY_PAIRED_TILES";
    RX_COMMAND[RX_COMMAND["REPLY_ONLINE_TILES"] = 8] = "REPLY_ONLINE_TILES";
    RX_COMMAND[RX_COMMAND["TOUCH"] = 18] = "TOUCH";
    RX_COMMAND[RX_COMMAND["SIDE_UPDATE"] = 19] = "SIDE_UPDATE";
    RX_COMMAND[RX_COMMAND["STEP_CHANGE"] = 20] = "STEP_CHANGE";
    RX_COMMAND[RX_COMMAND["SHAKE"] = 21] = "SHAKE";
    RX_COMMAND[RX_COMMAND["TILE_TIMEOUT"] = 23] = "TILE_TIMEOUT";
    RX_COMMAND[RX_COMMAND["REPLY_BATTERY_LEVEL"] = 38] = "REPLY_BATTERY_LEVEL";
    RX_COMMAND[RX_COMMAND["END_BYTE"] = 239] = "END_BYTE";
})(RX_COMMAND || (RX_COMMAND = {}));
var CONNECTION_STATE;
(function (CONNECTION_STATE) {
    CONNECTION_STATE[CONNECTION_STATE["DISCONNECTED"] = 0] = "DISCONNECTED";
    CONNECTION_STATE[CONNECTION_STATE["CONNECTING"] = 1] = "CONNECTING";
    CONNECTION_STATE[CONNECTION_STATE["CONNECTED"] = 2] = "CONNECTED";
    CONNECTION_STATE[CONNECTION_STATE["DISCONNECTING"] = 3] = "DISCONNECTING";
})(CONNECTION_STATE || (CONNECTION_STATE = {}));
var SELECT_ITILE;
(function (SELECT_ITILE) {
    SELECT_ITILE[SELECT_ITILE["I"] = 1] = "I";
    SELECT_ITILE[SELECT_ITILE["II"] = 2] = "II";
    SELECT_ITILE[SELECT_ITILE["III"] = 3] = "III";
    SELECT_ITILE[SELECT_ITILE["IV"] = 4] = "IV";
    SELECT_ITILE[SELECT_ITILE["V"] = 5] = "V";
    SELECT_ITILE[SELECT_ITILE["VI"] = 6] = "VI";
    SELECT_ITILE[SELECT_ITILE["VII"] = 7] = "VII";
    SELECT_ITILE[SELECT_ITILE["VIII"] = 8] = "VIII";
    SELECT_ITILE[SELECT_ITILE["IX"] = 9] = "IX";
    SELECT_ITILE[SELECT_ITILE["X"] = 10] = "X";
    SELECT_ITILE[SELECT_ITILE["XI"] = 11] = "XI";
    SELECT_ITILE[SELECT_ITILE["XII"] = 12] = "XII";
    SELECT_ITILE[SELECT_ITILE["XIII"] = 13] = "XIII";
    SELECT_ITILE[SELECT_ITILE["XIV"] = 14] = "XIV";
    SELECT_ITILE[SELECT_ITILE["XV"] = 15] = "XV";
    SELECT_ITILE[SELECT_ITILE["XVI"] = 16] = "XVI";
    SELECT_ITILE[SELECT_ITILE["ALL"] = 255] = "ALL";
})(SELECT_ITILE || (SELECT_ITILE = {}));
var TILE_SIDE;
(function (TILE_SIDE) {
    TILE_SIDE[TILE_SIDE["I"] = 1] = "I";
    TILE_SIDE[TILE_SIDE["II"] = 2] = "II";
    TILE_SIDE[TILE_SIDE["III"] = 3] = "III";
    TILE_SIDE[TILE_SIDE["IV"] = 4] = "IV";
    TILE_SIDE[TILE_SIDE["V"] = 5] = "V";
    TILE_SIDE[TILE_SIDE["VI"] = 6] = "VI";
})(TILE_SIDE || (TILE_SIDE = {}));
var LOG_REACTION_TIME;
(function (LOG_REACTION_TIME) {
    LOG_REACTION_TIME[LOG_REACTION_TIME["NONE"] = 0] = "NONE";
    LOG_REACTION_TIME[LOG_REACTION_TIME["TOUCH_OR_STEP"] = 1] = "TOUCH_OR_STEP";
    LOG_REACTION_TIME[LOG_REACTION_TIME["SHAKE_ONLY"] = 2] = "SHAKE_ONLY";
    LOG_REACTION_TIME[LOG_REACTION_TIME["TOUCH_OR_STEP_OR_SHAKE"] = 3] = "TOUCH_OR_STEP_OR_SHAKE";
    LOG_REACTION_TIME[LOG_REACTION_TIME["SIDE_PARING"] = 4] = "SIDE_PARING";
})(LOG_REACTION_TIME || (LOG_REACTION_TIME = {}));
var TIMEOUT_DELAY;
(function (TIMEOUT_DELAY) {
    TIMEOUT_DELAY[TIMEOUT_DELAY["NOPE"] = 0] = "NOPE";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_1"] = 1] = "SEC_1";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_2"] = 2] = "SEC_2";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_3"] = 3] = "SEC_3";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_4"] = 4] = "SEC_4";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_5"] = 5] = "SEC_5";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_10"] = 10] = "SEC_10";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_15"] = 15] = "SEC_15";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_20"] = 20] = "SEC_20";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_30"] = 30] = "SEC_30";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_40"] = 40] = "SEC_40";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_45"] = 45] = "SEC_45";
    TIMEOUT_DELAY[TIMEOUT_DELAY["SEC_90"] = 90] = "SEC_90";
    TIMEOUT_DELAY[TIMEOUT_DELAY["MIN_1"] = 60] = "MIN_1";
    TIMEOUT_DELAY[TIMEOUT_DELAY["MIN_2"] = 120] = "MIN_2";
    TIMEOUT_DELAY[TIMEOUT_DELAY["MIN_3"] = 180] = "MIN_3";
    TIMEOUT_DELAY[TIMEOUT_DELAY["MIN_4"] = 240] = "MIN_4";
    TIMEOUT_DELAY[TIMEOUT_DELAY["MIN_4_25"] = 255] = "MIN_4_25";
})(TIMEOUT_DELAY || (TIMEOUT_DELAY = {}));
var TIMEOUT_RESPONSE;
(function (TIMEOUT_RESPONSE) {
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["IMMEDIATE"] = 0] = "IMMEDIATE";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_1"] = 1] = "SEC_1";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_2"] = 2] = "SEC_2";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_3"] = 3] = "SEC_3";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_4"] = 4] = "SEC_4";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_5"] = 5] = "SEC_5";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_10"] = 10] = "SEC_10";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_15"] = 15] = "SEC_15";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_20"] = 20] = "SEC_20";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_30"] = 30] = "SEC_30";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_40"] = 40] = "SEC_40";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_45"] = 45] = "SEC_45";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["SEC_90"] = 90] = "SEC_90";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["MIN_1"] = 60] = "MIN_1";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["MIN_2"] = 120] = "MIN_2";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["MIN_3"] = 180] = "MIN_3";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["MIN_4"] = 240] = "MIN_4";
    TIMEOUT_RESPONSE[TIMEOUT_RESPONSE["MIN_4_25"] = 255] = "MIN_4_25";
})(TIMEOUT_RESPONSE || (TIMEOUT_RESPONSE = {}));
var STEP;
(function (STEP) {
    STEP[STEP["ON_ITILE"] = 0] = "ON_ITILE";
    STEP[STEP["OFF_ITILE"] = 1] = "OFF_ITILE";
})(STEP || (STEP = {}));
var PAIR_STATUS;
(function (PAIR_STATUS) {
    PAIR_STATUS[PAIR_STATUS["UNPAIRED"] = 0] = "UNPAIRED";
    PAIR_STATUS[PAIR_STATUS["PAIRED"] = 1] = "PAIRED";
})(PAIR_STATUS || (PAIR_STATUS = {}));
var VIBRATION_PATTERN;
(function (VIBRATION_PATTERN) {
    VIBRATION_PATTERN[VIBRATION_PATTERN["NONE"] = 0] = "NONE";
    VIBRATION_PATTERN[VIBRATION_PATTERN["I"] = 1] = "I";
    VIBRATION_PATTERN[VIBRATION_PATTERN["II"] = 2] = "II";
    VIBRATION_PATTERN[VIBRATION_PATTERN["III"] = 3] = "III";
    VIBRATION_PATTERN[VIBRATION_PATTERN["IV"] = 4] = "IV";
    VIBRATION_PATTERN[VIBRATION_PATTERN["V"] = 5] = "V";
    VIBRATION_PATTERN[VIBRATION_PATTERN["VI"] = 6] = "VI";
    VIBRATION_PATTERN[VIBRATION_PATTERN["VII"] = 7] = "VII";
    VIBRATION_PATTERN[VIBRATION_PATTERN["VIII"] = 8] = "VIII";
    VIBRATION_PATTERN[VIBRATION_PATTERN["IX"] = 9] = "IX";
})(VIBRATION_PATTERN || (VIBRATION_PATTERN = {}));
var SOUND_TRACK;
(function (SOUND_TRACK) {
    SOUND_TRACK[SOUND_TRACK["NONE"] = 0] = "NONE";
    SOUND_TRACK[SOUND_TRACK["DEFAULT"] = 1] = "DEFAULT";
})(SOUND_TRACK || (SOUND_TRACK = {}));
var REPEAT_COUNT;
(function (REPEAT_COUNT) {
    REPEAT_COUNT[REPEAT_COUNT["I"] = 1] = "I";
    REPEAT_COUNT[REPEAT_COUNT["II"] = 2] = "II";
    REPEAT_COUNT[REPEAT_COUNT["III"] = 3] = "III";
    REPEAT_COUNT[REPEAT_COUNT["IV"] = 4] = "IV";
    REPEAT_COUNT[REPEAT_COUNT["V"] = 5] = "V";
    REPEAT_COUNT[REPEAT_COUNT["VI"] = 6] = "VI";
    REPEAT_COUNT[REPEAT_COUNT["VII"] = 7] = "VII";
    REPEAT_COUNT[REPEAT_COUNT["VIII"] = 8] = "VIII";
    REPEAT_COUNT[REPEAT_COUNT["IX"] = 9] = "IX";
})(REPEAT_COUNT || (REPEAT_COUNT = {}));
var TOGGLE_SENSOR;
(function (TOGGLE_SENSOR) {
    TOGGLE_SENSOR[TOGGLE_SENSOR["OFF"] = 0] = "OFF";
    TOGGLE_SENSOR[TOGGLE_SENSOR["ON"] = 1] = "ON";
})(TOGGLE_SENSOR || (TOGGLE_SENSOR = {}));
var GAME_STATUS;
(function (GAME_STATUS) {
    GAME_STATUS[GAME_STATUS["NOT_IN_GAME"] = 0] = "NOT_IN_GAME";
    GAME_STATUS[GAME_STATUS["IN_GAME"] = 1] = "IN_GAME";
})(GAME_STATUS || (GAME_STATUS = {}));
var FEEDBACK_STATUS;
(function (FEEDBACK_STATUS) {
    FEEDBACK_STATUS[FEEDBACK_STATUS["OFF"] = 0] = "OFF";
    FEEDBACK_STATUS[FEEDBACK_STATUS["ON"] = 1] = "ON";
})(FEEDBACK_STATUS || (FEEDBACK_STATUS = {}));
var TILE_TYPE;
(function (TILE_TYPE) {
    TILE_TYPE[TILE_TYPE["WALL_TILE"] = 0] = "WALL_TILE";
    TILE_TYPE[TILE_TYPE["FLOOR_TILE"] = 1] = "FLOOR_TILE";
})(TILE_TYPE || (TILE_TYPE = {}));
// Color and Side Color Classes
class TileColor {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    static fromBytes(rgb) {
        return new TileColor(rgb[0], rgb[1], rgb[2]);
    }
    getBytes() {
        return [this.r, this.g, this.b];
    }
    static random() {
        return new TileColor(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
    }
}
TileColor.WHITE = new TileColor(0x99, 0x99, 0x99);
TileColor.RED = new TileColor(0x99, 0x00, 0x00);
TileColor.GREEN = new TileColor(0x00, 0x99, 0x00);
TileColor.BLUE = new TileColor(0x00, 0x00, 0x99);
TileColor.CYAN = new TileColor(0x00, 0x99, 0x99);
TileColor.YELLOW = new TileColor(0x99, 0x99, 0x00);
TileColor.MAGENTA = new TileColor(0x99, 0x00, 0x99);
class SideColors {
    constructor(side1, side2, side3, side4, side5, side6) {
        this.side1 = side1;
        this.side2 = side2;
        this.side3 = side3;
        this.side4 = side4;
        this.side5 = side5;
        this.side6 = side6;
    }
    static fromBytes(colors) {
        return new SideColors(new TileColor(colors[0], colors[1], colors[2]), new TileColor(colors[3], colors[4], colors[5]), new TileColor(colors[6], colors[7], colors[8]), new TileColor(colors[9], colors[10], colors[11]), new TileColor(colors[12], colors[13], colors[14]), new TileColor(colors[15], colors[16], colors[17]));
    }
    getBytes() {
        return [
            ...this.side1.getBytes(),
            ...this.side2.getBytes(),
            ...this.side3.getBytes(),
            ...this.side4.getBytes(),
            ...this.side5.getBytes(),
            ...this.side6.getBytes()
        ];
    }
    static random() {
        return new SideColors(TileColor.random(), TileColor.random(), TileColor.random(), TileColor.random(), TileColor.random(), TileColor.random());
    }
}

class ITilesBLEManager {
    constructor() {
        this.device = null;
        this.server = null;
        this.service = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.connectionState = CONNECTION_STATE.DISCONNECTED;
        // Check if Web Bluetooth is supported
        if (!navigator.bluetooth) {
            throw new Error('Web Bluetooth API is not supported in this browser');
        }
    }
    // Event Listeners
    onConnectionStateChanged(callback) {
        this.onConnectionStateChangedCallback = callback;
    }
    onDataReceived(callback) {
        this.onDataReceivedCallback = callback;
    }
    onMasterTilesDiscovered(callback) {
        this.onMasterTilesDiscoveredCallback = callback;
    }
    onTouch(callback) {
        this.onTouchCallback = callback;
    }
    onShake(callback) {
        this.onShakeCallback = callback;
    }
    onSidePaired(callback) {
        this.onSidePairedCallback = callback;
    }
    onStepChanged(callback) {
        this.onStepChangedCallback = callback;
    }
    onTileTimedOut(callback) {
        this.onTileTimedOutCallback = callback;
    }
    onPairedTileListReceived(callback) {
        this.onPairedTileListReceivedCallback = callback;
    }
    onOnlineTileStatusReceived(callback) {
        this.onOnlineTileStatusReceivedCallback = callback;
    }
    onBatteryStatusReceived(callback) {
        this.onBatteryStatusReceivedCallback = callback;
    }
    // Connection Methods
    async scan() {
        try {
            const devices = await navigator.bluetooth.getDevices();
            const iTilesDevices = devices.filter(d => d.name === CONFIG.DEVICE_NAME);
            if (this.onMasterTilesDiscoveredCallback) {
                this.onMasterTilesDiscoveredCallback(iTilesDevices);
            }
            return iTilesDevices;
        }
        catch (error) {
            console.error('Error scanning for devices:', error);
            throw error;
        }
    }
    async requestDevice() {
        try {
            this.updateConnectionState(CONNECTION_STATE.CONNECTING);
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ name: CONFIG.DEVICE_NAME }],
                optionalServices: [CONFIG.SERVICE_UUID]
            });
            this.device = device;
            // Listen for disconnection
            device.addEventListener('gattserverdisconnected', () => {
                this.handleDisconnection();
            });
            return device;
        }
        catch (error) {
            this.updateConnectionState(CONNECTION_STATE.DISCONNECTED);
            console.error('Error requesting device:', error);
            throw error;
        }
    }
    async connect(device) {
        try {
            if (device) {
                this.device = device;
            }
            if (!this.device) {
                throw new Error('No device available. Call requestDevice() first.');
            }
            this.updateConnectionState(CONNECTION_STATE.CONNECTING);
            this.server = await this.device.gatt.connect();
            this.updateConnectionState(CONNECTION_STATE.CONNECTED);
            this.service = await this.server.getPrimaryService(CONFIG.SERVICE_UUID);
            // RX is for receiving data FROM the device (we read from it)
            this.rxCharacteristic = await this.service.getCharacteristic(CONFIG.CHARACTERISTIC_UUID_RX);
            // TX is for transmitting data TO the device (we write to it, but also get notifications)
            this.txCharacteristic = await this.service.getCharacteristic(CONFIG.CHARACTERISTIC_UUID_TX);
            console.log('RX Characteristic properties:', this.rxCharacteristic.properties);
            console.log('TX Characteristic properties:', this.txCharacteristic.properties);
            // Verify TX supports writing
            if (!this.txCharacteristic.properties.write && !this.txCharacteristic.properties.writeWithoutResponse) {
                throw new Error('TX Characteristic does not support writing');
            }
            // Start notifications on TX characteristic
            await this.startNotifications();
            console.log('Connected to iTiles device');
        }
        catch (error) {
            this.updateConnectionState(CONNECTION_STATE.DISCONNECTED);
            console.error('Connection error:', error);
            throw error;
        }
    }
    async disconnect() {
        try {
            this.updateConnectionState(CONNECTION_STATE.DISCONNECTING);
            if (this.server && this.server.connected) {
                this.server.disconnect();
            }
            this.handleDisconnection();
        }
        catch (error) {
            console.error('Disconnection error:', error);
            throw error;
        }
    }
    handleDisconnection() {
        this.server = null;
        this.service = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.updateConnectionState(CONNECTION_STATE.DISCONNECTED);
        console.log('Disconnected from iTiles device');
    }
    async startNotifications() {
        // Listen for notifications on RX characteristic (device sends data to us)
        if (!this.rxCharacteristic) {
            throw new Error('RX Characteristic not available');
        }
        if (!this.rxCharacteristic.properties.notify) {
            console.warn('RX Characteristic does not support notifications');
            return;
        }
        try {
            await this.rxCharacteristic.startNotifications();
            this.rxCharacteristic.addEventListener('characteristicvaluechanged', this.handleNotification.bind(this));
            console.log('Notifications started on RX characteristic');
        }
        catch (error) {
            console.error('Error starting notifications:', error);
            throw error;
        }
    }
    handleNotification(event) {
        const characteristic = event.target;
        const value = characteristic.value;
        if (!value)
            return;
        const byteArray = new Uint8Array(value.buffer);
        const hexString = this.bytesToHex(byteArray);
        if (this.onDataReceivedCallback) {
            this.onDataReceivedCallback(hexString);
        }
        this.decodeMessage(byteArray);
    }
    decodeMessage(message) {
        if (message.length < 3)
            return;
        const command = message[2];
        switch (command) {
            case RX_COMMAND.REPLY_PAIRED_TILES:
                this.handlePairedTilesResponse(message);
                break;
            case RX_COMMAND.REPLY_ONLINE_TILES:
                this.handleOnlineTilesResponse(message);
                break;
            case RX_COMMAND.SHAKE:
                this.handleShakeResponse(message);
                break;
            case RX_COMMAND.SIDE_UPDATE:
                this.handleSidePairResponse(message);
                break;
            case RX_COMMAND.STEP_CHANGE:
                this.handleStepChangeResponse(message);
                break;
            case RX_COMMAND.TILE_TIMEOUT:
                if (this.onTileTimedOutCallback) {
                    this.onTileTimedOutCallback();
                }
                break;
            case RX_COMMAND.TOUCH:
                this.handleTouchResponse(message);
                break;
            case RX_COMMAND.REPLY_BATTERY_LEVEL:
                this.handleBatteryStatusResponse(message);
                break;
        }
    }
    handleTouchResponse(message) {
        const response = {
            tileId: message[1],
            reactionTime: ((message[5] << 8) | message[4]) / 1000
        };
        if (this.onTouchCallback) {
            this.onTouchCallback(response);
        }
    }
    handleShakeResponse(message) {
        const response = {
            tileId: message[1],
            reactionTime: ((message[5] << 8) | message[4]) / 1000
        };
        if (this.onShakeCallback) {
            this.onShakeCallback(response);
        }
    }
    handleSidePairResponse(message) {
        const response = {
            updatedTileId: message[1],
            updatedTileSide: message[4],
            sidePairStatus: message[5]
        };
        if (this.onSidePairedCallback) {
            this.onSidePairedCallback(response);
        }
    }
    handlePairedTilesResponse(message) {
        const total = message[4];
        const tileIds = [];
        for (let i = 0; i < total; i++) {
            tileIds.push(message[i + 5]);
        }
        const response = {
            pairedTileIds: tileIds,
            pairedTileTotal: total
        };
        if (this.onPairedTileListReceivedCallback) {
            this.onPairedTileListReceivedCallback(response);
        }
    }
    handleOnlineTilesResponse(message) {
        const macAddress = [];
        for (let i = 0; i < 6; i++) {
            macAddress.push(message[5 + i]);
        }
        const batteryRaw = (message[12] << 8) | message[11];
        const BATTERY_MAX = 420;
        const BATTERY_MIN = 330;
        const batteryPercentage = Math.max(0, Math.min(100, ((batteryRaw - BATTERY_MIN) * 100) / (BATTERY_MAX - BATTERY_MIN)));
        const response = {
            tileId: message[1],
            tileType: message[4],
            macAddress,
            batteryPercentage: Math.round(batteryPercentage),
            hardwareVersion: message[13],
            firmwareVersion: message[14],
            assignedTileId: message[15]
        };
        if (this.onOnlineTileStatusReceivedCallback) {
            this.onOnlineTileStatusReceivedCallback(response);
        }
    }
    handleStepChangeResponse(message) {
        const response = {
            tileId: message[1],
            stepStatus: message[3]
        };
        if (this.onStepChangedCallback) {
            this.onStepChangedCallback(response);
        }
    }
    handleBatteryStatusResponse(message) {
        const batteryRaw = (message[12] << 8) | message[11];
        const BATTERY_MAX = 420;
        const BATTERY_MIN = 330;
        const batteryPercentage = Math.max(0, Math.min(100, ((batteryRaw - BATTERY_MIN) * 100) / (BATTERY_MAX - BATTERY_MIN)));
        const response = {
            batteryPercentage: Math.round(batteryPercentage)
        };
        if (this.onBatteryStatusReceivedCallback) {
            this.onBatteryStatusReceivedCallback(response);
        }
    }
    // Command Methods
    async sendCommand(command, parameters, tileId = SELECT_ITILE.ALL) {
        if (!this.txCharacteristic) {
            throw new Error('Not connected to device');
        }
        const commandPacket = new Uint8Array(5 + parameters.length);
        commandPacket[0] = TX_COMMAND.START_BYTE;
        commandPacket[1] = tileId;
        commandPacket[2] = command;
        commandPacket[3] = parameters.length;
        for (let i = 0; i < parameters.length; i++) {
            commandPacket[4 + i] = parameters[i];
        }
        commandPacket[commandPacket.length - 1] = TX_COMMAND.END_BYTE;
        console.log('Sending command:', this.bytesToHex(commandPacket));
        console.log('Command bytes:', Array.from(commandPacket)); // ADD THIS DEBUG LINE
        try {
            await this.txCharacteristic.writeValue(commandPacket);
            console.log('Command sent successfully'); // ADD THIS DEBUG LINE
        }
        catch (error) {
            console.error('Error sending command:', error);
            throw error;
        }
    }
    async pairTiles(masterTileMacAddress, tileId = SELECT_ITILE.ALL) {
        await this.sendCommand(TX_COMMAND.BROADCAST, masterTileMacAddress, tileId);
    }
    async unpairTile(tileId) {
        await this.sendCommand(TX_COMMAND.UNPAIR, [], tileId);
    }
    async clearMacList() {
        await this.sendCommand(TX_COMMAND.CLEAR_MAC_LIST, []);
    }
    async queryPairedTiles() {
        await this.sendCommand(TX_COMMAND.QUERY_PAIRED_TILES, []);
    }
    async queryOnlineTiles(tileId = SELECT_ITILE.ALL) {
        await this.sendCommand(TX_COMMAND.QUERY_ONLINE_TILES, [], tileId);
    }
    async triggerLight(color, offAfterSeconds, logReactionTime, timeoutResponse, tileId) {
        const parameters = [
            color.r,
            color.g,
            color.b,
            offAfterSeconds,
            logReactionTime,
            timeoutResponse
        ];
        await this.sendCommand(TX_COMMAND.TRIGGER_LIGHT, parameters, tileId);
    }
    async triggerSound(soundTrackId, repeatCount, logReactionTime, timeoutResponse, tileId) {
        const parameters = [soundTrackId, repeatCount, logReactionTime, timeoutResponse];
        await this.sendCommand(TX_COMMAND.TRIGGER_SOUND, parameters, tileId);
    }
    async triggerVibration(vibrationPattern, repeatCount, logReactionTime, timeoutResponse, tileId) {
        const parameters = [vibrationPattern, repeatCount, logReactionTime, timeoutResponse];
        await this.sendCommand(TX_COMMAND.TRIGGER_VIBRATE, parameters, tileId);
    }
    async triggerSideLight(sideColors, offAfterSeconds, logReactionTime, timeoutResponse, tileId) {
        const colors = sideColors.getBytes();
        const parameters = [...colors, offAfterSeconds, logReactionTime, timeoutResponse];
        await this.sendCommand(TX_COMMAND.TRIGGER_SIDE, parameters, tileId);
    }
    async triggerLightSoundVibration(lightColor, timeoutDelay, soundTrackId, vibrationPattern, repeatCount, logReactionTime, timeoutResponse, tileId) {
        const parameters = [
            lightColor.r,
            lightColor.g,
            lightColor.b,
            timeoutDelay,
            soundTrackId,
            0x00, // not implemented
            vibrationPattern,
            repeatCount,
            logReactionTime,
            timeoutResponse
        ];
        await this.sendCommand(TX_COMMAND.ADVANCE_TRIGGER, parameters, tileId);
    }
    async triggerSideLightSoundVibration(sideColors, timeoutDelay, soundTrackId, vibrationPattern, repeatCount, logReactionTime, timeoutResponse, tileId) {
        const colors = sideColors.getBytes();
        const parameters = [
            ...colors,
            timeoutDelay,
            soundTrackId,
            0x00, // not implemented
            vibrationPattern,
            repeatCount,
            logReactionTime,
            timeoutResponse
        ];
        await this.sendCommand(TX_COMMAND.SUPER_TRIGGER, parameters, tileId);
    }
    async turnOffLight(tileId) {
        await this.sendCommand(TX_COMMAND.OFF_LIGHT, [], tileId);
    }
    async stopEffect(tileId) {
        await this.sendCommand(TX_COMMAND.STOP_EFFECT, [], tileId);
    }
    async toggleShakeSensor(toggle, tileId) {
        await this.sendCommand(TX_COMMAND.ENABLE_DISABLE_ACCEL, [toggle], tileId);
    }
    async setShakeThreshold(threshold, tileId) {
        await this.sendCommand(TX_COMMAND.SET_ACCEL_THRESHOLD, [threshold], tileId);
    }
    async toggleTouchSensor(toggle, tileId) {
        await this.sendCommand(TX_COMMAND.ENABLE_DISABLE_TOUCH, [toggle], tileId);
    }
    async confirmAssignment(tileId) {
        await this.sendCommand(TX_COMMAND.CONFIRM_ASSIGNMENT, [], tileId);
    }
    async gameInProgress(gameStatus, tileId) {
        await this.sendCommand(TX_COMMAND.GAME_IN_PROGRESS, [gameStatus], tileId);
    }
    async assignFeedback(feedbackStatus, color, soundTrackId, vibrationPattern, timeoutDelay, tileId) {
        const parameters = [
            feedbackStatus,
            color.r,
            color.g,
            color.b,
            soundTrackId,
            vibrationPattern,
            timeoutDelay
        ];
        await this.sendCommand(TX_COMMAND.ASSIGN_FEEDBACK, parameters, tileId);
    }
    async getBattery(tileId) {
        await this.sendCommand(TX_COMMAND.GET_BATTERY_LEVEL, [], tileId);
    }
    // Utility Methods
    updateConnectionState(state) {
        this.connectionState = state;
        if (this.onConnectionStateChangedCallback) {
            this.onConnectionStateChangedCallback(state);
        }
    }
    getConnectionState() {
        return this.connectionState;
    }
    isConnected() {
        return this.connectionState === CONNECTION_STATE.CONNECTED &&
            this.server !== null &&
            this.server.connected;
    }
    bytesToHex(bytes) {
        return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0').toUpperCase())
            .join(':');
    }
    static hexToBytes(hex) {
        hex = hex.replace(/:/g, '');
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        }
        return bytes;
    }
}

export { CONFIG, CONNECTION_STATE, FEEDBACK_STATUS, GAME_STATUS, ITilesBLEManager, LOG_REACTION_TIME, PAIR_STATUS, REPEAT_COUNT, RX_COMMAND, SELECT_ITILE, SOUND_TRACK, STEP, SideColors, TILE_SIDE, TILE_TYPE, TIMEOUT_DELAY, TIMEOUT_RESPONSE, TOGGLE_SENSOR, TX_COMMAND, TileColor, VIBRATION_PATTERN };
//# sourceMappingURL=itiles.esm.js.map
