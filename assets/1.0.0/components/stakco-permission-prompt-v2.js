class StakcoPermissionPrompt extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const title = this.getAttribute('title') || 'Enable Permission';
    const message = this.getAttribute('message') || 'This app needs permission to function properly.';
    const primaryLabel = this.getAttribute('primary-label') || 'Enable';
    const secondaryLabel = this.getAttribute('secondary-label') || 'Skip';
    
    /* html */
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
          display: none;
          font-family: 'Inter', sans-serif;
        }
        
        :host(.show) {
          display: block;
        }

        .circle-container {
          position: relative;
          width: min(400px, 80vw);
          height: min(400px, 80vw);
          border-radius: 50%;
          background: var(--primary-gradient);
          box-shadow: var(--shadow-glow);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 30px 80px 30px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .circle-content {
          text-align: center;
          color: white;
          z-index: 2;
        }

        h3 {
          color: var(--primary-color);
          margin: 0 0 20px 0;
          font-size: 24px;
          font-weight: 600;
        }

        p {
          color: white;
          margin: 0;
          line-height: 1.6;
          font-size: 16px;
          max-width: 280px;
        }

        .button-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          z-index: 1;
        }

        .circle-button {
          position: absolute;
          bottom: 0;
          width: 50%;
          height: 60px;
          border: none;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          outline: none;
          -webkit-tap-highlight-color: transparent;
          display: flex;
          align-items: center;
          padding: 0 20px;
        }

        .circle-button.secondary {
          left: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0 0 0 200px;
          justify-content: flex-end;
          text-align: right;
          background: var(--glass-bg);
          color: var(--primary-color);
          border-top: 2px solid var(--primary-color);
        }

        .circle-button.primary {
          right: 0;
          border-left: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0 0 200px 0;
          justify-content: flex-start;
          text-align: left;
          background: var(--primary-gradient);
          color: white;
        }

        .circle-button:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-glow);
        }

        .circle-button:active {
          transform: translateY(0);
        }

        .circle-button.secondary:hover {
          background: rgba(249, 167, 68, 0.2);
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .circle-container {
            width: 90vw;
            height: 90vw;
            padding: 30px 20px 70px 20px;
          }

          h3 {
            font-size: 20px;
            margin-bottom: 15px;
          }

          p {
            font-size: 14px;
            max-width: 220px;
          }

          .circle-button {
            height: 55px;
            font-size: 15px;
          }

          .circle-button.secondary {
            border-radius: 0 0 0 180px;
          }

          .circle-button.primary {
            border-radius: 0 0 180px 0;
          }
        }

        @media (max-width: 360px) {
          .circle-container {
            padding: 25px 15px 60px 15px;
          }

          h3 {
            font-size: 18px;
          }

          p {
            font-size: 13px;
            max-width: 180px;
          }

          .circle-button {
            height: 50px;
            font-size: 14px;
            padding: 0 15px;
          }

          .circle-button.secondary {
            border-radius: 0 0 0 160px;
          }

          .circle-button.primary {
            border-radius: 0 0 160px 0;
          }
        }
      </style>
      
      <div class="circle-container">
        <div class="circle-content">
          <h3>${title}</h3>
          <p>${message}</p>
        </div>
        <div class="button-container">
          <button class="circle-button secondary">${secondaryLabel}</button>
          <button class="circle-button primary">${primaryLabel}</button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const primaryBtn = this.shadowRoot.querySelector('.circle-button.primary');
    const secondaryBtn = this.shadowRoot.querySelector('.circle-button.secondary');
    
    primaryBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('primary-action'));
      this.hide();
    });
    
    secondaryBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('secondary-action'));
      this.hide();
    });
  }

  show() {
    this.classList.add('show');
    this.dispatchEvent(new CustomEvent('show'));
  }

  hide() {
    this.classList.remove('show');
    this.dispatchEvent(new CustomEvent('hide'));
  }
}

customElements.define('stakco-permission-prompt', StakcoPermissionPrompt);
