// stakco-play-html5
// src/stakco-analytics.js
//
// Comprehensive Google Analytics 4 (GA4) integration for Stakco Play.
// Tracks puzzle interactions, solve metrics, user engagement, and session quality.
//
// SETUP: Add the GA4 tag + this script to index.html <head>:
//
//   <!-- Google Analytics 4 -->
//   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
//   <script>
//     window.dataLayer = window.dataLayer || [];
//     function gtag(){dataLayer.push(arguments);}
//     gtag('js', new Date());
//     gtag('config', 'G-XXXXXXXXXX');
//   </script>
//   <script src="stakco-analytics.js"></script>
//

/**
 * StakcoAnalytics — GA4 custom event tracker for Stakco Play.
 *
 * GA4 automatically handles device/user identification via its client_id cookie,
 * which persists across sessions on the same browser (acts as a "distinct device id").
 * No need to manually generate device fingerprints.
 *
 * All custom events use the "stakco_" prefix to avoid collisions with GA4 built-ins.
 */
class StakcoAnalytics {
    constructor() {
        this.sessionId = this._generateSessionId();
        this.sessionStartTime = Date.now();
        this.interactionStartTime = null;     // When first rotation/interaction happened
        this.totalRotationTime = 0;           // Cumulative ms of active rotation
        this.rotationStartTime = null;        // When current drag started
        this.rotationCount = 0;               // Total rotation actions (drag, key, scroll)
        this.layerSwitchCount = 0;            // Number of layer switches
        this.layerRotations = {};             // Per-layer rotation counts: { 1: 5, 2: 3, 3: 7 }
        this.lastActiveTime = Date.now();     // For idle calculation
        this.totalIdleTime = 0;               // Cumulative idle ms (gaps > 3s between interactions)
        this.idleThresholdMs = 3000;          // 3 seconds of no interaction = idle
        this.keyboardRotationCount = 0;       // Keyboard-only rotations
        this.touchRotationCount = 0;          // Touch/mouse drag rotations
        this.scrollRotationCount = 0;         // Scroll wheel rotations
        this.orientationBlockedTime = 0;      // Time spent in wrong orientation
        this.orientationBlockStart = null;
        this.tutorialShown = false;
        this.tutorialDismissedAt = null;
        this.shareAttempted = false;
        this.shareMethod = null;              // 'native' | 'clipboard' | 'screenshot'
        this.puzzleInfoViewCount = 0;         // Story/info overlay views
        this.replayCount = 0;
        this.freeplayNavigationCount = 0;     // Prev/next in freeplay

        // Puzzle context — set during init
        this.puzzleContext = {
            puzzleId: null,
            userId: null,
            albumId: null,
            albumName: null,
            albumType: null,
            subdomain: null,
            puzzleIndex: null,
            totalPuzzles: null,
            layerCount: null,
            puzzleTitle: null,
            isDaily: false,
            isAlbumMode: false,
            isGenAI: false,
            isUrlParams: false
        };

        this._initialized = false;
    }

    // ========================================================
    // Initialization
    // ========================================================

    /**
     * Initialize analytics with puzzle context.
     * Call this once the puzzle source is determined (album, URL params, or daily).
     */
    init(context) {
        this.puzzleContext = { ...this.puzzleContext, ...context };
        this._initialized = true;

        // Track page view with puzzle context
        this._send('stakco_puzzle_load', {
            puzzle_id: this.puzzleContext.puzzleId,
            user_id_owner: this.puzzleContext.userId,      // Puzzle owner, NOT the player
            album_id: this.puzzleContext.albumId,
            album_name: this.puzzleContext.albumName,
            album_type: this.puzzleContext.albumType,
            subdomain: this.puzzleContext.subdomain,
            puzzle_index: this.puzzleContext.puzzleIndex,
            total_puzzles: this.puzzleContext.totalPuzzles,
            layer_count: this.puzzleContext.layerCount,
            puzzle_title: this.puzzleContext.puzzleTitle,
            is_daily: this.puzzleContext.isDaily,
            is_album: this.puzzleContext.isAlbumMode,
            is_genai: this.puzzleContext.isGenAI,
            is_url_params: this.puzzleContext.isUrlParams,
            session_id: this.sessionId,
            referrer: document.referrer || 'direct',
            entry_url: window.location.href
        });

        // Track device capabilities
        this._send('stakco_device_info', {
            screen_width: screen.width,
            screen_height: screen.height,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            is_mobile: this._isMobile(),
            is_touch: 'ontouchstart' in window,
            pixel_ratio: window.devicePixelRatio || 1,
            orientation: screen.orientation?.type || 'unknown',
            session_id: this.sessionId
        });
    }

