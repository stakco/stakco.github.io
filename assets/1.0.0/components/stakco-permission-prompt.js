/**
 * Stakco Permission Prompt
 * A circular frosted-glass overlay that sits exactly over the puzzle circle
 * and asks the user to enable a device capability (sensor, MIDI, HID, ...).
 *
 * Usage:
 *   <stakco-permission-prompt
 *       icon="fa-solid fa-person-walking"      (optional, Font Awesome classes)
 *       title="Enable Motion"
 *       message="Rotate the layers as you walk."
 *       primary-label="Enable"
 *       secondary-label="Skip"
 *       target="stakco-puzzle-container">     (optional CSS selector to cover)
 *   </stakco-permission-prompt>
 *
 * Events: primary-action, secondary-action, show, hide
 * Methods: show(), hide()
 *
 * Without a matching target the circle is centred in the viewport using the
 * same size formula as <stakco-puzzle-container>.
 */

const FONT_AWESOME_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
const DEFAULT_TARGET = 'stakco-puzzle-container';

class StakcoPermissionPrompt extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'message', 'primary-label', 'secondary-label', 'icon', 'target'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._position = this._position.bind(this);
    this._resizeObserver = null;
    this._rendered = false;
  }

  connectedCallback() {
    if (!this._rendered) {
      this.render();
      this.setupEventListeners();
      this._rendered = true;
    }
    this._update();
  }

  disconnectedCallback() {
    this._stopTracking();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._rendered || oldValue === newValue) return;
    if (name === 'target') {
      if (this.classList.contains('show')) this._startTracking();
    } else {
      this._update();
    }
  }

  render() {
    // Font Awesome's @font-face must exist at document level; the class rules
    // are added inside the shadow root below. Most apps already load FA.
    this._ensureDocumentFontAwesome();

    /* html */
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${FONT_AWESOME_URL}">
      <style>
        :host {
          --prompt-size: min(90vmin, calc(100vw - 20px), calc(100vh - 200px));
          position: fixed;
          top: 50%;
          left: 50%;
          width: var(--prompt-size);
          height: var(--prompt-size);
          transform: translate(-50%, -50%);
          box-sizing: border-box;
          border-radius: 50%;
          background: var(--glass-bg, rgba(255, 255, 255, 0.25));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.18));
          box-shadow: var(--shadow-soft, 0 8px 32px rgba(31, 38, 135, 0.37));
          color: #fff;
          font-family: 'Inter', sans-serif;
          text-align: center;
          z-index: 10000;
          container-type: size;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.4s ease, visibility 0s linear 0.4s;
        }
        :host(.positioned) {
          transform: none;
        }
        :host(.show) {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition: opacity 0.4s ease, visibility 0s linear 0s;
        }
        @media (prefers-reduced-motion: reduce) {
          :host, :host(.show) { transition: none; }
        }

        /* Content stays inside the circle's inscribed square (~70%). */
        .inner {
          box-sizing: border-box;
          width: 70%;
          max-height: 70%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(6px, 2.6cqmin, 14px);
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(38px, 15cqmin, 70px);
          height: clamp(38px, 15cqmin, 70px);
          flex: 0 0 auto;
          border-radius: 50%;
          background: var(--primary-gradient, linear-gradient(135deg, #f9a743 0%, #ffc947 100%));
          box-shadow: var(--shadow-glow, 0 0 40px rgba(249, 167, 68, 0.4));
          color: #fff;
          font-size: clamp(17px, 6.4cqmin, 30px);
        }
        .icon[hidden] { display: none; }

        h3 {
          margin: 0;
          color: var(--primary-color, #f9a743);
          font-size: clamp(16px, 5.6cqmin, 26px);
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: 0.2px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.4);
        }

        p {
          margin: 0;
          color: #fff;
          font-size: clamp(12px, 3.6cqmin, 16px);
          line-height: 1.45;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 6px rgba(0, 0, 0, 0.4);
        }
        p:empty { display: none; }

        .actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(6px, 2.4cqmin, 12px);
          margin-top: clamp(2px, 1.6cqmin, 8px);
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          height: clamp(34px, 10.5cqmin, 50px);
          padding: 0 clamp(14px, 5.2cqmin, 28px);
          border-radius: 50px;
          font-family: 'Inter', sans-serif;
          font-size: clamp(12px, 3.3cqmin, 15px);
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          outline: none;
          -webkit-tap-highlight-color: transparent;
          transition: box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }
        .button.primary {
          background: var(--primary-gradient, linear-gradient(135deg, #f9a743 0%, #ffc947 100%));
          color: #fff;
          border: none;
          box-shadow: var(--shadow-glow, 0 0 40px rgba(249, 167, 68, 0.4));
        }
        .button.primary:hover {
          box-shadow: 0 6px 25px rgba(249, 167, 68, 0.6);
        }
        .button.secondary {
          background: rgba(60, 47, 56, 0.35);
          color: var(--primary-color, #f9a743);
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.18));
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .button.secondary:hover {
          background: rgba(249, 167, 68, 0.15);
          border-color: var(--primary-color, #f9a743);
        }
        /* Very small circles (short windows): drop secondary content first. */
        @container (max-height: 300px) {
          .icon { display: none; }
        }
        @container (max-height: 260px) {
          p { display: none; }
        }
        @container (max-height: 200px) {
          .inner { width: 84%; max-height: 84%; }
          .icon { display: none; }
        }
        .button:focus-visible {
          box-shadow: 0 0 0 3px rgba(249, 167, 68, 0.6);
        }
      </style>
      <div class="inner" role="dialog" aria-modal="true" aria-labelledby="prompt-title">
        <div class="icon" aria-hidden="true"><i></i></div>
        <h3 id="prompt-title"></h3>
        <p></p>
        <div class="actions">
          <button type="button" class="button primary"></button>
          <button type="button" class="button secondary"></button>
        </div>
      </div>
    `;
  }

  _update() {
    const root = this.shadowRoot;
    if (!root) return;
    const icon = (this.getAttribute('icon') || '').trim();
    const iconWrap = root.querySelector('.icon');
    iconWrap.hidden = !icon;
    iconWrap.querySelector('i').className = icon;
    root.querySelector('h3').innerHTML = this.getAttribute('title') || 'Enable Permission';
    root.querySelector('p').innerHTML = this.getAttribute('message') || 'This app needs permission to function properly.';
    root.querySelector('.button.primary').textContent = this.getAttribute('primary-label') || 'Enable';
    root.querySelector('.button.secondary').textContent = this.getAttribute('secondary-label') || 'Skip';
  }

  _ensureDocumentFontAwesome() {
    const hasFA = document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]');
    if (hasFA) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_AWESOME_URL;
    document.head.appendChild(link);
  }

  setupEventListeners() {
    const primaryBtn = this.shadowRoot.querySelector('.button.primary');
    const secondaryBtn = this.shadowRoot.querySelector('.button.secondary');

    primaryBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('primary-action'));
      this.hide();
    });

    secondaryBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('secondary-action'));
      this.hide();
    });
  }

  _getTarget() {
    const selector = this.getAttribute('target') || DEFAULT_TARGET;
    try {
      return document.querySelector(selector);
    } catch (e) {
      return null;
    }
  }

  /** Place the circle over the target's bounding rect (or centre it). */
  _position() {
    const target = this._getTarget();
    const rect = target ? target.getBoundingClientRect() : null;
    if (rect && rect.width > 0 && rect.height > 0) {
      const size = Math.min(rect.width, rect.height);
      this.style.left = `${rect.left + (rect.width - size) / 2}px`;
      this.style.top = `${rect.top + (rect.height - size) / 2}px`;
      this.style.width = `${size}px`;
      this.style.height = `${size}px`;
      this.classList.add('positioned');
    } else {
      // Fall back to the stylesheet default: viewport-centred, puzzle-sized.
      this.style.removeProperty('left');
      this.style.removeProperty('top');
      this.style.removeProperty('width');
      this.style.removeProperty('height');
      this.classList.remove('positioned');
    }
  }

  _startTracking() {
    this._stopTracking();
    window.addEventListener('resize', this._position);
    window.addEventListener('scroll', this._position, { passive: true });
    const target = this._getTarget();
    if (target && typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(this._position);
      this._resizeObserver.observe(target);
      this._resizeObserver.observe(document.documentElement);
    }
    this._position();
    // Re-measure after layout settles (fonts, late components).
    requestAnimationFrame(() => requestAnimationFrame(this._position));
  }

  _stopTracking() {
    window.removeEventListener('resize', this._position);
    window.removeEventListener('scroll', this._position);
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  show() {
    this._startTracking();
    this.classList.add('show');
    this.dispatchEvent(new CustomEvent('show'));
  }

  hide() {
    this.classList.remove('show');
    this._stopTracking();
    this.dispatchEvent(new CustomEvent('hide'));
  }
}

customElements.define('stakco-permission-prompt', StakcoPermissionPrompt);
