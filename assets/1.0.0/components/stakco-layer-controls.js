class StakcoLayerControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentLayer = 1;
  }

  connectedCallback() {
    const layers = parseInt(this.getAttribute('layers') || '3');
    this.render(layers);
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.keyHandler);
  }

  render(layers) {
    const buttons = Array.from({ length: layers }, (_, i) => {
      const num = i + 1;
      const activeClass = num === this.currentLayer ? 'active' : '';
      return `<button class="layer-button ${activeClass}" data-layer="${num}">${num}</button>`;
    }).join('');

    /* html */
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          z-index: 1000;
        }
        :host(.hidden) {
          display: none;
        }
        .layer-button {
          width: 50px;
          height: 50px;
          border: 3px solid var(--glass-border);
          border-radius: 50%;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          color: var(--text-secondary);
          background: var(--glass-bg);
          font-family: 'Inter', sans-serif;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }
        .layer-button.active {
          background: var(--primary-gradient);
          border-color: var(--primary-color);
          color: white;
          box-shadow: var(--shadow-glow);
        }
        .layer-button:hover:not(.active) {
          border-color: var(--primary-color);
          color: var(--primary-color);
          box-shadow: var(--shadow-glow);
        }
      </style>
      ${buttons}
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelectorAll('.layer-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const layer = parseInt(e.target.dataset.layer);
        this.setActiveLayer(layer);
      });
    });
  }

  setupKeyboardShortcuts() {
    this.keyHandler = (event) => {
      const key = parseInt(event.key);
      if (key >= 1 && key <= parseInt(this.getAttribute('layers') || '3')) {
        this.setActiveLayer(key);
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }

  setActiveLayer(layer) {
    if (this.currentLayer === layer) return;
    
    this.currentLayer = layer;
    this.shadowRoot.querySelectorAll('.layer-button').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.layer) === layer);
    });
    
    this.dispatchEvent(new CustomEvent('layerchange', { 
      detail: { layer },
      bubbles: true,
      composed: true
    }));
  }

  getActiveLayer() {
    return this.currentLayer;
  }

  hide() {
    this.classList.add('hidden');
  }

  show() {
    this.classList.remove('hidden');
  }
}

customElements.define('stakco-layer-controls', StakcoLayerControls);