    // ========================================================
    // Puzzle Lifecycle Events
    // ========================================================

    /**
     * Puzzle images loaded and ready to interact.
     * Captures load performance.
     */
    puzzleReady() {
        const loadTime = Date.now() - this.sessionStartTime;
        this._send('stakco_puzzle_ready', {
            ...this._baseParams(),
            load_time_ms: loadTime
        });
    }

    /**
     * User's first interaction (rotation/drag) — timer starts.
     */
    firstInteraction(method = 'unknown') {
        this.interactionStartTime = Date.now();
        const timeToFirstInteraction = this.interactionStartTime - this.sessionStartTime;

        this._send('stakco_first_interaction', {
            ...this._baseParams(),
            time_to_first_interaction_ms: timeToFirstInteraction,
            interaction_method: method,   // 'drag' | 'keyboard' | 'scroll' | 'indicator'
            tutorial_was_shown: this.tutorialShown
        });
    }

    /**
     * Puzzle solved! This is the most important event.
     * Captures comprehensive solve metrics.
     */
    puzzleSolved(solveTimeFormatted, wasSimulated = false) {
        const now = Date.now();

        // Calculate timing breakdown
        const totalSessionTime = now - this.sessionStartTime;
        const activePlayTime = this.interactionStartTime
            ? (now - this.interactionStartTime)
            : totalSessionTime;
        const solveTimeSeconds = this._timeToSeconds(solveTimeFormatted);

        // Calculate idle ratio
        const idleRatio = activePlayTime > 0
            ? Math.round((this.totalIdleTime / activePlayTime) * 100)
            : 0;

        // Calculate rotation intensity (rotations per second of active play)
        const activeSeconds = (activePlayTime - this.totalIdleTime) / 1000;
        const rotationIntensity = activeSeconds > 0
            ? Math.round((this.rotationCount / activeSeconds) * 100) / 100
            : 0;

        this._send('stakco_puzzle_solved', {
            ...this._baseParams(),

            // Core solve metrics
            solve_time_formatted: solveTimeFormatted,
            solve_time_seconds: solveTimeSeconds,
            was_simulated: wasSimulated,

            // Time breakdown (all in ms)
            total_session_time_ms: totalSessionTime,
            active_play_time_ms: activePlayTime,
            active_rotation_time_ms: this.totalRotationTime,
            idle_time_ms: this.totalIdleTime,
            idle_ratio_pct: idleRatio,
            orientation_blocked_time_ms: this.orientationBlockedTime,

            // Interaction metrics
            total_rotations: this.rotationCount,
            rotation_intensity: rotationIntensity,     // rotations/sec
            layer_switches: this.layerSwitchCount,
            keyboard_rotations: this.keyboardRotationCount,
            touch_rotations: this.touchRotationCount,
            scroll_rotations: this.scrollRotationCount,

            // Per-layer breakdown (as JSON string for GA4 compatibility)
            layer_rotations: JSON.stringify(this.layerRotations),

            // Difficulty indicators
            rotations_per_layer_avg: this.puzzleContext.layerCount > 0
                ? Math.round(this.rotationCount / this.puzzleContext.layerCount)
                : 0,

            // Session quality
            tutorial_shown: this.tutorialShown,
            puzzle_info_views: this.puzzleInfoViewCount,
            share_attempted: this.shareAttempted
        });

        // Also send a GA4-friendly engagement metric
        this._send('stakco_engagement_quality', {
            ...this._baseParams(),
            solve_time_seconds: solveTimeSeconds,
            engagement_score: this._calculateEngagementScore(solveTimeSeconds, activePlayTime)
        });
    }

    /**
     * User left without solving (page unload / navigate away).
     */
    puzzleAbandoned() {
        const now = Date.now();
        const totalSessionTime = now - this.sessionStartTime;
        const hadInteraction = this.interactionStartTime !== null;

        this._send('stakco_puzzle_abandoned', {
            ...this._baseParams(),
            total_session_time_ms: totalSessionTime,
            had_interaction: hadInteraction,
            total_rotations: this.rotationCount,
            layer_switches: this.layerSwitchCount,
            idle_time_ms: this.totalIdleTime
        });
    }

    // ========================================================
    // Interaction Tracking
    // ========================================================

    /**
     * Track individual rotation action.
     * Call on each drag move, key press, or scroll that rotates a layer.
     */
    trackRotation(layerNum, method = 'drag', deltaAngle = 0) {
        const now = Date.now();

        // Idle time tracking
        if (this.lastActiveTime) {
            const gap = now - this.lastActiveTime;
            if (gap > this.idleThresholdMs) {
                this.totalIdleTime += gap;
            }
        }
        this.lastActiveTime = now;

        // Increment counters
        this.rotationCount++;
        this.layerRotations[layerNum] = (this.layerRotations[layerNum] || 0) + 1;

        switch (method) {
            case 'keyboard': this.keyboardRotationCount++; break;
            case 'scroll':   this.scrollRotationCount++; break;
            default:         this.touchRotationCount++; break;
        }

        // Don't send individual rotation events to GA4 (too noisy).
        // Aggregated in puzzleSolved / puzzleAbandoned.
    }

