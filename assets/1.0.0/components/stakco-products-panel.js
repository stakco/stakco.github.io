class StakcoProductsPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.expanded = false;
    // Resolve relative to wherever this file is served from:
    //   https://cdn.stakcos.com/components/…            → https://cdn.stakcos.com/apps/manifest.json
    //   https://stakcos.com/assets/1.0.0/components/…   → https://stakcos.com/assets/1.0.0/apps/manifest.json
    this.MANIFEST_URL = new URL('../apps/manifest.json', StakcoProductsPanel.BASE_URL).href;
    this.LOGO_URL = new URL('../images/stakco_logo_squricle.png', StakcoProductsPanel.BASE_URL).href;
    this.products = null;
  }

  async connectedCallback() {
    await this.loadProducts();
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.outsideClickHandler);
    document.removeEventListener('keydown', this.keyHandler);
  }

  getParentUrlParams() {
    try {
      const parentUrl = new URL(window.location.href);
      return parentUrl.search;
    } catch (error) {
      console.error('Failed to get parent URL params:', error);
      return '';
    }
  }

  async loadProducts() {
    try {
      const response = await fetch(this.MANIFEST_URL);
      const data = await response.json();
      this.products = data.apps || this.getDefaultProducts();
    } catch (error) {
      console.error('Failed to load products manifest:', error);
      this.products = this.getDefaultProducts();
    }
  }

  render() {
    const products = this.products || this.getDefaultProducts();
    const urlParams = this.getParentUrlParams();
    
    /* html */
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <style>
        :host {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 2500;
        }
        .button {
            position: absolute;
            left: -50px;
          border: none;
          cursor: pointer;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: url('${this.LOGO_URL}') no-repeat center;
          background-size: contain;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-soft);
          outline: none;
          z-index: 3000;
          -webkit-tap-highlight-color: transparent;
        }
        .button:hover {
          box-shadow: var(--shadow-glow);
        }
        .panel {
          position: absolute;
          top: 0;
          right: 0;
          border: none;
          height: 50px;
          border-radius: 25px;
          background: var(--glass-bg);
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          z-index: 2000;
          width: 0;
          overflow: hidden;
          display: flex;
          align-items: flex-start;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-soft);
          flex-direction: column;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .panel.expanding {
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }
        .panel.collapsing {
          transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }
        .panel.expanded {
          width: calc(100vw - 40px);
          height: calc(100vh - 40px);
          background: rgba(36, 27, 34, 0.88);
          -webkit-backdrop-filter: blur(24px) saturate(1.2);
          backdrop-filter: blur(24px) saturate(1.2);
        }
        .content {
          width: calc(100% - 40px);
          margin: 0 20px 20px;
          opacity: 0;
          transition: opacity 0.3s ease 0.8s;
          color: #fff;
          text-shadow: none;
          overflow-y: auto;
          height: calc(100% - 20px);
          box-sizing: border-box;
          padding: 0 4px 4px;
          display: flex;
          flex-direction: column;
        }
        /* Header sits at the top; the cards are centred in the space below.
           margin:auto (not justify-content) so tall content still scrolls from the top. */
        .inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .grid-area {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .grid-area .products-grid {
          margin: auto;
          width: 100%;
        }
        .panel.expanded .content {
          opacity: 1;
        }
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-height: 50px;
          justify-content: center;
          margin: 0 56px 20px;
          text-align: center;
        }
        h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          color: #fff;
        }
        .subtitle {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.72);
        }
        /* Compact cards: icon tile + name + short line, many per screen */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(250px, 100%), 1fr));
          gap: 12px;
          max-width: 1180px;
          margin: 0 auto;
        }
        .product-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.07);
          color: inherit;
          text-decoration: none;
          transition: background 0.2s ease, box-shadow 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .product-card:hover,
        .product-card:focus-visible {
          background: rgba(255, 255, 255, 0.14);
          box-shadow: var(--shadow-soft);
          outline: none;
        }
        .product-card.current {
          background: rgba(249, 167, 68, 0.18);
        }
        .product-icon {
          flex: none;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: var(--primary-gradient);
          color: white;
          font-size: 21px;
          box-shadow: var(--shadow-soft);
        }
        .product-text {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .product-title {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .here {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 999px;
          background: var(--primary-color);
          color: #2a1f27;
        }
        .product-description {
          font-size: 13px;
          line-height: 1.35;
          color: rgba(255, 255, 255, 0.78);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        /* Phones: two columns of icon + name tiles so every app fits on screen */
        @media (max-width: 600px) {
          .header { margin: 0 52px 14px; }
          h3 { font-size: 17px; }
          .subtitle { font-size: 13px; }
          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
          .product-card {
            flex-direction: column;
            text-align: center;
            gap: 8px;
            padding: 14px 10px;
          }
          .product-text { align-items: center; }
          .product-title { font-size: 14px; justify-content: center; flex-wrap: wrap; gap: 4px; }
          .product-description { display: none; }
          .product-icon { width: 44px; height: 44px; font-size: 19px; border-radius: 13px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .panel, .content, .product-card { transition: none !important; }
        }
      </style>
      <button class="button" part="button"></button>
      <div class="panel" part="panel">
        <div class="content" part="content">
          <div class="inner">
          <div class="header">
            <h3>Explore Stakco Apps</h3>
            <p class="subtitle">Same puzzle, endless experiences</p>
          </div>
          <div class="grid-area">
          <div class="products-grid">
            ${products.map(product => {
              const productUrl = product.url + urlParams;
              const current = this.isCurrent(product.url);
              const name = (product.title || '').replace(/^Stakco\s+/i, '');
              return `
              <a href="${productUrl}" class="product-card${current ? ' current' : ''}" target="_blank" rel="noopener"
                 title="${product.title}" aria-label="${product.title}${current ? ' (this app)' : ''}">
                <span class="product-icon"><i class="${product.icon}"></i></span>
                <span class="product-text">
                  <span class="product-title">${name}${current ? '<span class="here">Here</span>' : ''}</span>
                  <span class="product-description">${product.description}</span>
                </span>
              </a>
            `;
            }).join('')}
          </div>
          </div>
          </div>
        </div>
      </div>
    `;
  }

  // True when the card points at the app this page is
  isCurrent(url) {
    try {
      const target = new URL(url);
      const here = window.location;
      const clean = p => p.replace(/\/+$/, '') || '/';
      if (here.hostname === 'play.stakcos.com') return clean(target.pathname) === '/play';
      return target.hostname === here.hostname && clean(target.pathname) === clean(here.pathname);
    } catch (e) {
      return false;
    }
  }

  getDefaultProducts() {
    return [
      {
        title: 'Stakco Play',
        description: 'Classic Stakco - Touch and drag to rotate puzzle layers and align all pieces',
        url: 'https://stakcos.com/play',
        urlDisplay: 'stakcos.com/play',
        icon: 'fa-solid fa-gamepad'
      }
    ];
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector('.button');
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    this.outsideClickHandler = (e) => {
      if (this.expanded && !this.contains(e.target)) {
        this.collapse();
      }
    };
    document.addEventListener('click', this.outsideClickHandler);

    this.keyHandler = (e) => {
      if (e.key === 'Escape' && this.expanded) this.collapse();
    };
    document.addEventListener('keydown', this.keyHandler);
  }

  toggle() {
    if (this.expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  expand() {
    if (this.expanded) return;
    
    this.expanded = true;
    const panel = this.shadowRoot.querySelector('.panel');
    
    panel.classList.add('expanding');
    panel.classList.remove('collapsing');
    panel.classList.add('expanded');
    
    this.dispatchEvent(new CustomEvent('expand'));
  }

  collapse() {
    if (!this.expanded) return;
    
    this.expanded = false;
    const panel = this.shadowRoot.querySelector('.panel');
    
    panel.classList.remove('expanding');
    panel.classList.add('collapsing');
    panel.classList.remove('expanded');
    
    this.dispatchEvent(new CustomEvent('collapse'));
  }
}

// Base URL of this script (module), used to find ../apps and ../images on either host
StakcoProductsPanel.BASE_URL = (typeof import.meta !== 'undefined' && import.meta.url) || 'https://cdn.stakcos.com/components/stakco-products-panel.js';

customElements.define('stakco-products-panel', StakcoProductsPanel);