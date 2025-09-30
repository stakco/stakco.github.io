class StakcoInfoPanel extends HTMLElement {
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
    const icon = this.getAttribute('icon') || 'fa-compass';
    const buttonStyle = this.getAttribute('button-style') || '';
    

    /* html */
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <style>
        :host {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 2000;
        }
        .button {
            position: absolute;
            z-index: 2000;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--primary-gradient);
          transition: all 0.3s ease;
          box-shadow: var(--shadow-soft);
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }
        .button:hover, .button.active {
          box-shadow: var(--shadow-glow);
        }
        .button i {
          width: auto;
          height: auto;
          display: block;
          font-size: 44px;
          color: white;
        }
        .panel {
          position: fixed;
          top: 20px;
          left: 45px;
          border: none;
          height: 50px;
          border-radius: 0 25px 25px 0;
          background: var(--glass-bg);
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          z-index: 1500;
          width: 0;
          overflow: hidden;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-soft);
        }
        .panel.expanded {
          width: calc(100vw - 65px);
        }
        .content {
          margin: 0 55px 0 35px;
          color: var(--text-primary);
          text-shadow: none;
          white-space: normal;
          opacity: 0;
          transition: opacity 0.3s ease 0.1s;
          font-weight: 500;
          font-size: 14px;
          line-height: 1.2;
        }
        .panel.expanded .content {
          opacity: 1;
        }
      </style>
      <button class="button" part="button">
        <i class="fa-solid ${icon}"></i>
      </button>
      <div class="panel" part="panel">
        <div class="content" part="content">
          <slot></slot>
        </div>
      </div>
    `;
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
    const button = this.shadowRoot.querySelector('.button');
    
    panel.classList.add('expanded');
    button.classList.add('active');
    
    this.dispatchEvent(new CustomEvent('expand'));
  }

  collapse() {
    if (!this.expanded) return;
    
    this.expanded = false;
    const panel = this.shadowRoot.querySelector('.panel');
    const button = this.shadowRoot.querySelector('.button');
    
    panel.classList.remove('expanded');
    button.classList.remove('active');
    
    this.dispatchEvent(new CustomEvent('collapse'));
  }

  setContent(html) {
    const content = this.shadowRoot.querySelector('.content');
    content.innerHTML = html;
  }
}

customElements.define('stakco-info-panel', StakcoInfoPanel);