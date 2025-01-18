import './style.css';
import './components/dnb-currency';
import './components/dnb-currency-overview';

// Example usage
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Currency Exchange Demo</h1>
        <p class="text-lg text-gray-600">Real-time exchange rates with caching and multiple display options</p>
      </div>

      <div class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">USD Exchange Rates</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <dnb-currency 
            from="USD" 
            to="THB"
            debug="true"
            style-framework="tailwind"
            display-type="symbol"
            symbol-position="left">
          </dnb-currency>

          <dnb-currency 
            from="USD" 
            to="EUR"
            style-framework="tailwind"
            display-type="symbol"
            symbol-position="left">
          </dnb-currency>

          <dnb-currency 
            from="USD" 
            to="GBP"
            style-framework="tailwind"
            display-type="code"
            symbol-position="right">
          </dnb-currency>

          <dnb-currency 
            from="USD" 
            to="AUD"
            style-framework="tailwind"
            display-type="symbol"
            symbol-position="left">
          </dnb-currency>
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">EUR Exchange Rates</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <dnb-currency 
            from="EUR" 
            to="USD"
            style-framework="tailwind"
            display-type="symbol"
            symbol-position="left">
          </dnb-currency>

          <dnb-currency 
            from="EUR" 
            to="GBP"
            style-framework="tailwind"
            display-type="code"
            symbol-position="right">
          </dnb-currency>

          <dnb-currency 
            from="EUR" 
            to="JPY"
            style-framework="tailwind"
            display-type="symbol"
            symbol-position="left">
          </dnb-currency>

          <dnb-currency 
            from="EUR" 
            to="THB"
            style-framework="tailwind"
            display-type="code"
            symbol-position="right">
          </dnb-currency>
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">GBP Exchange Rates</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <dnb-currency 
            from="GBP" 
            to="USD"
            style-framework="tailwind"
            display-type="symbol"
            symbol-position="left">
          </dnb-currency>

          <dnb-currency 
            from="GBP" 
            to="EUR"
            style-framework="tailwind"
            display-type="symbol"
            symbol-position="left">
          </dnb-currency>

          <dnb-currency 
            from="GBP" 
            to="HKD"
            style-framework="tailwind"
            display-type="code"
            symbol-position="right">
          </dnb-currency>

          <dnb-currency 
            from="GBP" 
            to="AUD"
            style-framework="tailwind"
            display-type="symbol"
            symbol-position="left">
          </dnb-currency>
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Overview</h2>
        <div class="bg-white rounded-lg shadow">
          <dnb-currency-overview 
            style-framework="tailwind"
            display-type="symbol"
            symbol-position="left">
          </dnb-currency-overview>
        </div>
      </div>

      <footer class="text-center text-gray-600 text-sm">
        <p>Data provided by Exchange Rate API • Updated in real-time • Cached locally</p>
      </footer>
    </div>
  </div>
`;