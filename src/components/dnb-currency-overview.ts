/**
 * DNB Currency Overview Component
 * Displays all cached exchange rates from localStorage
 */

interface CurrencyConfig {
  position: 'left' | 'right';
  displayType: 'symbol' | 'code';
  symbols: Record<string, string>;
  refreshInterval: number; // in minutes
}

const DEFAULT_CONFIG: CurrencyConfig = {
  position: 'left',
  displayType: 'symbol',
  symbols: {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    THB: '฿',
    AUD: 'A$',
    HKD: 'HK$'
  },
  refreshInterval: 60
};

export class DNBCurrencyOverview extends HTMLElement {
  private shadow: ShadowRoot;
  private styleFramework: string = 'tailwind';
  private config: CurrencyConfig = DEFAULT_CONFIG;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['style-framework', 'display-type', 'symbol-position'];
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    switch (name) {
      case 'style-framework':
        this.styleFramework = newValue;
        break;
      case 'display-type':
        if (newValue === 'symbol' || newValue === 'code') {
          this.config.displayType = newValue;
        }
        break;
      case 'symbol-position':
        if (newValue === 'left' || newValue === 'right') {
          this.config.position = newValue;
        }
        break;
    }
    this.loadStyles();
    this.updateDisplay();
  }

  async connectedCallback() {
    await this.loadStyles();
    await this.updateDisplay();

    // Update display every 30 seconds to refresh timestamps
    setInterval(() => this.updateDisplay(), 30000);
  }

  private async loadStyles() {
    const style = document.createElement('style');
    
    switch (this.styleFramework) {
      case 'tailwind':
        style.textContent = `
          .container { @apply p-4 bg-white rounded shadow-md mt-8; }
          .title { @apply text-xl font-bold mb-4; }
          table { @apply w-full border-collapse; }
          th { @apply text-left p-2 bg-gray-100 border-b; }
          td { @apply p-2 border-b border-gray-200; }
          .age { @apply text-sm text-gray-500; }
          .currency { @apply font-mono; }
        `;
        break;
      case 'bootstrap':
        style.textContent = `
          .container { padding: 1rem; background: white; border-radius: 0.375rem; box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075); margin-top: 2rem; }
          .title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 0.5rem; background-color: #f8f9fa; border-bottom: 2px solid #dee2e6; }
          td { padding: 0.5rem; border-bottom: 1px solid #dee2e6; }
          .age { font-size: 0.875rem; color: #6c757d; }
          .currency { font-family: monospace; }
        `;
        break;
    }

    this.shadow.innerHTML = '';
    this.shadow.appendChild(style);
  }

  private getAgeString(timestamp: number): string {
    const age = Date.now() - timestamp;
    const minutes = Math.floor(age / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

  private formatCurrency(amount: number, currency: string): string {
    const symbol = this.config.displayType === 'symbol' 
      ? (this.config.symbols[currency] || currency)
      : currency;
    
    const value = amount.toFixed(4);
    return this.config.position === 'left'
      ? `${symbol}${value}`
      : `${value} ${symbol}`;
  }

  private async updateDisplay() {
    const rates: Array<{
      from: string;
      to: string;
      rate: number;
      timestamp: number;
    }> = [];

    // Collect all exchange rates from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('exchange_')) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        rates.push(data);
      }
    }

    // Sort by timestamp, newest first
    rates.sort((a, b) => b.timestamp - a.timestamp);

    const container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = `
      <div class="title">Cached Exchange Rates</div>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Rate</th>
            <th>Last Updated</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          ${rates.map(rate => `
            <tr>
              <td class="currency">${this.config.displayType === 'symbol' 
                ? (this.config.symbols[rate.from] || rate.from)
                : rate.from}</td>
              <td class="currency">${this.config.displayType === 'symbol'
                ? (this.config.symbols[rate.to] || rate.to)
                : rate.to}</td>
              <td class="currency">${this.formatCurrency(rate.rate, rate.to)}</td>
              <td>${new Date(rate.timestamp).toLocaleString()}</td>
              <td class="age">${this.getAgeString(rate.timestamp)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    this.shadow.innerHTML = '';
    this.shadow.appendChild(container);
  }
}

customElements.define('dnb-currency-overview', DNBCurrencyOverview);