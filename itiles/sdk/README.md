# iTiles Web Bluetooth

> Control iTiles interactive floor and wall tiles directly from your browser using Web Bluetooth API.

## Features

- 🔌 **Web Bluetooth Integration** - Connect directly from Chrome, Edge, or Opera
- 💡 **Full Control** - Lights, sounds, vibrations, and sensors
- 🎯 **Real-time Events** - Touch, shake, and step detection callbacks
- 📊 **Status Monitoring** - Battery levels and tile status
- 🔋 **Auto-Pairing** - Automatic tile discovery and pairing
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

### CDN (Recommended)

```html
<script type="module">
  import { 
    ITilesBLEManager,
    TileColor,
    SELECT_ITILE,
    TIMEOUT_DELAY,
    LOG_REACTION_TIME,
    TIMEOUT_RESPONSE
  } from 'https://stakcos.com/itiles/itiles.esm.js';
  
  // Your code here
</script>
```

## Quick Start

### Complete Minimal Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>iTiles Demo</title>
</head>
<body>
    <button id="connectBtn">Connect</button>
    <button id="lightBtn" disabled>Light Up!</button>
    
    <script type="module">
        import { 
            ITilesBLEManager, 
            TileColor,
            SELECT_ITILE,
            TIMEOUT_DELAY,
            CONNECTION_STATE
        } from 'https://stakcos.com/itiles/itiles.esm.js';

        const manager = new ITilesBLEManager();
        const connectBtn = document.getElementById('connectBtn');
        const lightBtn = document.getElementById('lightBtn');

        // Setup event listeners BEFORE connecting
        manager.onConnectionStateChanged((state) => {
            if (state === CONNECTION_STATE.CONNECTED) {
                console.log('Connected!');
                connectBtn.disabled = true;
                lightBtn.disabled = false;
            } else if (state === CONNECTION_STATE.DISCONNECTED) {
                connectBtn.disabled = false;
                lightBtn.disabled = true;
            }
        });

        manager.onTouch((response) => {
            console.log(`Tile ${response.tileId} touched! Reaction: ${response.reactionTime}s`);
        });

        // Connect button handler
        connectBtn.addEventListener('click', async () => {
            try {
                // Step 1: Open device picker
                const device = await manager.requestDevice();
                console.log('Device selected:', device.name);
                
                // Step 2: Connect to selected device
                await manager.connect();
                console.log('Connected successfully!');
            } catch (error) {
                console.error('Connection failed:', error);
            }
        });

        // Light button handler
        lightBtn.addEventListener('click', async () => {
            try {
                await manager.triggerLight(
                    TileColor.RED,
                    TIMEOUT_DELAY.SEC_5,
                    0, 0,
                    SELECT_ITILE.ALL
                );
            } catch (error) {
                console.error('Light trigger failed:', error);
            }
        });
    </script>
</body>
</html>
```

## Connection Workflow

### Important: Always Set Up Event Listeners First

Event listeners must be registered **before** connecting to ensure you don't miss any callbacks:

```javascript
import { ITilesBLEManager, CONNECTION_STATE } from 'https://stakcos.com/itiles/itiles.esm.js';

const manager = new ITilesBLEManager();

// 1. Setup ALL event listeners first
manager.onConnectionStateChanged((state) => {
    const states = ['Disconnected', 'Connecting', 'Connected', 'Disconnecting'];
    console.log('State:', states[state]);
});

manager.onTouch((response) => {
    console.log(`Touch on tile ${response.tileId}`);
});

manager.onShake((response) => {
    console.log(`Shake on tile ${response.tileId}`);
});

// 2. Then connect (requires user gesture like button click)
document.getElementById('connectBtn').addEventListener('click', async () => {
    try {
        // Opens browser's device picker dialog
        const device = await manager.requestDevice();
        
        // Connect to the selected device
        await manager.connect();
        
        // Now you're connected and ready to control tiles
    } catch (error) {
        console.error('Connection error:', error);
    }
});

