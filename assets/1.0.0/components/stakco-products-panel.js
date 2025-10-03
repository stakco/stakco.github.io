class StakcoProductsPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.expanded = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.outsideClickHandler);
  }

  render() {
    const products = this.getProducts();
    
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
          background: url('https://stakcos.com/assets/1.0.0/images/stakco_logo_squricle.png') no-repeat center;
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
        }
        .content {
          width: calc(100% - 30px);
          margin: 15px;
          opacity: 0;
          transition: opacity 0.3s ease 0.8s;
          color: var(--text-primary);
          text-shadow: none;
          overflow-y: auto;
          height: calc(100% - 30px);
        }
        .panel.expanded .content {
          opacity: 1;
        }
        h3, p {
          text-align: center;
          margin: 10px 0;
        }
        h3 {
          font-size: 24px;
          font-weight: 600;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .product-card {
          background: var(--glass-bg);
          border: 2px solid var(--glass-border);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: block;
          backdrop-filter: blur(10px);
        }
        .product-card:hover {
          border-color: var(--primary-color);
          background: rgba(249, 167, 68, 0.05);
          box-shadow: var(--shadow-glow);
        }
        .product-thumbnail {
          width: 100%;
          height: 200px;
          background: var(--glass-bg);
          border-radius: 8px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          border: 1px solid var(--glass-border);
        }
        .product-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .product-description {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 10px;
          opacity: 0.9;
          color: var(--text-primary);
        }
        .product-url {
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          opacity: 0.7;
          word-break: break-all;
          color: var(--text-primary);
        }
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          .product-card {
            padding: 15px;
          }
          .product-thumbnail {
            height: 150px;
            font-size: 36px;
          }
        }
      </style>
      <button class="button" part="button"></button>
      <div class="panel" part="panel">
        <div class="content" part="content">
          <h3>Explore Stakco Apps</h3>
          <p>Same puzzle, endless experiences</p>
          <div class="products-grid">
            ${products.map(product => `
              <a href="${product.url}" class="product-card" target="_blank">
                <div class="product-thumbnail">
                  <i class="${product.icon}"></i>
                </div>
                <div class="product-title">${product.title}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-url">${product.urlDisplay}</div>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  getProducts() {
    return [
      {
        title: 'Stakco Play',
        description: 'Classic Stakco - Touch and drag to rotate puzzle layers and align all pieces',
        url: 'https://stakcos.com/play',
        urlDisplay: 'stakcos.com/play',
        icon: 'fa-solid fa-gamepad'
      },
      {
        title: 'Stakco SMRT',
        description: 'MRT driven Stakco - Journey through Singapore\'s rail network while solving intricate puzzles',
        url: 'https://stakcos.com/mrt',
        urlDisplay: 'stakcos.com/mrt',
        icon: 'fa-solid fa-train-subway'
      },
      {
        title: 'Stakco MIDI',
        description: 'MIDI driven Stakco - Create musical compositions while solving puzzles through sound and rhythm',
        url: 'https://stakcos.com/midi',
        urlDisplay: 'stakcos.com/midi',
        icon: 'fa-solid fa-music'
      },
      {
        title: 'Stakco Clock',
        description: 'Time-driven Stakco - Solve puzzles synchronized with real-time clock movements and temporal challenges',
        url: 'https://stakcos.com/clock',
        urlDisplay: 'stakcos.com/clock',
        icon: 'fa-solid fa-clock'
      },
      {
        title: 'Stakco Dial',
        description: 'Surface Dial driven Stakco - Experience tactile puzzle solving with Microsoft Surface Dial\'s precise rotational control',
        url: 'https://stakcos.com/dial',
        urlDisplay: 'stakcos.com/dial',
        icon: 'fa-solid fa-circle-dot'
      },
      {
        title: 'Stakco Azimuth',
        description: 'Compass driven Stakco - Navigate through puzzles using real compass directions and magnetic orientation',
        url: 'https://stakcos.com/azimuth',
        urlDisplay: 'stakcos.com/azimuth',
        icon: 'fa-solid fa-compass'
      },
      {
        title: 'Stakco Gyro',
        description: 'Compass driven Stakco - Navigate through puzzles using real compass directions and magnetic orientation',
        url: 'https://stakcos.com/gyro',
        urlDisplay: 'stakcos.com/gyro',
        icon: 'fa-solid fa-globe'
      },
      {
        title: 'Stakco VOC',
        description: 'Compass driven Stakco - Navigate through puzzles using real compass directions and magnetic orientation',
        url: 'https://stakcos.com/kiwrious/voc',
        urlDisplay: 'stakcos.com/kiwrious/voc',
        icon: 'fa-solid fa-wind'
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

customElements.define('stakco-products-panel', StakcoProductsPanel);