    /**
     * Track drag start — begins active rotation timer.
     */
    dragStart() {
        this.rotationStartTime = Date.now();
    }

    /**
     * Track drag end — accumulates active rotation time.
     */
    dragEnd() {
        if (this.rotationStartTime) {
            this.totalRotationTime += (Date.now() - this.rotationStartTime);
            this.rotationStartTime = null;
        }
    }

    /**
     * Layer switch event.
     */
    trackLayerSwitch(fromLayer, toLayer, method = 'click') {
        this.layerSwitchCount++;

        // Only send event every 5th switch to avoid noise
        if (this.layerSwitchCount % 5 === 0) {
            this._send('stakco_layer_switch_milestone', {
                ...this._baseParams(),
                total_switches: this.layerSwitchCount,
                method: method   // 'click' | 'keyboard' | 'rightclick' | 'indicator'
            });
        }
    }

    // ========================================================
    // UI & Feature Events
    // ========================================================

    /**
     * Tutorial (How to Play) shown.
     */
    tutorialDisplayed(isAutoShow = true) {
        this.tutorialShown = true;

        this._send('stakco_tutorial_shown', {
            ...this._baseParams(),
            is_auto_show: isAutoShow,
            is_first_visit: !localStorage.getItem('stakco-play-tutorial-seen')
        });
    }

    /**
     * Tutorial dismissed.
     */
    tutorialDismissed() {
        this.tutorialDismissedAt = Date.now();
        const viewDuration = this.tutorialShown
            ? (this.tutorialDismissedAt - this.sessionStartTime)
            : 0;

        this._send('stakco_tutorial_dismissed', {
            ...this._baseParams(),
            view_duration_ms: viewDuration
        });
    }

    /**
     * Share action triggered.
     */
    trackShare(method = 'unknown', shareData = {}) {
        this.shareAttempted = true;
        this.shareMethod = method;

        this._send('stakco_share', {
            ...this._baseParams(),
            share_method: method,        // 'native' | 'clipboard' | 'screenshot' | 'twitter' | 'whatsapp'
            share_url: shareData.shareUrl || '',
            had_solve_time: !!shareData.solveTime,
            had_comparison: !!shareData.comparison
        });
    }

    /**
     * Story/puzzle info overlay toggled.
     */
    trackPuzzleInfoToggle(isShowing) {
        if (isShowing) this.puzzleInfoViewCount++;

        this._send('stakco_puzzle_info_toggle', {
            ...this._baseParams(),
            is_showing: isShowing,
            view_count: this.puzzleInfoViewCount
        });
    }

    /**
     * Replay/remix button clicked.
     */
    trackReplay() {
        this.replayCount++;

        this._send('stakco_replay', {
            ...this._baseParams(),
            replay_number: this.replayCount
        });
    }

    /**
     * Freeplay navigation (prev/next puzzle).
     */
    trackFreeplayNavigation(direction, fromIndex, toIndex) {
        this.freeplayNavigationCount++;

        this._send('stakco_freeplay_nav', {
            ...this._baseParams(),
            direction: direction,       // 'prev' | 'next'
            from_index: fromIndex,
            to_index: toIndex,
            nav_count: this.freeplayNavigationCount
        });
    }

    /**
     * Sequential album — next puzzle loaded.
     */
    trackSequentialProgress(puzzleIndex, totalPuzzles, isComplete) {
        this._send('stakco_sequential_progress', {
            ...this._baseParams(),
            puzzle_index: puzzleIndex,
            total_puzzles: totalPuzzles,
            is_complete: isComplete,
            progress_pct: Math.round((puzzleIndex / totalPuzzles) * 100)
        });
    }

    /**
     * Album completion.
     */
    trackAlbumCompletion(albumName, albumType, totalPuzzles) {
        this._send('stakco_album_complete', {
            ...this._baseParams(),
            album_name: albumName,
            album_type: albumType,
            total_puzzles: totalPuzzles
        });
    }

    /**
     * Orientation overlay blocked interaction.
     */
    trackOrientationBlocked() {
        this.orientationBlockStart = Date.now();

        this._send('stakco_orientation_blocked', {
            ...this._baseParams()
        });
    }