// 3. Disconnect when done
document.getElementById('disconnectBtn').addEventListener('click', async () => {
    await manager.disconnect();
});
```

## Basic Examples

### Light Control

```javascript
import { TileColor, TIMEOUT_DELAY, SELECT_ITILE } from 'https://stakcos.com/itiles/itiles.esm.js';

// Light up a specific tile
const green = new TileColor(0, 153, 0);
await manager.triggerLight(
    green,                          // Color
    TIMEOUT_DELAY.SEC_10,          // Duration
    0,                             // Log reaction time (0 = none)
    0,                             // Timeout response (0 = immediate)
    SELECT_ITILE.I                 // Tile 1
);

// Use predefined colors
await manager.triggerLight(TileColor.RED, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.II);
await manager.triggerLight(TileColor.BLUE, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.III);
await manager.triggerLight(TileColor.YELLOW, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.ALL);

// Turn off lights
await manager.turnOffLight(SELECT_ITILE.ALL);
```

### Color Picker Example

```javascript
// From RGB input fields
const r = parseInt(document.getElementById('colorR').value);
const g = parseInt(document.getElementById('colorG').value);
const b = parseInt(document.getElementById('colorB').value);
const duration = parseInt(document.getElementById('duration').value);
const tileId = parseInt(document.getElementById('tileSelect').value);

const customColor = new TileColor(r, g, b);
await manager.triggerLight(customColor, duration, 0, 0, tileId);
```

### Quick Color Buttons

```javascript
// Setup quick color buttons
document.getElementById('redBtn').addEventListener('click', async () => {
    await manager.triggerLight(TileColor.RED, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.ALL);
});

document.getElementById('greenBtn').addEventListener('click', async () => {
    await manager.triggerLight(TileColor.GREEN, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.ALL);
});

document.getElementById('blueBtn').addEventListener('click', async () => {
    await manager.triggerLight(TileColor.BLUE, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.ALL);
});

document.getElementById('yellowBtn').addEventListener('click', async () => {
    await manager.triggerLight(TileColor.YELLOW, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.ALL);
});
```

### Multi-Color Side Lighting

```javascript
import { SideColors, TileColor } from 'https://stakcos.com/itiles/itiles.esm.js';

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
    0, 0,
    SELECT_ITILE.I
);
```

### Sound and Vibration

```javascript
import { 
    SOUND_TRACK, 
    VIBRATION_PATTERN, 
    REPEAT_COUNT 
} from 'https://stakcos.com/itiles/itiles.esm.js';

// Play sound
await manager.triggerSound(
    SOUND_TRACK.DEFAULT,
    REPEAT_COUNT.I,     // Play once
    0, 0,
    SELECT_ITILE.ALL
);

// Trigger vibration
await manager.triggerVibration(
    VIBRATION_PATTERN.I,
    REPEAT_COUNT.III,   // Repeat 3 times
    0, 0,
    SELECT_ITILE.ALL
);

// Combined effect from form inputs
const sound = parseInt(document.getElementById('soundTrack').value);
const pattern = parseInt(document.getElementById('vibrationPattern').value);
const repeat = parseInt(document.getElementById('repeatCount').value);
const tileId = parseInt(document.getElementById('tileSelect').value);

await manager.triggerLightSoundVibration(
    TileColor.BLUE,
    TIMEOUT_DELAY.SEC_5,
    sound,
    pattern,
    repeat,
    0, 0,
    tileId
);
```

### Sensor Control

```javascript
import { TOGGLE_SENSOR } from 'https://stakcos.com/itiles/itiles.esm.js';

// Enable sensors with callbacks
manager.onTouch((response) => {
    console.log(`Tile ${response.tileId} touched!`);
    console.log(`Reaction time: ${response.reactionTime.toFixed(3)}s`);
});

