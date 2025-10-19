export const StakcoUtils = {
  // Image loading utilities
  loadPuzzleImages(userId, puzzleId, puzzleType, noOfLayers = 3) {
    const dateStr = date.toISOString().split('T')[0];
    const baseUrl = 'https://storage.googleapis.com/stakco-images';
    const puzzlePrefix = puzzleId.split('_')[0];

    // Base path conditionally includes date for non-user puzzles
    const basePath =
      puzzleType === 'play'
        ? `${baseUrl}/${userId}/${dateStr}/${puzzleId}`
        : `${baseUrl}/${userId}/${puzzleId}`;

    const layers = {};

    for (let i = 0; i < noOfLayers; i++) {
      layers[`layer${i + 1}`] = `${basePath}/${puzzlePrefix}_${i}.png`;
    }

    return layers;
  },

  // Rotation utilities
  normalizeRotation(rotation) {
    return ((rotation % 360) + 360) % 360;
  },

  randomRotation() {
    return Math.floor(Math.random() * 360);
  },

  rotationsAligned(rotations, tolerance = 2) {
    const normalized = rotations.map(r => this.normalizeRotation(r));
    
    for (let i = 1; i < normalized.length; i++) {
      if (Math.abs(normalized[0] - normalized[i]) > tolerance) {
        return false;
      }
    }
    return true;
  },

  // Time formatting
  formatTime(elapsed) {
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  // Screenshot utilities
  async captureScreenshot(element, backgroundColor = null) {
    if (!window.html2canvas) {
      throw new Error('html2canvas library not loaded');
    }
    
    const bg = backgroundColor || getComputedStyle(document.body).getPropertyValue('--text-primary') || '#000000';
    
    const canvas = await html2canvas(element, {
      backgroundColor: bg,
      scale: 2,
      useCORS: true,
      allowTaint: false
    });
    
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png', 0.9);
    });
  },

  // Vibration utilities
  vibrate(pattern = [200, 100, 300, 100, 200]) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },

  // Device detection
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
  },

  // Touch utilities
  preventZoom() {
    document.addEventListener('touchstart', function (e) {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  },

  // Orientation permission (iOS)
  async requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting orientation permission:', error);
        return false;
      }
    }
    return true; // Permission not needed
  },

  // Check if orientation is supported
  isOrientationSupported() {
    return 'DeviceOrientationEvent' in window;
  }
};