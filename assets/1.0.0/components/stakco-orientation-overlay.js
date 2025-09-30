class StakcoOrientationOverlay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.blocked = false;
  }

  connectedCallback() {
    this.render();
    this.startMonitoring();
  }

  disconnectedCallback() {
    this.stopMonitoring();
  }

  render() {

    /* html */
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          z-index: 10000;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Inter', sans-serif;
          text-align: center;
          padding: 20px;
          box-sizing: border-box;
        }
        :host(.show) {
          display: flex;
        }
        .icon {
          font-size: 120px;
          margin-bottom: 30px;
          color: var(--primary-color);
          animation: rotateDevice 2s ease-in-out infinite;
        }
        .message {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 15px;
          color: white;
        }
        .subtitle {
          font-size: 16px;
          opacity: 0.8;
          line-height: 1.4;
          max-width: 400px;
        }
        @keyframes rotateDevice {
          0%, 100% { 
            transform: rotate(0deg);
          }
          50% { 
            transform: rotate(90deg);
          }
        }
        @media (max-width: 768px) {
          .icon {
            font-size: 80px;
          }
          .message {
            font-size: 20px;
          }
          .subtitle {
            font-size: 14px;
          }
        }
      </style>
      <div class="icon">
        <i class="fa-solid fa-mobile-screen"></i>
      </div>
      <div class="message">Please rotate your device</div>
      <div class="subtitle">
        This game is optimized for portrait mode on mobile devices
      </div>
    `;
  }

  startMonitoring() {
    this.checkOrientation();
    
    this.orientationHandler = () => {
      setTimeout(() => this.checkOrientation(), 100);
    };
    
    this.resizeHandler = () => {
      setTimeout(() => this.checkOrientation(), 100);
    };
    
    window.addEventListener('orientationchange', this.orientationHandler);
    window.addEventListener('resize', this.resizeHandler);
  }

  stopMonitoring() {
    window.removeEventListener('orientationchange', this.orientationHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }

  checkOrientation() {
    const shouldBlock = this.isMobileDevice() && this.isLandscapeMode();
    
    if (shouldBlock !== this.blocked) {
      this.blocked = shouldBlock;
      
      if (this.blocked) {
        this.show();
        document.body.style.pointerEvents = 'none';
        this.style.pointerEvents = 'auto';
        this.dispatchEvent(new CustomEvent('blocked'));
      } else {
        this.hide();
        document.body.style.pointerEvents = 'auto';
        this.dispatchEvent(new CustomEvent('unblocked'));
      }
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
  }

  isLandscapeMode() {
    return window.innerWidth > window.innerHeight;
  }

  show() {
    this.classList.add('show');
  }

  hide() {
    this.classList.remove('show');
  }

  isBlocked() {
    return this.blocked;
  }
}

customElements.define('stakco-orientation-overlay', StakcoOrientationOverlay);