manager.onShake((response) => {
    console.log(`Tile ${response.tileId} shaken!`);
    console.log(`Reaction time: ${response.reactionTime.toFixed(3)}s`);
});

manager.onStepChanged((response) => {
    const status = response.stepStatus === 0 ? 'ON' : 'OFF';
    console.log(`Step ${status} tile ${response.tileId}`);
});

// Enable touch sensor
await manager.toggleTouchSensor(TOGGLE_SENSOR.ON, SELECT_ITILE.ALL);

// Enable shake sensor
await manager.toggleShakeSensor(TOGGLE_SENSOR.ON, SELECT_ITILE.ALL);

// Set shake sensitivity (0-255, lower = more sensitive)
await manager.setShakeThreshold(50, SELECT_ITILE.ALL);

// Disable sensors
await manager.toggleTouchSensor(TOGGLE_SENSOR.OFF, SELECT_ITILE.ALL);
await manager.toggleShakeSensor(TOGGLE_SENSOR.OFF, SELECT_ITILE.ALL);
```

### Button Handler Example

```javascript
// Enable/disable buttons based on connection state
const buttons = [
    triggerLightBtn, turnOffLightBtn, triggerSoundBtn,
    triggerVibrateBtn, enableTouchBtn, disableTouchBtn
];

manager.onConnectionStateChanged((state) => {
    const connected = (state === CONNECTION_STATE.CONNECTED);
    buttons.forEach(btn => btn.disabled = !connected);
    connectBtn.disabled = connected;
    disconnectBtn.disabled = !connected;
});
```

## Auto-Pairing Workflow

### Complete Pairing Process

This is the **exact workflow** used in the working demo. Follow these steps precisely:

```javascript
import { 
    GAME_STATUS,
    SELECT_ITILE 
} from 'https://stakcos.com/itiles/itiles.esm.js';

// Setup event listeners for pairing feedback
manager.onPairedTileListReceived((response) => {
    console.log(`Paired tiles (${response.pairedTileTotal}):`, response.pairedTileIds);
    if (response.pairedTileTotal === 0) {
        console.log('No tiles paired yet');
    }
});

manager.onOnlineTileStatusReceived((response) => {
    const macStr = response.macAddress
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join(':');
    console.log(`Tile ${response.tileId} online`);
    console.log(`  MAC: ${macStr}`);
    console.log(`  Battery: ${response.batteryPercentage}%`);
    console.log(`  Hardware: v${response.hardwareVersion}`);
    console.log(`  Firmware: v${response.firmwareVersion}`);
});

