// utils.js

// ----------------------
// Device / Orientation
// ----------------------
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
}

export function isLandscapeMode() {
  return window.innerWidth > window.innerHeight;
}

// ----------------------
// Time Helpers
// ----------------------
export function formatTime(elapsed) {
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ----------------------
// Hashing & Daily Rotations
// ----------------------
export function simpleHash(str, seed = 0) {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

export function getDailyRotations(maxLayers = 10) {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const rotations = [];
  for (let i = 1; i <= maxLayers; i++) {
    const hash = simpleHash(dateString, i);
    rotations.push(hash % 361);
  }
  return rotations;
}

// ----------------------
// Networking
// ----------------------
export async function checkImageExists(url) {
  try {
    const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-cache' });
    return response.ok;
  } catch {
    return false;
  }
}

// ----------------------
// Mobile UX
// ----------------------
export function preventMobileZoom(doubleTapDelay = 300) {
  let lastTouchEnd = 0;
  document.addEventListener('touchstart', e => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTouchEnd <= doubleTapDelay) e.preventDefault();
    lastTouchEnd = now;
  }, false);
}

// ----------------------
// Math Helpers (Geometry)
// ----------------------

// Normalize angle delta so it’s always between -180° and +180°
export function normalizeAngleDelta(delta) {
  if (delta > 180) return delta - 360;
  if (delta < -180) return delta + 360;
  return delta;
}

// Get angle from mouse/touch event relative to element center
export function getAngleFromEvent(event, element) {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const x = (event.touches ? event.touches[0].clientX : event.clientX) - cx;
  const y = (event.touches ? event.touches[0].clientY : event.clientY) - cy;
  return Math.atan2(y, x) * (180 / Math.PI); // radians → degrees
}
