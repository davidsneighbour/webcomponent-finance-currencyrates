# DNB Currency Exchange Web Component

A customizable web component for displaying currency exchange rates with caching and multiple UI framework support.

## Features

- Real-time currency exchange rates from public API
- Local storage caching with configurable refresh intervals
- Multiple UI framework support (Tailwind CSS, Bootstrap)
- Configurable currency display format
- Rate limiting and retry logic
- Debug logging
- TypeScript support
- ESM compatible
- Loading animations
- Overview component for cached rates

## Installation

```bash
npm install dnb-currency
```

## Usage

```html
<!-- Import the components -->
<script type="module">
  import 'dnb-currency';
  import 'dnb-currency-overview';
</script>

<!-- Use the currency component -->
<dnb-currency 
  from="USD" 
  to="EUR"
  debug="true"
  style-framework="tailwind"
  display-type="symbol"
  symbol-position="left">
</dnb-currency>

<!-- Use the overview component -->
<dnb-currency-overview
  style-framework="tailwind"
  display-type="symbol"
  symbol-position="left">
</dnb-currency-overview>
```

## Attributes

### Currency Component
- `from`: Source currency code (e.g., "USD")
- `to`: Target currency code (e.g., "EUR")
- `debug`: Enable debug logging (true/false)
- `style-framework`: UI framework to use ("tailwind" or "bootstrap")
- `display-type`: Currency display format ("symbol" or "code")
- `symbol-position`: Currency symbol position ("left" or "right")

### Overview Component
- `style-framework`: UI framework to use ("tailwind" or "bootstrap")
- `display-type`: Currency display format ("symbol" or "code")
- `symbol-position`: Currency symbol position ("left" or "right")

## Configuration

The component can be configured through a configuration object:

```javascript
{
  position: 'left' | 'right',    // Currency symbol position
  displayType: 'symbol' | 'code', // Use symbol ($) or code (USD)
  symbols: {                      // Currency symbols mapping
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    THB: '฿',
    AUD: 'A$',
    HKD: 'HK$'
  },
  refreshInterval: 60            // Cache refresh interval in minutes
}
```

## Features

### Caching
Exchange rates are cached in localStorage with configurable refresh intervals to minimize API calls.

### Rate Limiting
Built-in rate limiting and retry logic to handle API limitations gracefully.

### UI Framework Support
Supports multiple UI frameworks:
- Tailwind CSS
- Bootstrap

### Currency Display
- Flexible display options between currency symbols and codes
- Configurable symbol position (left/right)
- Fallback to currency code when symbol is not available

### Loading States
Animated loading indicators while fetching exchange rates.

### Overview Component
A comprehensive view of all cached exchange rates including:
- From/To currencies
- Current rates
- Last update time
- Age of the data

### Debug Logging
Enable debug logging with the `debug` attribute for troubleshooting.

## Development

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

MIT