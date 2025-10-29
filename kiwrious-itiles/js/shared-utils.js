// Shared utilities for Kiwrious + iTiles applications
// Uses CDN for iTiles: https://stakcos.com/itiles/itiles.esm.js
// Uses CDN for Kiwrious: https://stakcos.com/kiwrious/

class AppController {
    constructor() {
        this.kiwriousConnected = false;
        this.itilesConnected = false;
        this.iTilesManager = null;
        this.serialService = null;
        this.currentSensorData = null;
        this.logCallbacks = [];
    }

    // Logging utility
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { timestamp, message, type };
        
        this.logCallbacks.forEach(callback => callback(logEntry));
        
        console.log(`[${timestamp}] ${message}`);
    }

    onLog(callback) {
        this.logCallbacks.push(callback);
    }

    // Initialize iTiles connection
    async connectITiles() {
        try {
            this.log('Requesting iTiles device...', 'info');
            
            // Import from CDN
            const { ITilesBLEManager, TileColor, CONNECTION_STATE, SELECT_ITILE, 
                    LOG_REACTION_TIME, TIMEOUT_DELAY, TIMEOUT_RESPONSE,
                    SOUND_TRACK, VIBRATION_PATTERN, REPEAT_COUNT, TOGGLE_SENSOR,
                    GAME_STATUS } = await import('https://stakcos.com/itiles/itiles.esm.js');
            
            // Store for later use
            window.TileColor = TileColor;
            window.SELECT_ITILE = SELECT_ITILE;
            window.LOG_REACTION_TIME = LOG_REACTION_TIME;
            window.TIMEOUT_DELAY = TIMEOUT_DELAY;
            window.TIMEOUT_RESPONSE = TIMEOUT_RESPONSE;
            window.SOUND_TRACK = SOUND_TRACK;
            window.VIBRATION_PATTERN = VIBRATION_PATTERN;
            window.REPEAT_COUNT = REPEAT_COUNT;
            window.TOGGLE_SENSOR = TOGGLE_SENSOR;
            window.GAME_STATUS = GAME_STATUS;
            
            this.iTilesManager = new ITilesBLEManager();
            
            // Setup connection state listener
            this.iTilesManager.onConnectionStateChanged((state) => {
                if (state === 2) { // CONNECTED
                    this.itilesConnected = true;
                    this.log('✅ iTiles connected!', 'success');
                    this.updateConnectionStatus();
                } else if (state === 0) { // DISCONNECTED
                    this.itilesConnected = false;
                    this.log('iTiles disconnected', 'warning');
                    this.updateConnectionStatus();
                }
            });
            
            const device = await this.iTilesManager.requestDevice();
            await this.iTilesManager.connect();
            
            return this.iTilesManager;
        } catch (error) {
            this.log(`iTiles connection error: ${error.message}`, 'error');
            throw error;
        }
    }

    // Initialize Kiwrious connection using CDN
    async connectKiwrious() {
        try {
            this.log('Loading Kiwrious WebSerial library from CDN...', 'info');
            
            // Dynamically import the new ESM Kiwrious library
            const SerialServiceModule = await import('https://stakcos.com/kiwrious/sdk/kiwrious-webserial.esm.min.js');
            const serialService = SerialServiceModule.default || SerialServiceModule;
            
            this.serialService = serialService;
            
            this.log('Requesting Kiwrious sensor...', 'info');
            
            // Setup connection status listener
            serialService.onSerialConnection = (connected) => {
                this.kiwriousConnected = connected;
                if (connected) {
                    this.log('✅ Kiwrious sensor connected!', 'success');
                } else {
                    this.log('Kiwrious sensor disconnected', 'warning');
                }
                this.updateConnectionStatus();
            };
            
            // Setup firmware update listener
            serialService.onFirmwareUpdateAvailable = (available) => {
                if (available) {
                    this.log('⚠️ Firmware update available for Kiwrious sensor', 'warning');
                }
            };
            
            // Setup data listener
            serialService.onSerialData = (decodedData) => {
                this.currentSensorData = decodedData;
                if (this.onSensorDataCallback) {
                    this.onSensorDataCallback(decodedData);
                }
            };
            
            // Connect and start reading
            await serialService.connectAndReadAsync();
            
            this.kiwriousConnected = true;
            this.log('✅ Kiwrious sensor connected and reading!', 'success');
            this.updateConnectionStatus();
            
            return serialService;
        } catch (error) {
            this.log(`Kiwrious connection error: ${error.message}`, 'error');
            throw error;
        }
    }

    // Pair child tiles to the master tile (automatic discovery and pairing)
    async pairChildTiles() {
        try {
            if (!this.iTilesManager) {
                throw new Error('iTiles manager not initialized. Connect to master tile first.');
            }
            
            if (!this.itilesConnected) {
                throw new Error('Master tile not connected. Connect to iTiles first.');
            }
            
            this.log('📡 Starting automatic tile discovery and pairing...', 'info');
            this.log('⏳ This will take approximately 20-25 seconds', 'warning');
            this.log('🔴 Make sure all standard tiles are powered on and nearby!', 'warning');
            
            // Step 1: Query online tiles (this triggers auto-pairing!)
            this.log('Step 1: Discovering online tiles...', 'info');
            await this.iTilesManager.queryOnlineTiles(SELECT_ITILE.ALL);
            
            // Step 2: Wait for tiles to pair (20 seconds as per Unity code)
            this.log('Step 2: Waiting for tiles to pair (20 seconds)...', 'info');
            let countdown = 20;
            const countdownInterval = setInterval(() => {
                this.log(`⏱️  ${countdown} seconds remaining...`, 'info');
                countdown--;
                if (countdown < 0) clearInterval(countdownInterval);
            }, 1000);
            
            await new Promise(r => setTimeout(r, 20000));
            clearInterval(countdownInterval);
            
            // Step 3: Confirm assignment
            this.log('Step 3: Confirming tile assignments...', 'info');
            await this.iTilesManager.confirmAssignment(SELECT_ITILE.ALL);
            await new Promise(r => setTimeout(r, 500));
            
            // Step 4: Set game in progress for all discovered tiles
            this.log('Step 4: Activating tiles...', 'info');
            for (let i = 1; i <= 6; i++) {
                await this.iTilesManager.gameInProgress(GAME_STATUS.IN_GAME, i);
                await new Promise(r => setTimeout(r, 500));
            }
            
            // Step 5: Query paired tiles to confirm
            this.log('Step 5: Verifying paired tiles...', 'info');
            await new Promise(r => setTimeout(r, 1000));
            await this.iTilesManager.queryPairedTiles();
            
            this.log('✅ Pairing sequence complete!', 'success');
            this.log('💡 Check above for the list of paired tiles.', 'info');
            
            return true;
        } catch (error) {
            this.log(`Child tile pairing error: ${error.message}`, 'error');
            throw error;
        }
    }

    // Set sensor data callback
    onSensorData(callback) {
        this.onSensorDataCallback = callback;
    }

    // Update connection status UI
    updateConnectionStatus() {
        const kiwriousDot = document.getElementById('kiwriousStatus');
        const itilesDot = document.getElementById('itilesStatus');
        
        if (kiwriousDot) {
            kiwriousDot.className = this.kiwriousConnected ? 'status-dot connected' : 'status-dot';
        }
        
        if (itilesDot) {
            itilesDot.className = this.itilesConnected ? 'status-dot connected' : 'status-dot';
        }
    }

    // Helper: Map temperature to color
    tempToColor(temp) {
        if (temp < 15) return new TileColor(0, 0, 153); // Blue
        if (temp < 20) return new TileColor(0, 153, 153); // Cyan
        if (temp < 25) return new TileColor(153, 153, 0); // Yellow
        if (temp < 30) return new TileColor(153, 77, 0); // Orange
        return new TileColor(153, 0, 0); // Red
    }

    // Helper: Map UV to color
    uvToColor(uv) {
        if (uv < 3) return new TileColor(153, 153, 153); // White/Blue (low)
        if (uv < 6) return new TileColor(153, 153, 0); // Yellow (moderate)
        if (uv < 8) return new TileColor(153, 77, 0); // Orange (high)
        if (uv < 11) return new TileColor(153, 0, 0); // Red (very high)
        return new TileColor(153, 0, 153); // Magenta (extreme)
    }

    // Helper: Map value to 0-100 range
    normalizeValue(value, min, max) {
        return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    }

    // Helper: Create color gradient
    interpolateColor(color1, color2, factor) {
        const r = Math.round(color1.r + factor * (color2.r - color1.r));
        const g = Math.round(color1.g + factor * (color2.g - color1.g));
        const b = Math.round(color1.b + factor * (color2.b - color1.b));
        return new TileColor(r, g, b);
    }

    // Cleanup
    async disconnect() {
        if (this.iTilesManager && this.itilesConnected) {
            await this.iTilesManager.disconnect();
            this.itilesConnected = false;
        }
        if (this.serialService && this.kiwriousConnected) {
            this.serialService.triggerStopReading();
            this.kiwriousConnected = false;
        }
        this.updateConnectionStatus();
        this.log('Disconnected from all devices', 'info');
    }
}

// Helper function to setup log display
function setupLogDisplay(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    return (logEntry) => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span class="timestamp">${logEntry.timestamp}</span>
            <span class="type-${logEntry.type}">${logEntry.message}</span>
        `;
        container.appendChild(entry);
        container.scrollTop = container.scrollHeight;
    };
}

// Export for use in individual apps
window.AppController = AppController;
window.setupLogDisplay = setupLogDisplay;