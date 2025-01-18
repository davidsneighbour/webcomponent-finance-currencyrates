/**
 * DNB Currency Exchange Web Component
 * A customizable web component for displaying currency exchange rates with caching and multiple UI frameworks support
 */

interface ExchangeRate {
  rate: number;
  timestamp: number;
  from: string;
  to: string;
}

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

export class DNBCurrency extends HTMLElement {
  private shadow: ShadowRoot;
  private config: CurrencyConfig;
  private fromCurrency: string = '';
  private toCurrency: string = '';
  private debug: boolean = false;
  private styleFramework: string = 'tailwind';
  private rateLimitDelay: number = 1000;
  private retryAttempts: number = 3;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.config = { ...DEFAULT_CONFIG };
  }

  static get observedAttributes() {
    return ['from', 'to', 'debug', 'style-framework', 'display-type', 'symbol-position'];
  }

  /**
   * Lifecycle callback when attributes change
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'from':
        this.fromCurrency = newValue.toUpperCase();
        break;
      case 'to':
        this.toCurrency = newValue.toUpperCase();
        break;
      case 'debug':
        this.debug = newValue === 'true';
        break;
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

    this.updateDisplay();
  }

  /**
   * Lifecycle callback when component is mounted
   */
  async connectedCallback() {
    this.log('Component mounted');
    await this.loadStyles();
    await this.updateDisplay();
  }

  /**
   * Load UI framework styles dynamically
   */
  private async loadStyles() {
    const style = document.createElement('style');
    
    switch (this.styleFramework) {
      case 'tailwind':
        style.textContent = `
          .container { @apply p-4 bg-white rounded shadow-md; }
          .rate { @apply text-lg font-bold font-mono; }
          .timestamp { @apply text-sm text-gray-500; }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .loading {
            animation: pulse 1.5s ease-in-out infinite;
            background-color: #f3f4f6;
            border-radius: 0.25rem;
            display: inline-block;
            min-width: 120px;
          }
        `;
        break;
      case 'bootstrap':
        style.textContent = `
          .container { padding: 1rem; background: white; border-radius: 0.375rem; box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075); }
          .rate { font-size: 1.25rem; font-weight: 700; font-family: monospace; }
          .timestamp { font-size: 0.875rem; color: #6c757d; }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .loading {
            animation: pulse 1.5s ease-in-out infinite;
            background-color: #e9ecef;
            border-radius: 0.25rem;
            display: inline-block;
            min-width: 120px;
          }
        `;
        break;
    }

    this.shadow.appendChild(style);
  }

  /**
   * Show loading state
   */
  private showLoading() {
    this.shadow.innerHTML = `
      <div class="container">
        <div class="rate"><span class="loading">&nbsp;</span></div>
        <div class="timestamp"><span class="loading">&nbsp;</span></div>
      </div>
    `;
  }

  /**
   * Format currency value according to configuration
   */
  private formatCurrency(amount: number, currency: string): string {
    const symbol = this.config.displayType === 'symbol' 
      ? (this.config.symbols[currency] || currency)
      : currency;
    
    const value = amount.toFixed(4);
    return this.config.position === 'left'
      ? `${symbol}${value}`
      : `${value} ${symbol}`;
  }

  /**
   * Fetch exchange rate from API with rate limiting and retry logic
   */
  private async fetchExchangeRate(from: string, to: string): Promise<ExchangeRate | null> {
    const cachedRate = this.getCachedRate(from, to);
    if (cachedRate && this.isRateValid(cachedRate)) {
      this.log('Using cached rate', cachedRate);
      return cachedRate;
    }

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await this.delay(this.rateLimitDelay);
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${from}`
        );

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const rate: ExchangeRate = {
          rate: data.rates[to],
          timestamp: Date.now(),
          from,
          to
        };

        this.cacheRate(rate);
        return rate;
      } catch (error) {
        this.log(`Attempt ${attempt} failed:`, error);
        if (attempt === this.retryAttempts) {
          console.error('All retry attempts failed');
          return null;
        }
        await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
      }
    }

    return null;
  }

  /**
   * Cache rate in localStorage
   */
  private cacheRate(rate: ExchangeRate) {
    const key = `exchange_${rate.from}_${rate.to}`;
    localStorage.setItem(key, JSON.stringify(rate));
  }

  /**
   * Get cached rate from localStorage
   */
  private getCachedRate(from: string, to: string): ExchangeRate | null {
    const key = `exchange_${from}_${to}`;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Check if cached rate is still valid
   */
  private isRateValid(rate: ExchangeRate): boolean {
    const age = Date.now() - rate.timestamp;
    return age < this.config.refreshInterval * 60 * 1000;
  }

  /**
   * Update the component display
   */
  private async updateDisplay() {
    if (!this.fromCurrency || !this.toCurrency) return;

    this.showLoading();
    
    const rate = await this.fetchExchangeRate(this.fromCurrency, this.toCurrency);
    if (!rate) {
      this.shadow.innerHTML = `
        <div class="container">
          <div class="error">Unable to fetch exchange rate</div>
        </div>
      `;
      return;
    }

    const formattedRate = this.formatCurrency(rate.rate, this.toCurrency);
    const timestamp = new Date(rate.timestamp).toLocaleString();

    this.shadow.innerHTML = `
      <div class="container">
        <div class="rate">${formattedRate}</div>
        <div class="timestamp">Last updated: ${timestamp}</div>
      </div>
    `;
  }

  /**
   * Utility method for debug logging
   */
  private log(...args: any[]) {
    if (this.debug) {
      console.log('[DNBCurrency]', ...args);
    }
  }

  /**
   * Utility method for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Register the web component
customElements.define('dnb-currency', DNBCurrency);