// Complete auto-pairing function
async function pairAllTiles() {
    console.log('⚠️ IMPORTANT: Make sure all standard tiles are powered on!');
    console.log('Starting auto-discovery and pairing...');
    console.log('This will take approximately 20-25 seconds');
    
    try {
        // Step 1: Query online tiles (triggers auto-pairing)
        console.log('Step 1: Discovering online tiles...');
        await manager.queryOnlineTiles(SELECT_ITILE.ALL);
        
        // Step 2: Wait for tiles to pair (critical timing!)
        console.log('Step 2: Waiting for tiles to pair (20 seconds)...');
        let countdown = 20;
        const countdownInterval = setInterval(() => {
            console.log(`⏱️  ${countdown} seconds remaining...`);
            countdown--;
            if (countdown < 0) clearInterval(countdownInterval);
        }, 1000);
        
        await new Promise(resolve => setTimeout(resolve, 20000));
        clearInterval(countdownInterval);
        
        // Step 3: Confirm assignment
        console.log('Step 3: Confirming tile assignments...');
        await manager.confirmAssignment(SELECT_ITILE.ALL);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 4: Set game in progress for all discovered tiles
        console.log('Step 4: Activating tiles...');
        for (let i = 1; i <= 6; i++) {
            await manager.gameInProgress(GAME_STATUS.IN_GAME, i);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Step 5: Query paired tiles to verify
        console.log('Step 5: Verifying paired tiles...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await manager.queryPairedTiles();
        
        console.log('✅ Pairing sequence complete!');
        
    } catch (error) {
        console.error('Pairing error:', error);
    }
}

// Button handler with UI feedback
document.getElementById('pairTilesBtn').addEventListener('click', async () => {
    const btn = document.getElementById('pairTilesBtn');
    btn.disabled = true;
    btn.textContent = 'Pairing in progress...';
    
    await pairAllTiles();
    
    btn.disabled = false;
    btn.textContent = '🔗 Pair Tiles (Auto-discover)';
});
```

### Query Paired and Online Tiles

```javascript
// Query which tiles are currently paired
document.getElementById('queryPairedBtn').addEventListener('click', async () => {
    await manager.queryPairedTiles();
    console.log('Querying paired tiles...');
    // Response comes via onPairedTileListReceived callback
});

// Query online tiles to get detailed info
document.getElementById('queryOnlineBtn').addEventListener('click', async () => {
    await manager.queryOnlineTiles(SELECT_ITILE.ALL);
    console.log('Querying online tiles...');
    // Response comes via onOnlineTileStatusReceived callback
});
```

### Clear Pairings

```javascript
document.getElementById('clearMacListBtn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to clear the MAC list? This will unpair all tiles.')) {
        return;
    }
    
    try {
        await manager.clearMacList();
        console.log('🗑️ MAC list cleared. All tiles unpaired.');
    } catch (error) {
        console.error('Error clearing MAC list:', error);
    }
});
```

## Battery Monitoring

```javascript
// Request battery status
document.getElementById('getBatteryBtn').addEventListener('click', async () => {
    const tileId = parseInt(document.getElementById('tileSelect').value);
    await manager.getBattery(tileId);
    console.log('Requesting battery status...');
});

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

## Constants & Enums Reference

### Predefined Colors

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

### Tile Selection

```javascript
SELECT_ITILE.I     // Tile 1
SELECT_ITILE.II    // Tile 2
SELECT_ITILE.III   // Tile 3
SELECT_ITILE.IV    // Tile 4
SELECT_ITILE.V     // Tile 5
SELECT_ITILE.VI    // Tile 6
// ... through XVI (16)
SELECT_ITILE.ALL   // All tiles (255)
```

### Timeouts

```javascript
TIMEOUT_DELAY.NOPE      // No timeout (0)
TIMEOUT_DELAY.SEC_1     // 1 second
TIMEOUT_DELAY.SEC_5     // 5 seconds
TIMEOUT_DELAY.SEC_10    // 10 seconds
TIMEOUT_DELAY.SEC_30    // 30 seconds
TIMEOUT_DELAY.MIN_1     // 1 minute
TIMEOUT_DELAY.MIN_2     // 2 minutes
```

### Connection States

```javascript
CONNECTION_STATE.DISCONNECTED   // 0
CONNECTION_STATE.CONNECTING     // 1
CONNECTION_STATE.CONNECTED      // 2
CONNECTION_STATE.DISCONNECTING  // 3
```

### Sensor Toggle

```javascript
TOGGLE_SENSOR.OFF  // 0
TOGGLE_SENSOR.ON   // 1
```

### Vibration Patterns

```javascript
VIBRATION_PATTERN.NONE  // 0
VIBRATION_PATTERN.I     // 1
VIBRATION_PATTERN.II    // 2
VIBRATION_PATTERN.III   // 3
// ... through IX
```

### Sound Tracks

```javascript
SOUND_TRACK.NONE     // 0
SOUND_TRACK.DEFAULT  // 1
```

### Repeat Counts

```javascript
REPEAT_COUNT.I    // 1
REPEAT_COUNT.II   // 2
REPEAT_COUNT.III  // 3
// ... through IX
```

### Game Status

```javascript
GAME_STATUS.NOT_IN_GAME  // 0
GAME_STATUS.IN_GAME      // 1
```

