// countdown.js
export let countdownActive = false;
export let countdownStartTime = null;
export let countdownInterval = null;

export function startCountdown(container, timerElement, brandingDiv, statusDiv, onUpdate = null) {
    if (countdownActive) return;

    countdownActive = true;
    countdownStartTime = Date.now();

    container.classList.add('show');
    brandingDiv?.classList.add('hidden');
    statusDiv?.classList.add('hidden');

    countdownInterval = setInterval(() => {
        updateCountdownDisplay(container, timerElement);
        if (onUpdate) onUpdate(getFinalTime());
    }, 100);
}

export function stopCountdown() {
    if (!countdownActive) return;

    countdownActive = false;
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

export function resetCountdown(container, timerElement, brandingDiv, statusDiv) {
    stopCountdown();
    container?.classList.remove('show');
    if (timerElement) timerElement.textContent = '00:00';
    brandingDiv?.classList.remove('hidden');
    statusDiv?.classList.remove('hidden');
}

export function updateCountdownDisplay(container, timerElement) {
    if (!countdownActive || !countdownStartTime) return;

    const elapsed = Date.now() - countdownStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

    if (timerElement) timerElement.textContent = timeString;

    // Change color based on ranges
    let color = '#00ff00';
    if (seconds < 120) color = '#00ff00';
    else if (seconds < 180) color = '#ffff00';
    else if (seconds < 300) color = '#ff9900';
    else color = '#ff4444';

    if (timerElement) timerElement.style.color = color;
    if (container) {
        container.style.borderColor = color;
        container.style.boxShadow = `0 0 20px ${color}`;
    }
}

export function getFinalTime() {
    if (!countdownStartTime) return '00:00';
    const elapsed = Date.now() - countdownStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
