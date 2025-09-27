// utils.js
export function getFinalTime(countdownStartTime) {
    if (!countdownStartTime) return '00:00';
    const elapsed = Date.now() - countdownStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const puzzle = urlParams.get('puzzle');
    return { username, puzzle, hasParams: urlParams.toString() !== '' };
}

export function toggleClass(element, className) {
    if (!element) return;
    element.classList.toggle(className);
}

export function createElement(tag, options = {}) {
    const el = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
        if (key === 'className') el.className = value;
        else if (key === 'textContent') el.textContent = value;
        else el.setAttribute(key, value);
    });
    return el;
}

export async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-cache' });
        return response.ok;
    } catch (error) {
        return false;
    }
}
