A flexible and customizable web component for displaying real-time currency exchange rates with caching, UI framework support, and advanced configuration options.

## Key Features

- **Real-Time Exchange Rates**: Fetches live data from a public API.
- **Caching**: Stores rates in `localStorage` with configurable refresh intervals.
- **UI Framework Compatibility**: Supports Tailwind CSS and Bootstrap.
- **Configurable Display**: Adjust currency format, symbol position, and more.
- **Rate Limiting & Retry Logic**: Ensures reliability with API limitations.
- **Debug Logging**: Troubleshoot easily with optional logging.
- **TypeScript & ESM Support**: Fully compatible with modern development workflows.
- **Loading Animations**: Built-in indicators for fetching states.

## Installation

```bash
npm install dnb-currency
```

## Usage Example

Include the component in your HTML:

```html
<script type="module">
  import 'dnb-currency';
  import 'dnb-currency-overview';
</script>

<dnb-currency
  from="USD"
  to="EUR"
  debug="true"
  style-framework="tailwind"
  display-type="symbol"
  symbol-position="left">
</dnb-currency>

<dnb-currency-overview
  style-framework="tailwind"
  display-type="symbol"
  symbol-position="left">
</dnb-currency-overview>
```

## Component Attributes

### Currency Component (`<dnb-currency>`)

* **`from`**: Source currency code (e.g., `USD`).
* **`to`**: Target currency code (e.g., `EUR`).
* **`debug`**: Enable debug logging (`true`/`false`).
* **`style-framework`**: UI framework (`tailwind`/`bootstrap`).
* **`display-type`**: Format (`symbol`/`code`).
* **`symbol-position`**: Position of the symbol (`left`/`right`).

### Overview Component (`<dnb-currency-overview>`)

* **`style-framework`**: UI framework (`tailwind`/`bootstrap`).
* **`display-type`**: Format (`symbol`/`code`).
* **`symbol-position`**: Position of the symbol (`left`/`right`).

## Configuration Options

You can define additional options programmatically:

```javascript
const config = {
  position: 'left', // or 'right'
  displayType: 'symbol', // or 'code'
  symbols: {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    THB: '฿',
    AUD: 'A$',
    HKD: 'HK$'
  },
  refreshInterval: 60 // in minutes
};
```

## Development Guide

Get started with the following commands:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## License

This project is licensed under the MIT License.