## API Reference

### ITilesBLEManager Methods

#### Connection
- `requestDevice()` - Opens browser device picker, returns selected device
- `connect(device?)` - Connects to selected device
- `disconnect()` - Disconnects from current device
- `isConnected()` - Returns true if connected
- `getConnectionState()` - Returns current CONNECTION_STATE

#### Tile Control
- `triggerLight(color, duration, logReaction, timeoutResponse, tileId)` - Solid color light
- `triggerSideLight(sideColors, duration, logReaction, timeoutResponse, tileId)` - Multi-color sides
- `triggerSound(sound, repeat, logReaction, timeoutResponse, tileId)` - Play sound
- `triggerVibration(pattern, repeat, logReaction, timeoutResponse, tileId)` - Vibration
- `triggerLightSoundVibration(...)` - Combined effect
- `turnOffLight(tileId)` - Turn off lights
- `stopEffect(tileId)` - Stop all effects

#### Sensors
- `toggleTouchSensor(toggle, tileId)` - Enable/disable touch sensor
- `toggleShakeSensor(toggle, tileId)` - Enable/disable shake sensor
- `setShakeThreshold(threshold, tileId)` - Set shake sensitivity (0-255)

#### Query
- `queryPairedTiles()` - Get list of paired tiles
- `queryOnlineTiles(tileId)` - Discover online tiles (triggers auto-pairing)
- `getBattery(tileId)` - Request battery status

#### Pairing
- `pairTiles(macAddress)` - Manual pairing with MAC address
- `unpairTile(tileId)` - Unpair specific tile
- `clearMacList()` - Clear all pairings
- `confirmAssignment(tileId)` - Confirm tile assignment
- `gameInProgress(status, tileId)` - Set game mode status

### Event Callbacks

All callbacks should be set up **before** connecting:

```javascript
// Connection state
manager.onConnectionStateChanged((state) => { });

// Touch events
manager.onTouch((response) => {
    // response.tileId, response.reactionTime
});

// Shake events
manager.onShake((response) => {
    // response.tileId, response.reactionTime
});

// Step events
manager.onStepChanged((response) => {
    // response.tileId, response.stepStatus (0=ON, 1=OFF)
});

// Paired tiles list
manager.onPairedTileListReceived((response) => {
    // response.pairedTileIds[], response.pairedTileTotal
});

// Online tiles info
manager.onOnlineTileStatusReceived((response) => {
    // response.tileId, response.macAddress[], response.batteryPercentage
    // response.hardwareVersion, response.firmwareVersion
});

// Battery status
manager.onBatteryStatusReceived((response) => {
    // response.batteryPercentage
});

// Raw BLE data (for debugging)
manager.onDataReceived((data) => {
    console.log('Raw BLE data:', data);
});
```

## Complete Working Example

