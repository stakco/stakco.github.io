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
          background: var(--glass-bg);
          border: 2px solid var(--primary-color);
          border-radius: 20px;
          color: var(--text-primary);
          padding: 40px;
          text-align: center;
          z-index: 10000;
          max-width: 400px;
          width: 90%;
          display: none;
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-glow);
          font-family: 'Inter', sans-serif;
        }
        :host(.show) {
          display: block;
        }
        h3 {
          color: var(--primary-color);
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: 600;
          margin-top: 0;
        }
        p {
          color: var(--text-primary);
          margin-bottom: 30px;
          line-height: 1.5;
          font-size: 16px;
        }
        .button {
          background: var(--primary-gradient);
          color: white;
          border: none;
          padding: 15px 25px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin: 0 10px;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          box-shadow: var(--shadow-soft);
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }
        .button:hover {
          box-shadow: var(--shadow-glow);
        }
        .button.secondary {
          background: var(--glass-bg);
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
        }
        .button.secondary:hover {
          background: rgba(249, 167, 68, 0.1);
        }
      </style>
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="button primary">${primaryLabel}</button>
      <button class="button secondary">${secondaryLabel}</button>
    `;
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