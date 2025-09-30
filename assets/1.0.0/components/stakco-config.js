/**
 * Stakco Configuration Module
 * Centralized configuration for all Stakco puzzle variants
 */

export const StakcoConfig = {
    // Common settings across all apps
    common: {
        USER_ID: '109949450257686494443',
        CDN_BASE: 'https://stakcos.com/assets/1.0.0',
        SHARE_BASE_URL: 'https://stakcos.com'
    },

    // Puzzle mechanics defaults
    defaults: {
        ROTATION_TOLERANCE: 2,
        SOLVE_ANIMATION_DURATION: 4000,
        VIBRATION_PATTERN: [200, 100, 300, 100, 200],
        PERMISSION_PROMPT_DELAY: 1000
    },

    // Azimuth specific configuration
    azimuth: {
        PUZZLE_ID: 'A2A3_3',
        VERSION: 'v2.0.0',
        TITLE: 'Stakco Azimuth',
        SUBTITLE: 'Compass Puzzle',
        LAYERS: 3,
        ROTATION_TOLERANCE: 2,
        SOLVE_ANIMATION_DURATION: 4000,
        VIBRATION_PATTERN: [200, 100, 300, 100, 200],
        MESSAGES: {
            INITIALIZING: 'Initializing compass... Rotate device to control selected layer',
            READY: 'Compass ready - Rotate device to control selected layer',
            ACTIVE: 'Compass active - Rotate device to align all layers',
            UNSUPPORTED: 'Device orientation not supported on this device',
            SOLVED: 'Solved with compass navigation!'
        }
    },

    // Gyro specific configuration
    gyro: {
        PUZZLE_ID: 'G2G3_3',
        VERSION: 'v2.0.0',
        TITLE: 'Stakco Gyro',
        SUBTITLE: 'Spin Puzzle',
        LAYERS: 3,
        ROTATION_TOLERANCE: 2,
        SOLVE_ANIMATION_DURATION: 4000,
        VIBRATION_PATTERN: [200, 100, 300, 100, 200],
        GYRO_SENSITIVITY: 0.5,
        MESSAGES: {
            INITIALIZING: 'Initializing gyroscope... Tilt device to control selected layer',
            READY: 'Gyroscope ready - Tilt device to control selected layer',
            ACTIVE: 'Gyroscope active - Tilt device to align all layers',
            UNSUPPORTED: 'Device gyroscope not supported on this device',
            SOLVED: 'Solved with gyroscope control!'
        }
    },

    // MIDI specific configuration
    midi: {
        PUZZLE_ID: 'M2M3_3',
        VERSION: 'v1.0.0',
        TITLE: 'Stakco MIDI',
        SUBTITLE: 'Music Puzzle',
        LAYERS: 3,
        ROTATION_TOLERANCE: 2,
        SOLVE_ANIMATION_DURATION: 4000,
        VIBRATION_PATTERN: [200, 100, 300, 100, 200],
        MESSAGES: {
            INITIALIZING: 'Initializing MIDI... Play notes to control layers',
            READY: 'MIDI ready - Play notes to control selected layer',
            ACTIVE: 'MIDI active - Play notes to align all layers',
            UNSUPPORTED: 'MIDI not supported on this device',
            SOLVED: 'Solved with music!'
        }
    },

    // Clock specific configuration
    clock: {
        PUZZLE_ID: 'C2C3_3',
        VERSION: 'v1.0.0',
        TITLE: 'Stakco Clock',
        SUBTITLE: 'Time Puzzle',
        LAYERS: 3,
        ROTATION_TOLERANCE: 2,
        SOLVE_ANIMATION_DURATION: 4000,
        VIBRATION_PATTERN: [200, 100, 300, 100, 200],
        MESSAGES: {
            INITIALIZING: 'Initializing clock... Use time to control layers',
            READY: 'Clock ready - Time controls selected layer',
            ACTIVE: 'Clock active - Use time to align all layers',
            UNSUPPORTED: 'Clock mode not available',
            SOLVED: 'Solved with perfect timing!'
        }
    },

    // Helper method to get config for specific app
    getConfig(appName) {
        const appConfig = this[appName.toLowerCase()];
        if (!appConfig) {
            console.warn(`Config for "${appName}" not found, using defaults`);
            return { ...this.common, ...this.defaults };
        }
        return { ...this.common, ...this.defaults, ...appConfig };
    },

    // Helper to merge custom config with defaults
    mergeConfig(appName, customConfig = {}) {
        const baseConfig = this.getConfig(appName);
        return { ...baseConfig, ...customConfig };
    }
};

// Make it available as default export too
export default StakcoConfig;