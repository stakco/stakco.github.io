class StakcoCountdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.active = false;
    this.paused = false;
    this.startTime = null;
    this.pausedElapsedTime = 0;
    this.pauseStartTime = null;
    this.interval = null;
  }

  connectedCallback() {
    this.render();
    this.setupVisibilityHandlers();
    this.setupClickHandler();
  }

  disconnectedCallback() {
    this.stop();
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    window.removeEventListener('blur', this.blurHandler);
    window.removeEventListener('focus', this.focusHandler);
  }

  render() {

    /* html */
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none;
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
        }
        :host(.show) {
          display: block;
          animation: slideDown 0.5s ease-out;
        }
        .container {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 25px;
          padding: 0px 15px;
          font-family: Consolas, "Courier New", Courier, monospace;
          color: var(--primary-color);
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 2px;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-soft);
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .container.hidden {
          opacity: 0;
          pointer-events: none;
        }
        .timer {
          font-size: 24px;
          margin: 0;
          display: inline-block;
          vertical-align: middle;
        }
        .countdown-green { color: white; }
        .countdown-yellow { color: #ffc947; }
        .countdown-orange { color: #ff9900; }
        .countdown-red { color: #ff4444; }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%);
          }
        }
      </style>
      <div class="container">
        <div class="timer">00:00</div>
      </div>
    `;
  }

  setupVisibilityHandlers() {
    this.visibilityHandler = () => {
      if (document.hidden) this.pause();
      else this.resume();
    };
    this.blurHandler = () => this.pause();
    this.focusHandler = () => this.resume();

    document.addEventListener('visibilitychange', this.visibilityHandler);
    window.addEventListener('blur', this.blurHandler);
    window.addEventListener('focus', this.focusHandler);
  }

  setupClickHandler() {
    const container = this.shadowRoot.querySelector('.container');
    container.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('click'));
    });
  }

  start() {
    if (this.active) return;
    
    this.active = true;
    this.paused = false;
    this.startTime = Date.now();
    this.pausedElapsedTime = 0;
    
    this.classList.add('show');
    this.interval = setInterval(() => this.update(), 100);
    
    this.dispatchEvent(new CustomEvent('start'));
  }

  stop() {
    if (!this.active) return;
    
    this.active = false;
    this.paused = false;
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    const container = this.shadowRoot.querySelector('.container');
    const timer = this.shadowRoot.querySelector('.timer');
    timer.style.opacity = '1';
    container.style.borderColor = 'var(--glass-border)';
    container.classList.remove('hidden');
    
    this.dispatchEvent(new CustomEvent('stop', { detail: { time: this.getTime() } }));
  }

  pause() {
    if (!this.active || this.paused) return;
    
    this.paused = true;
    this.pauseStartTime = Date.now();
    
    if (this.startTime) {
      this.pausedElapsedTime = Date.now() - this.startTime;
    }
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    const timer = this.shadowRoot.querySelector('.timer');
    const container = this.shadowRoot.querySelector('.container');
    timer.style.opacity = '0.6';
    container.style.borderColor = 'var(--text-secondary)';
  }

  resume() {
    if (!this.active || !this.paused) return;
    
    this.paused = false;
    
    if (this.pauseStartTime && this.startTime) {
      const pauseDuration = Date.now() - this.pauseStartTime;
      this.startTime += pauseDuration;
    }
    
    this.interval = setInterval(() => this.update(), 100);
    
    const timer = this.shadowRoot.querySelector('.timer');
    const container = this.shadowRoot.querySelector('.container');
    timer.style.opacity = '1';
    container.style.borderColor = 'var(--glass-border)';
    
    this.pauseStartTime = null;
  }

  update() {
    if (!this.active || this.paused || !this.startTime) return;
    
    const elapsed = Date.now() - this.startTime;
    const timeString = this.formatTime(elapsed);
    
    const timer = this.shadowRoot.querySelector('.timer');
    timer.textContent = timeString;
    
    const seconds = Math.floor(elapsed / 1000);
    timer.className = 'timer';
    if (seconds < 120) timer.classList.add('countdown-green');
    else if (seconds < 180) timer.classList.add('countdown-yellow');
    else if (seconds < 300) timer.classList.add('countdown-orange');
    else timer.classList.add('countdown-red');
    
    this.dispatchEvent(new CustomEvent('tick', { detail: { elapsed, timeString } }));
  }

  getTime() {
    if (!this.startTime) return '00:00';
    
    let finalElapsed;
    if (this.paused && this.pausedElapsedTime > 0) {
      finalElapsed = this.pausedElapsedTime;
    } else {
      finalElapsed = Date.now() - this.startTime;
    }
    
    return this.formatTime(finalElapsed);
  }

  formatTime(elapsed) {
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  hide() {
    const container = this.shadowRoot.querySelector('.container');
    container.classList.add('hidden');
  }

  show() {
    const container = this.shadowRoot.querySelector('.container');
    container.classList.remove('hidden');
  }
}

customElements.define('stakco-countdown', StakcoCountdown);