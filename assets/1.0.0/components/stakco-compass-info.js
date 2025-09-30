class StakcoCompassInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 25px;
          padding: 10px 20px;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-soft);
          z-index: 800;
          display: none;
          align-items: center;
          gap: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          flex-direction: row;
        }
        :host(.show) {
          display: flex;
        }
        .compass-data {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-primary);
        }
        .compass-label {
          color: var(--text-secondary);
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 1px;
        }
        .compass-value {
          color: var(--primary-color);
          font-weight: 600;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }
        @media (max-width: 768px) {
          :host {
            gap: 10px;
          }
        }
      </style>
      <div class="compass-data">
        <span class="compass-label">Heading:</span>
        <span class="compass-value" id="heading">0°</span>
      </div>
      <div class="compass-data">
        <span class="compass-label">Rotation:</span>
        <span class="compass-value" id="rotation">0°</span>
      </div>
    `;
  }

  updateHeading(degrees) {
    const heading = this.shadowRoot.getElementById('heading');
    heading.textContent = `${Math.round(degrees)}°`;
  }

  updateRotation(degrees) {
    const rotation = this.shadowRoot.getElementById('rotation');
    let displayRotation = degrees % 360;
    if (displayRotation < 0) displayRotation += 360;
    rotation.textContent = `${Math.round(displayRotation)}°`;
  }

  show() {
    this.classList.add('show');
  }

  hide() {
    this.classList.remove('show');
  }
}

customElements.define('stakco-compass-info', StakcoCompassInfo);