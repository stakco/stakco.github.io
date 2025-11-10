# iTiles Web Bluetooth

> Control iTiles interactive floor and wall tiles directly from your browser using Web Bluetooth API.

[![npm version](https://img.shields.io/npm/v/@itiles/itiles-web-bluetooth.svg)](https://www.npmjs.com/package/@itiles/itiles-web-bluetooth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔌 **Web Bluetooth Integration** - Connect directly from Chrome, Edge, or Opera
- 💡 **Full Control** - Lights, sounds, vibrations, and sensors
- 🎯 **Real-time Events** - Touch, shake, and step detection callbacks
- 📊 **Status Monitoring** - Battery levels and tile status
- 🔋 **Auto-Pairing** - Automatic tile discovery and pairing
- 📦 **TypeScript Support** - Complete type definitions included
- 🎮 **Easy API** - Consistent with Unity/Android implementations

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 56+     | ✅ Full Support |
| Edge    | 79+     | ✅ Full Support |
| Opera   | 43+     | ✅ Full Support |
| Chrome Android | Latest | ✅ Full Support |
| Firefox | -       | ⚠️ Requires Flag |
| Safari  | -       | ❌ Not Supported |

**Requirements:**
- HTTPS connection (or localhost for development)
- User gesture required for initial connection

## Installation

```bash
npm install @itiles/itiles-web-bluetooth
```

use directly via NPM CDN (Not available until Digital Dreams grants permission)

```html
<script type="module">
  import { ITilesBLEManager } from 'https://unpkg.com/@itiles/itiles-web-bluetooth/dist/itiles.esm.js';
</script>
```

use directly via stakco CDN (Available strictly for AHL in-house use)
```html
<script type="module">
  import { ITilesBLEManager } from 'https://stakcos.com/itiles/itiles.esm.js';
</script>
```

## Quick Start

```javascript

// If lib is delivered over npm
import { 
  ITilesBLEManager, 
  TileColor, 
  SELECT_ITILE,
  TIMEOUT_DELAY,
  LOG_REACTION_TIME,
  TIMEOUT_RESPONSE
} from '@itiles/itiles-web-bluetooth';

// If lib is delivered over cdn
import { 
  ITilesBLEManager, 
  TileColor, 
  SELECT_ITILE,
  TIMEOUT_DELAY,
  LOG_REACTION_TIME,
  TIMEOUT_RESPONSE
} from 'https://stakcos.com/itiles/itiles.esm.js';

// Create manager instance
const manager = new ITilesBLEManager();

// Setup event listeners
manager.onConnectionStateChanged((state) => {
  if (state === 2) console.log('Connected!');
});

manager.onTouch((response) => {
  console.log(`Tile ${response.tileId} touched! Reaction: ${response.reactionTime}s`);
});

// Connect to device
await manager.requestDevice();  // Opens browser device picker
await manager.connect();

// Light up tile 1 in red for 5 seconds
const red = new TileColor(153, 0, 0);
await manager.triggerLight(
  red,
  TIMEOUT_DELAY.SEC_5,
  LOG_REACTION_TIME.TOUCH_OR_STEP,
  TIMEOUT_RESPONSE.IMMEDIATE,
  SELECT_ITILE.I
);
```

## Basic Examples

### Connect and Disconnect

```javascript
import { ITilesBLEManager, CONNECTION_STATE } from '@itiles/itiles-web-bluetooth';

const manager = new ITilesBLEManager();

// Monitor connection state
manager.onConnectionStateChanged((state) => {
  const states = ['Disconnected', 'Connecting', 'Connected', 'Disconnecting'];
  console.log('State:', states[state]);
});

// Connect
await manager.requestDevice();
await manager.connect();

// Check connection
if (manager.isConnected()) {
  console.log('Ready to control tiles!');
}

// Disconnect
await manager.disconnect();
```

### Light Control

```javascript
import { TileColor, TIMEOUT_DELAY, SELECT_ITILE } from '@itiles/itiles-web-bluetooth';

// Solid colors on specific tiles
const green = new TileColor(0, 153, 0);
await manager.triggerLight(green, TIMEOUT_DELAY.SEC_10, 0, 0, SELECT_ITILE.I);

// Use predefined colors
await manager.triggerLight(TileColor.BLUE, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.II);
await manager.triggerLight(TileColor.YELLOW, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.III);

// Light up all tiles
await manager.triggerLight(TileColor.RED, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.ALL);

// Turn off lights
await manager.turnOffLight(SELECT_ITILE.ALL);
```

### Multi-Color Side Lighting

```javascript
import { SideColors, TileColor } from '@itiles/itiles-web-bluetooth';

// Create rainbow effect on tile sides
const rainbow = new SideColors(
  TileColor.RED,      // Side 1
  TileColor.YELLOW,   // Side 2
  TileColor.GREEN,    // Side 3
  TileColor.CYAN,     // Side 4
  TileColor.BLUE,     // Side 5
  TileColor.MAGENTA   // Side 6
);

await manager.triggerSideLight(
  rainbow,
  TIMEOUT_DELAY.SEC_10,
  LOG_REACTION_TIME.TOUCH_OR_STEP,
  TIMEOUT_RESPONSE.IMMEDIATE,
  SELECT_ITILE.I
);
```

### Sound and Vibration

```javascript
import { SOUND_TRACK, VIBRATION_PATTERN, REPEAT_COUNT } from '@itiles/itiles-web-bluetooth';

// Play sound
await manager.triggerSound(
  SOUND_TRACK.DEFAULT,
  REPEAT_COUNT.I,
  0, 0,
  SELECT_ITILE.ALL
);

// Trigger vibration (3 times)
await manager.triggerVibration(
  VIBRATION_PATTERN.I,
  REPEAT_COUNT.III,
  0, 0,
  SELECT_ITILE.ALL
);

// Combined effect: Light + Sound + Vibration
await manager.triggerLightSoundVibration(
  TileColor.BLUE,
  TIMEOUT_DELAY.SEC_5,
  SOUND_TRACK.DEFAULT,
  VIBRATION_PATTERN.II,
  REPEAT_COUNT.I,
  LOG_REACTION_TIME.TOUCH_OR_STEP,
  TIMEOUT_RESPONSE.IMMEDIATE,
  SELECT_ITILE.ALL
);
```

### Sensor Events

```javascript
import { TOGGLE_SENSOR } from '@itiles/itiles-web-bluetooth';

// Enable touch sensor
await manager.toggleTouchSensor(TOGGLE_SENSOR.ON, SELECT_ITILE.ALL);

// Enable shake sensor
await manager.toggleShakeSensor(TOGGLE_SENSOR.ON, SELECT_ITILE.ALL);

// Set shake sensitivity (0-255, lower = more sensitive)
await manager.setShakeThreshold(50, SELECT_ITILE.ALL);

// Listen for touch events
manager.onTouch((response) => {
  console.log(`Tile ${response.tileId} touched!`);
  console.log(`Reaction time: ${response.reactionTime.toFixed(3)}s`);
});

// Listen for shake events
manager.onShake((response) => {
  console.log(`Tile ${response.tileId} shaken!`);
  console.log(`Reaction time: ${response.reactionTime.toFixed(3)}s`);
});

// Listen for step events
manager.onStepChanged((response) => {
  const status = response.stepStatus === 0 ? 'ON' : 'OFF';
  console.log(`Step ${status} tile ${response.tileId}`);
});
```

### Auto-Pairing Tiles

```javascript
import { GAME_STATUS } from '@itiles/itiles-web-bluetooth';

// Complete auto-pairing workflow
async function pairAllTiles() {
  console.log('Starting auto-discovery...');
  
  // Step 1: Discover online tiles (triggers auto-pairing)
  await manager.queryOnlineTiles(SELECT_ITILE.ALL);
  
  // Step 2: Wait 20 seconds for tiles to register
  console.log('Waiting 20 seconds for tiles to pair...');
  await new Promise(resolve => setTimeout(resolve, 20000));
  
  // Step 3: Confirm assignments
  await manager.confirmAssignment(SELECT_ITILE.ALL);
  
  // Step 4: Activate tiles (set game mode)
  for (let i = 1; i <= 6; i++) {
    await manager.gameInProgress(GAME_STATUS.IN_GAME, i);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Step 5: Query paired tiles to verify
  await manager.queryPairedTiles();
  
  console.log('Pairing complete!');
}

// Listen for paired tiles response
manager.onPairedTileListReceived((response) => {
  console.log(`Paired tiles (${response.pairedTileTotal}):`, response.pairedTileIds);
});

// Listen for online tiles info
manager.onOnlineTileStatusReceived((response) => {
  console.log(`Tile ${response.tileId} online`);
  console.log(`Battery: ${response.batteryPercentage}%`);
  console.log(`Hardware: v${response.hardwareVersion}`);
  console.log(`Firmware: v${response.firmwareVersion}`);
});

// Start pairing
await pairAllTiles();
```

### Battery Monitoring

```javascript
// Request battery status
await manager.getBattery(SELECT_ITILE.ALL);

// Listen for battery responses
manager.onBatteryStatusReceived((response) => {
  console.log(`Battery: ${response.batteryPercentage}%`);
  
  if (response.batteryPercentage < 20) {
    console.warn('Low battery!');
  }
});

// Get battery info during online query
manager.onOnlineTileStatusReceived((response) => {
  console.log(`Tile ${response.tileId}: ${response.batteryPercentage}%`);
});
```

## API Reference

### ITilesBLEManager

Main class for managing BLE connection and tile control.

#### Connection Methods

| Method | Description |
|--------|-------------|
| `requestDevice()` | Opens browser device picker, returns selected device |
| `connect(device?)` | Connects to selected device |
| `disconnect()` | Disconnects from current device |
| `isConnected()` | Returns true if connected |
| `getConnectionState()` | Returns current CONNECTION_STATE |

#### Tile Control Methods

| Method | Description |
|--------|-------------|
| `triggerLight(color, duration, logReaction, timeoutResponse, tileId)` | Solid color light |
| `triggerSideLight(sideColors, duration, logReaction, timeoutResponse, tileId)` | Multi-color sides |
| `triggerSound(sound, repeat, logReaction, timeoutResponse, tileId)` | Play sound |
| `triggerVibration(pattern, repeat, logReaction, timeoutResponse, tileId)` | Vibration |
| `triggerLightSoundVibration(...)` | Combined effect |
| `turnOffLight(tileId)` | Turn off lights |
| `stopEffect(tileId)` | Stop all effects |

#### Sensor Methods

| Method | Description |
|--------|-------------|
| `toggleTouchSensor(toggle, tileId)` | Enable/disable touch sensor |
| `toggleShakeSensor(toggle, tileId)` | Enable/disable shake sensor |
| `setShakeThreshold(threshold, tileId)` | Set shake sensitivity (0-255) |

#### Query Methods

| Method | Description |
|--------|-------------|
| `queryPairedTiles()` | Get list of paired tiles |
| `queryOnlineTiles(tileId)` | Discover online tiles (triggers auto-pairing) |
| `getBattery(tileId)` | Request battery status |

#### Pairing Methods

| Method | Description |
|--------|-------------|
| `pairTiles(macAddress)` | Manual pairing with MAC address |
| `unpairTile(tileId)` | Unpair specific tile |
| `clearMacList()` | Clear all pairings |
| `confirmAssignment(tileId)` | Confirm tile assignment |
| `gameInProgress(status, tileId)` | Set game mode status |

#### Event Callbacks

| Callback | Parameters | Description |
|----------|------------|-------------|
| `onConnectionStateChanged(callback)` | `(state: CONNECTION_STATE)` | Connection state changes |
| `onTouch(callback)` | `(response: TouchResponse)` | Touch events |
| `onShake(callback)` | `(response: ShakeResponse)` | Shake events |
| `onStepChanged(callback)` | `(response: StepChangeResponse)` | Step on/off |
| `onSidePaired(callback)` | `(response: SidePairResponse)` | Side pairing update |
| `onTileTimedOut(callback)` | `()` | Tile timeout |
| `onPairedTileListReceived(callback)` | `(response: PairedTilesResponse)` | Paired tiles list |
| `onOnlineTileStatusReceived(callback)` | `(response: OnlineTilesResponse)` | Online tile info |
| `onBatteryStatusReceived(callback)` | `(response: BatteryStatusResponse)` | Battery status |
| `onDataReceived(callback)` | `(data: string)` | Raw BLE data |

### Constants & Enums

#### Predefined Colors

```javascript
TileColor.RED       // (153, 0, 0)
TileColor.GREEN     // (0, 153, 0)
TileColor.BLUE      // (0, 0, 153)
TileColor.YELLOW    // (153, 153, 0)
TileColor.CYAN      // (0, 153, 153)
TileColor.MAGENTA   // (153, 0, 153)
TileColor.WHITE     // (153, 153, 153)

// Create custom colors
new TileColor(r, g, b)  // r, g, b: 0-255

// Random color
TileColor.random()
```

#### Tile Selection

```javascript
SELECT_ITILE.I     // Tile 1
SELECT_ITILE.II    // Tile 2
SELECT_ITILE.III   // Tile 3
// ... through XVI (16)
SELECT_ITILE.ALL   // All tiles (255)
```

#### Timeouts

```javascript
TIMEOUT_DELAY.NOPE      // No timeout
TIMEOUT_DELAY.SEC_1     // 1 second
TIMEOUT_DELAY.SEC_5     // 5 seconds
TIMEOUT_DELAY.SEC_10    // 10 seconds
TIMEOUT_DELAY.SEC_30    // 30 seconds
TIMEOUT_DELAY.MIN_1     // 1 minute
TIMEOUT_DELAY.MIN_2     // 2 minutes
// ... more options available
```

#### Other Enums

```javascript
// Connection states
CONNECTION_STATE.DISCONNECTED
CONNECTION_STATE.CONNECTING
CONNECTION_STATE.CONNECTED
CONNECTION_STATE.DISCONNECTING

// Sensor toggle
TOGGLE_SENSOR.OFF
TOGGLE_SENSOR.ON

// Vibration patterns
VIBRATION_PATTERN.NONE
VIBRATION_PATTERN.I
VIBRATION_PATTERN.II
// ... through IX

// Sound tracks
SOUND_TRACK.NONE
SOUND_TRACK.DEFAULT

// Repeat counts
REPEAT_COUNT.I through REPEAT_COUNT.IX

// Game status
GAME_STATUS.NOT_IN_GAME
GAME_STATUS.IN_GAME

// Log reaction time
LOG_REACTION_TIME.NONE
LOG_REACTION_TIME.TOUCH_OR_STEP
LOG_REACTION_TIME.SHAKE_ONLY
LOG_REACTION_TIME.TOUCH_OR_STEP_OR_SHAKE
LOG_REACTION_TIME.SIDE_PARING

// Timeout response
TIMEOUT_RESPONSE.IMMEDIATE
TIMEOUT_RESPONSE.SEC_1
TIMEOUT_RESPONSE.SEC_5
// ... more options
```

### Response Types

#### TouchResponse
```typescript
{
  tileId: number;
  reactionTime: number;  // seconds
}
```

#### ShakeResponse
```typescript
{
  tileId: number;
  reactionTime: number;  // seconds
}
```

#### StepChangeResponse
```typescript
{
  tileId: number;
  stepStatus: number;  // 0 = ON, 1 = OFF
}
```

#### OnlineTilesResponse
```typescript
{
  tileId: number;
  tileType: number;           // 0 = wall, 1 = floor
  macAddress: number[];       // 6 bytes
  batteryPercentage: number;  // 0-100
  hardwareVersion: number;
  firmwareVersion: number;
  assignedTileId: number;
}
```

#### PairedTilesResponse
```typescript
{
  pairedTileIds: number[];
  pairedTileTotal: number;
}
```

#### BatteryStatusResponse
```typescript
{
  batteryPercentage: number;  // 0-100
}
```

## Protocol Information

The library communicates with iTiles devices using a custom BLE protocol:

**BLE Service UUID:** `6e400001-b5a3-f393-e0a9-e50e24dcca9e`  
**TX Characteristic (write):** `6e400002-b5a3-f393-e0a9-e50e24dcca9e`  
**RX Characteristic (notify):** `6e400003-b5a3-f393-e0a9-e50e24dcca9e`

### Command Packet Format

```
[START] [TILE_ID] [COMMAND] [LENGTH] [PARAMETERS...] [END]
[0xAA]  [0x01]    [0x0B]    [0x03]   [R, G, B]       [0xEF]
```

Example - Light tile 1 with red color:
```
AA 01 0B 03 99 00 00 EF
```

## Demo Application

A complete demo web application is included showing all features. To run it:

```bash
# Clone the repository
git clone https://github.com/augmented-human-lab/itiles-lib-web.git
cd itiles-lib-web

# Install dependencies
npm install

# Build the library
npm run build

# Serve the demo
npx http-server demo

# Open http://localhost:8080 in Chrome/Edge
```

The demo includes:
- Connection management
- Light control with RGB sliders
- Sound and vibration triggers
- Sensor enable/disable
- Auto-pairing workflow
- Battery monitoring
- Real-time event log

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev
```

Build outputs:
- `dist/itiles.js` - UMD bundle
- `dist/itiles.esm.js` - ES Module bundle
- `dist/itiles.d.ts` - TypeScript definitions

## TypeScript Support

Full TypeScript definitions are included. Import types as needed:

```typescript
import { 
  ITilesBLEManager,
  TouchResponse,
  ShakeResponse,
  OnlineTilesResponse,
  CONNECTION_STATE
} from '@itiles/itiles-web-bluetooth';

const manager: ITilesBLEManager = new ITilesBLEManager();

manager.onTouch((response: TouchResponse) => {
  console.log(response.tileId, response.reactionTime);
});
```

## Troubleshooting

### "Web Bluetooth is not supported"
- Use Chrome 56+, Edge 79+, or Opera 43+
- Ensure HTTPS connection (or localhost)
- Check browser flags: `chrome://flags/#enable-web-bluetooth`

### Cannot find device
- Ensure iTiles device is powered on
- Check Bluetooth is enabled
- Verify device name is "iTILES"
- Move closer to the device

### Connection drops
- Check tile battery levels
- Ensure stable Bluetooth connection
- Avoid interference from other devices

### Pairing not working
- Ensure standard tiles are powered on
- Keep tiles within 5 meters of master
- Wait full 20 seconds during pairing
- Try power cycling standard tiles

## License

MIT © Bulathsinhalage Sankha Cooray

## Links

- **NPM Package:** https://www.npmjs.com/package/@itiles/itiles-web-bluetooth
- **GitHub Repository:** https://github.com/augmented-human-lab/itiles-lib-web
- **Issues:** https://github.com/augmented-human-lab/itiles-lib-web/issues

## Support

For questions, issues, or feature requests, please use the [GitHub issue tracker](https://github.com/augmented-human-lab/itiles-lib-web/issues).