Here's a complete, minimal working example you can copy and run:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iTiles Demo</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        button { padding: 10px 20px; margin: 5px; font-size: 16px; cursor: pointer; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .connected { background: #d4edda; }
        .disconnected { background: #f8d7da; }
        #log { background: #f5f5f5; padding: 10px; height: 200px; overflow-y: auto; font-family: monospace; }
    </style>
</head>
<body>
    <h1>iTiles Web Bluetooth Demo</h1>
    
    <div id="status" class="status disconnected">Disconnected</div>
    
    <div>
        <button id="connectBtn">Connect to iTiles</button>
        <button id="disconnectBtn" disabled>Disconnect</button>
    </div>
    
    <h3>Controls</h3>
    <div>
        <button id="redBtn" disabled>Red Light</button>
        <button id="greenBtn" disabled>Green Light</button>
        <button id="blueBtn" disabled>Blue Light</button>
        <button id="offBtn" disabled>Turn Off</button>
    </div>
    
    <div>
        <button id="soundBtn" disabled>Play Sound</button>
        <button id="vibrateBtn" disabled>Vibrate</button>
        <button id="comboBtn" disabled>Combo Effect</button>
    </div>
    
    <div>
        <button id="enableTouchBtn" disabled>Enable Touch</button>
        <button id="disableTouchBtn" disabled>Disable Touch</button>
    </div>
    
    <h3>Pairing</h3>
    <div>
        <button id="pairBtn" disabled>Auto-Pair Tiles</button>
        <button id="queryPairedBtn" disabled>Query Paired</button>
        <button id="queryOnlineBtn" disabled>Query Online</button>
    </div>
    
    <h3>Log</h3>
    <div id="log"></div>

    <script type="module">
        import { 
            ITilesBLEManager,
            TileColor,
            SELECT_ITILE,
            TIMEOUT_DELAY,
            CONNECTION_STATE,
            TOGGLE_SENSOR,
            SOUND_TRACK,
            VIBRATION_PATTERN,
            REPEAT_COUNT,
            GAME_STATUS
        } from 'https://stakcos.com/itiles/itiles.esm.js';

        const manager = new ITilesBLEManager();
        
        // UI Elements
        const statusDiv = document.getElementById('status');
        const logDiv = document.getElementById('log');
        const connectBtn = document.getElementById('connectBtn');
        const disconnectBtn = document.getElementById('disconnectBtn');
        const redBtn = document.getElementById('redBtn');
        const greenBtn = document.getElementById('greenBtn');
        const blueBtn = document.getElementById('blueBtn');
        const offBtn = document.getElementById('offBtn');
        const soundBtn = document.getElementById('soundBtn');
        const vibrateBtn = document.getElementById('vibrateBtn');
        const comboBtn = document.getElementById('comboBtn');
        const enableTouchBtn = document.getElementById('enableTouchBtn');
        const disableTouchBtn = document.getElementById('disableTouchBtn');
        const pairBtn = document.getElementById('pairBtn');
        const queryPairedBtn = document.getElementById('queryPairedBtn');
        const queryOnlineBtn = document.getElementById('queryOnlineBtn');

        function log(message) {
            const time = new Date().toLocaleTimeString();
            logDiv.innerHTML += `[${time}] ${message}<br>`;
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        function updateUI(connected) {
            const buttons = [redBtn, greenBtn, blueBtn, offBtn, soundBtn, vibrateBtn, 
                           comboBtn, enableTouchBtn, disableTouchBtn, pairBtn, 
                           queryPairedBtn, queryOnlineBtn];
            buttons.forEach(btn => btn.disabled = !connected);
            connectBtn.disabled = connected;
            disconnectBtn.disabled = !connected;
            
            statusDiv.className = connected ? 'status connected' : 'status disconnected';
            statusDiv.textContent = connected ? 'Connected' : 'Disconnected';
        }

        // Setup event listeners FIRST
        manager.onConnectionStateChanged((state) => {
            const states = ['Disconnected', 'Connecting', 'Connected', 'Disconnecting'];
            log(`Connection: ${states[state]}`);
            updateUI(state === CONNECTION_STATE.CONNECTED);
        });

        manager.onTouch((response) => {
            log(`Touch detected on Tile ${response.tileId} (${response.reactionTime.toFixed(3)}s)`);
        });

        manager.onPairedTileListReceived((response) => {
            log(`Paired tiles (${response.pairedTileTotal}): ${response.pairedTileIds.join(', ')}`);
        });

        manager.onOnlineTileStatusReceived((response) => {
            log(`Tile ${response.tileId} online - Battery: ${response.batteryPercentage}%`);
        });

        // Connection handlers
        connectBtn.addEventListener('click', async () => {
            try {
                log('Opening device picker...');
                const device = await manager.requestDevice();
                log(`Device selected: ${device.name}`);
                
                log('Connecting...');
                await manager.connect();
                log('Connected successfully!');
            } catch (error) {
                log(`Error: ${error.message}`);
            }
        });

        disconnectBtn.addEventListener('click', async () => {
            await manager.disconnect();
        });

        // Light controls
        redBtn.addEventListener('click', () => 
            manager.triggerLight(TileColor.RED, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.ALL));
        
        greenBtn.addEventListener('click', () => 
            manager.triggerLight(TileColor.GREEN, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.ALL));
        
        blueBtn.addEventListener('click', () => 
            manager.triggerLight(TileColor.BLUE, TIMEOUT_DELAY.SEC_5, 0, 0, SELECT_ITILE.ALL));
        
        offBtn.addEventListener('click', () => 
            manager.turnOffLight(SELECT_ITILE.ALL));

        // Sound and vibration
        soundBtn.addEventListener('click', () => 
            manager.triggerSound(SOUND_TRACK.DEFAULT, REPEAT_COUNT.I, 0, 0, SELECT_ITILE.ALL));
        
        vibrateBtn.addEventListener('click', () => 
            manager.triggerVibration(VIBRATION_PATTERN.I, REPEAT_COUNT.II, 0, 0, SELECT_ITILE.ALL));
        
        comboBtn.addEventListener('click', () => 
            manager.triggerLightSoundVibration(TileColor.YELLOW, TIMEOUT_DELAY.SEC_5, 
                SOUND_TRACK.DEFAULT, VIBRATION_PATTERN.I, REPEAT_COUNT.I, 0, 0, SELECT_ITILE.ALL));

        // Touch sensor
        enableTouchBtn.addEventListener('click', () => 
            manager.toggleTouchSensor(TOGGLE_SENSOR.ON, SELECT_ITILE.ALL));
        
        disableTouchBtn.addEventListener('click', () => 
            manager.toggleTouchSensor(TOGGLE_SENSOR.OFF, SELECT_ITILE.ALL));

        // Pairing
        pairBtn.addEventListener('click', async () => {
            log('Starting auto-pairing (20 seconds)...');
            pairBtn.disabled = true;
            
            await manager.queryOnlineTiles(SELECT_ITILE.ALL);
            await new Promise(r => setTimeout(r, 20000));
            await manager.confirmAssignment(SELECT_ITILE.ALL);
            await new Promise(r => setTimeout(r, 500));
            
            for (let i = 1; i <= 6; i++) {
                await manager.gameInProgress(GAME_STATUS.IN_GAME, i);
                await new Promise(r => setTimeout(r, 500));
            }
            
            await manager.queryPairedTiles();
            log('Pairing complete!');
            pairBtn.disabled = false;
        });

        queryPairedBtn.addEventListener('click', () => 
            manager.queryPairedTiles());
        
        queryOnlineBtn.addEventListener('click', () => 
            manager.queryOnlineTiles(SELECT_ITILE.ALL));

        log('Ready. Click "Connect to iTiles" to begin.');
    </script>
</body>
</html>
```

## Troubleshooting

### "Web Bluetooth is not supported"
- Use Chrome 56+, Edge 79+, or Opera 43+
- Ensure HTTPS connection (or localhost)
- Check `chrome://flags/#enable-web-bluetooth`

### Cannot find device
- Ensure iTiles device is powered on
- Verify Bluetooth is enabled
- Check device name is "iTILES"
- Move closer to the device

### Pairing not working
- Ensure standard tiles are powered on
- Keep tiles within 5 meters of master
- Wait full 20 seconds during pairing
- Try power cycling standard tiles

### Events not triggering
- Ensure event listeners are set up **before** connecting
- Verify sensors are enabled (toggleTouchSensor, toggleShakeSensor)
- Check console for errors

## Links

- **GitHub Repository:** https://github.com/augmented-human-lab/itiles-lib-web
- **Demo Application:** [Live Demo Link]
- **Issues:** https://github.com/augmented-human-lab/itiles-lib-web/issues