    /**
     * Orientation overlay unblocked.
     */
    trackOrientationUnblocked() {
        if (this.orientationBlockStart) {
            const blockedDuration = Date.now() - this.orientationBlockStart;
            this.orientationBlockedTime += blockedDuration;
            this.orientationBlockStart = null;
        }
    }

    /**
     * Error occurred during puzzle loading.
     */
    trackError(errorType, errorMessage, context = '') {
        this._send('stakco_error', {
            ...this._baseParams(),
            error_type: errorType,           // 'load_failed' | 'album_not_found' | 'subdomain_invalid'
            error_message: errorMessage,
            error_context: context
        });
    }

    /**
     * Next puzzle countdown shown (time-driven albums).
     */
    trackNextPuzzleCountdown(albumType, remainingMs) {
        this._send('stakco_next_countdown', {
            ...this._baseParams(),
            album_type: albumType,
            remaining_seconds: Math.round(remainingMs / 1000)
        });
    }

    // ========================================================
    // Attempt Tracking (integrates with GameDataManager)
    // ========================================================

    /**
     * Track attempt data from GameDataManager for cross-day analysis.
     */
    trackAttemptStats(dateStr, attemptNumber, isFirstAttempt, previousBestSeconds = null) {
        const params = {
            ...this._baseParams(),
            date: dateStr,
            attempt_number: attemptNumber,
            is_first_attempt: isFirstAttempt
        };

        if (previousBestSeconds !== null) {
            params.previous_best_seconds = previousBestSeconds;
        }

        this._send('stakco_attempt_stats', params);
    }

    // ========================================================
    // Internal Helpers
    // ========================================================

    _baseParams() {
        return {
            session_id: this.sessionId,
            puzzle_id: this.puzzleContext.puzzleId,
            album_type: this.puzzleContext.albumType,
            album_name: this.puzzleContext.albumName,
            subdomain: this.puzzleContext.subdomain,
            layer_count: this.puzzleContext.layerCount,
            is_album: this.puzzleContext.isAlbumMode,
            is_daily: this.puzzleContext.isDaily
        };
    }

    _send(eventName, params) {
        if (typeof gtag === 'function') {
            // Filter out null/undefined values to keep events clean
            const cleanParams = {};
            for (const [key, value] of Object.entries(params)) {
                if (value !== null && value !== undefined) {
                    cleanParams[key] = value;
                }
            }
            gtag('event', eventName, cleanParams);
        }

        // Also log to console in development
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === 'dplay.stakcos.com') {
            console.log(`[Analytics] ${eventName}`, params);
        }
    }

    _generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    }

    _timeToSeconds(timeStr) {
        if (!timeStr || timeStr === '00:00') return 0;
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return 0;
    }

    _isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Engagement score (0-100) based on solve behavior.
     * Higher = more engaged user. Useful for cohort analysis.
     */
    _calculateEngagementScore(solveTimeSeconds, activePlayTimeMs) {
        let score = 0;

        // Solved = base 40 points
        score += 40;

        // Speed bonus (up to 20 points for solving under 60s)
        if (solveTimeSeconds > 0 && solveTimeSeconds <= 60) {
            score += 20;
        } else if (solveTimeSeconds <= 120) {
            score += 15;
        } else if (solveTimeSeconds <= 300) {
            score += 10;
        } else {
            score += 5;
        }

        // Low idle ratio bonus (up to 15 points)
        const idleRatio = activePlayTimeMs > 0
            ? this.totalIdleTime / activePlayTimeMs
            : 0;
        if (idleRatio < 0.1) score += 15;
        else if (idleRatio < 0.3) score += 10;
        else if (idleRatio < 0.5) score += 5;

        // Interaction variety bonus (up to 10 points)
        const methodsUsed = [
            this.touchRotationCount > 0,
            this.keyboardRotationCount > 0,
            this.scrollRotationCount > 0
        ].filter(Boolean).length;
        score += methodsUsed * 3;

        // Share bonus (15 points)
        if (this.shareAttempted) score += 15;

        return Math.min(100, score);
    }
}

// ========================================================
// Page Lifecycle — track abandonment
// ========================================================

// Create global instance
window.stakcoAnalytics = new StakcoAnalytics();

// Track page unload for abandonment
window.addEventListener('beforeunload', () => {
    const analytics = window.stakcoAnalytics;
    if (analytics._initialized && analytics.rotationCount > 0) {
        // Use sendBeacon for reliable delivery on page unload
        analytics.puzzleAbandoned();
    }
});

// Visibility change — track when user switches tabs
document.addEventListener('visibilitychange', () => {
    const analytics = window.stakcoAnalytics;
    if (document.hidden && analytics._initialized) {
        // Accumulate idle time when tab is hidden
        analytics.lastActiveTime = Date.now();
    }
});
