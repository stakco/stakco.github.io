// rotation.js
export function normalizeAngleDelta(delta) {
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return delta;
}

export function getAngleFromEvent(container, clientX, clientY) {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
}

export function applyRotationToElement(element, rotation) {
    if (!element) return;
    element.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
}
