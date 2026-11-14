// stakco-play-html5
// src/play-config.js

/**
 * Application Configuration
 */
export const CONFIG = {
    // Puzzle defaults
    DEFAULT_LAYERS: 3,
    ROTATION_TOLERANCE: 1,
    ROTATION_STEP_SMALL: 1,
    ROTATION_STEP_LARGE: 5,
    
    // Animation timings
    SOLVE_ANIMATION_DELAY: 500,
    SOLVE_ANIMATION_DURATION: 4000,
    DOUBLE_TAP_DELAY: 300,
    COUNTDOWN_HIDE_DURATION: 2500,
    
    // Haptic feedback
    VIBRATION_PATTERN: [200, 100, 300, 100, 200],
    
    // URLs
    BASE_IMAGE_URL: 'https://storage.googleapis.com/stakco-images',
    GCS_BUCKET_URL: 'https://storage.googleapis.com/stakco-images',
    SHARE_URL: 'https://play.stakcos.com/',
    
    // Default puzzle (daily puzzle fallback)
    DEFAULT_USER_ID: '109949450257686494443',
    DEFAULT_PUZZLE_ID: 'A2A3_3'
};

/**
 * UI Messages
 */
export const MESSAGES = {
    // Loading states
    LOADING_USER: 'Loading custom puzzle...',
    LOADING_DAILY: 'Loading today\'s puzzle...',
    LOADING_ALBUM: 'Loading album puzzle...',
    
    // Instructions
    INSTRUCTIONS: 'Drag to rotate selected layer - Align all layers - Share',
    
    // Share
    SHARE_TITLE: 'Stakco Puzzle',
    SHARE_TEXT: 'I just solved Stakco',
    CLIPBOARD_MESSAGE: 'Link copied to clipboard!',
    
    // Errors
    ERROR_NO_SUBDOMAIN: 'This puzzle link isn\'t active right now.',
    ERROR_NO_ALBUM: 'There\'s no active puzzle here right now.',
    ERROR_NO_USER: 'This puzzle link isn\'t active right now.',
    ERROR_LOAD_FAILED: 'Puzzle couldn\'t load — please try again.'
};

/**
 * Time-driven album types that rotate based on time
 */
export const TIME_DRIVEN_TYPES = ['HOUR_12', 'HOUR_OF_DAY', 'DAY_OF_WEEK', 'DAY_OF_MONTH', 'DAY_OF_YEAR', 'GENAI'];

/**
 * Check if album type is time-driven
 * @param {string} type - Album type
 * @returns {boolean}
 */
export function isTimeDrivenAlbum(type) {
    return TIME_DRIVEN_TYPES.includes(type);
}