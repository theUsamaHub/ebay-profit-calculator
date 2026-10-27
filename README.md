# Marginly — eBay Dropshipping Profit Calculator

A responsive offline workspace for Pakistani sellers, built with HTML, CSS and vanilla JavaScript. No framework, dependencies, API keys, build step or backend.

## Run

Open `index.html` directly in a modern browser. Alternatively run `python -m http.server 8080` from this folder and open http://localhost:8080. Classic scripts expose a shared `EPC` namespace so the app also works with `file://` without module fetch restrictions. Inter and Space Grotesk are used if installed, with system font fallbacks and no network requests.

## Features

Eight navigation sections cover product profit, target pricing, monthly earnings, conversion scenarios, working capital, product comparisons and fee settings. Change inputs for instant results. Light/dark mode, fee presets and the current product draft persist locally. Saved products capture their own fee assumptions; changing global fees does not rewrite saved records. Edit a saved product and press **Save product** to update it. **Copy** makes a separate record.

Saved Products supports search, sorting, selection-based comparison, deletion and CSV export/import. Import accepts this app's schema, validates every row before adding anything, and creates new copies. Maximum file size is 5 MB and 1,000 records per import. Export includes readable summary columns plus a JSON snapshot for accurate restoration. Formula-leading product names are escaped in spreadsheet-facing columns. Export backups before clearing browser storage. Browser origins (including file URLs versus a server) may have separate storage. Storage failures are reported; calculations can continue in memory.

## Financial model

- Revenue is selling price plus buyer shipping. Buyer tax is a marketplace pass-through.
- Final value, international and percentage advertising fees have independent bases: product price, revenue, or revenue plus sales tax. Manual advertising replaces percentage advertising.
- The fixed order fee threshold includes selling price, buyer shipping and buyer tax. Default is $0.30 at or below $10 and $0.40 above $10.
- Insertion cost is a user-entered allocation per sold order, not a count of listings.
- eBay conversion and Payoneer fees are opt-in. Their default base is nonnegative proceeds after preceding charges. eBay conversion applies after other eBay fees; Payoneer applies after all eBay fees. Alternative bases are editable.
- Return allowance is estimated unrecovered loss as a percent of revenue, not an actual fee or a claim that all refunded revenue is lost.
- Total costs include product, supplier shipping, packaging, miscellaneous costs, all eBay fees, Payoneer and expected losses. Payout excludes supplier expenses and reserves.
- Margin = profit / revenue. ROI = profit / upfront supplier product, shipping, packaging and miscellaneous costs. Fees deducted from proceeds and expected reserves are excluded from that upfront denominator. Undefined ratios display a dash.
- Pricing uses the same engine, searches both fixed-fee intervals, and returns the minimum cent price satisfying the target (search cap $1 billion). Buyer shipping and tax are held fixed. Update the buyer tax for the new price if appropriate. Supplier cost and shipping in the pricing section are independently editable; applying the result also applies those costs.
- Monthly and conversion assumptions are independently editable. Use the current-product buttons to refresh their average revenue/profit. Conversion contribution is before monthly fixed expenses. Forecasts may include fractional expected orders, but required orders/visits round up. Working capital rounds funded order capacity down.
- Breakdown chart separates advertising from other eBay fees to avoid double counting. Loss is shown separately and never used as a negative doughnut segment.

## Fee assumptions and limitations

Defaults requested in the brief: 13.6% final value, 1.55% international, all optional percentages zero. These are configurable estimates, not universal or account-verified rates. This flat-rate model does not automatically apply category fee tiers, Store subscriptions, discounts, taxes on fees, exchange rates, special shipping programs or account-specific adjustments. Category is descriptive, not an automatic rate selector.

Official references consulted October 27, 2026 (also editable in Fee Settings):

- [eBay selling fees](https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822)
- [International selling fees](https://export.ebay.com/en/fees-regulations-policies/seller-fees/international-fees/)

This calculator provides estimates based on configurable fee assumptions. Actual eBay fees vary by marketplace, category, account status, transaction details, and applicable policies. Payoneer fees and currency conversion costs may also vary. Verify current fees before making pricing decisions.

## Tests and structure

Run `node tests/calculations.test.cjs`. Tests use independently calculated expected results for profit, loss, break-even, threshold boundaries, advertising, shipping, tax, conversions, Payoneer, returns, margin targets, zero sales, high supplier costs, working capital, forecasting and import validation.

`js/calculator.js`, `fees.js`, and `projections.js` contain pure financial calculations; `storage.js` handles persistence and validation; `charts.js` renders a dependency-free CSS chart; `app.js` renders and connects the UI; `utils.js` contains formatting and CSV helpers. `css/styles.css` defines the theme and `responsive.css` defines mobile layouts.
