# galaxy-cafe-menu

Arabic (RTL) café drink menu for Galaxy Café. React + Vite + Tailwind CSS,
deployed to GitHub Pages.

## Development

```sh
npm install
npm run dev        # dev server on $PORT (default 8443)
npm run build      # production build to dist/
npm run preview    # serve the built output
npm run typecheck  # tsc --noEmit
```

Requires Node `^20.19.0 || >=22.12.0` — Vite 8 and rolldown refuse to install
their native binding on older versions, and the dev server fails to start.

## Project Structure

- `index.html` — document shell; holds all SEO metadata, Open Graph/Twitter
  tags, the Google Fonts `<link>`, and the `CafeOrCoffeeShop` JSON-LD block
- `src/menu.json` — **the data**: sections, drinks, prices, translations,
  barcodes and costs. Everything the menu shows comes from here
- `src/menu.ts` — types for that JSON plus the sorted `SECTIONS` / `BY_KEY`
  views. Import the menu through this module, never the raw `.json`, or
  TypeScript infers a useless union of object literals
- `src/posExport.ts` — flattens the menu into the POS sheet's five columns
- `src/main.tsx` — React entrypoint; imports `src/index.css` and mounts `App`
- `src/App.tsx` — palette, the `T` string table, and every page component
- `src/index.css` — Tailwind import plus the responsive layout classes
- `public/` — copied verbatim to the build root (`favicon.svg`, `og-image.png`)
- `vite.config.ts` — React + Tailwind plugins, `@` alias for `src`
- `.github/workflows/deploy.yml` — builds and publishes to GitHub Pages

## Layout

Pages are fluid, capped at the 794px A4 width. Each sheet carries `.gx-sheet`,
which sets `container-type: inline-size`, so the `cqw` units behind the fluid
type scale measure against the sheet rather than the viewport.

Two helpers in `App.tsx` generate those sizes: `fl(min, max)` reaches `max` at
the full sheet width and eases down to `min` as it narrows; `flDown(wide,
narrow)` is the inverse, for values that need to grow on small screens. When
adding sizes, keep `min < max` in `fl` — a reversed pair silently collapses to
a constant.

Below a 620px sheet width the two-column pages stack and the cover's header
band goes vertical, both driven by `@container` rules in `index.css`.

## Menu data

`src/menu.json` is the single source of truth, and `products.xlsx` is generated
from it — never the other way round.

- Names are `{ ar, en }` objects. Adding a language means adding a key there
  and a matching block in `T` in `App.tsx`.
- `price` is the large size (or the only one); `small` appears only on drinks
  poured in two sizes. `seasonal: true` replaces the figure with a localized
  word.
- `barcode` is the identity that links a drink to its POS row, and it must stay
  stable. `posOnly` holds records the till needs but the menu must not show:
  stock items, and drinks struck off the price list.
- `id` fixes the running order and is spaced by 10, so a new drink slots
  between two others without renumbering. Render paths sort by it.

## Direction

`App` writes `lang` and `dir` onto `<html>` from the active language, so both
CSS and assistive tech follow the switch; the choice persists in
`localStorage`. Components read it through `useLang()` / `useDir()` and must
use `dir` rather than a hard-coded `'rtl'`.

Three flex rows stay in visual left-to-right order in *both* languages — the
cover header band, the cover's bottom label, and the page-number row — and pin
`direction: 'ltr'` explicitly. Leave those pins in place when editing them.

## Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin; `src/index.css` imports it
with `@import 'tailwindcss';`. No Tailwind config or PostCSS config is needed.
Component styling is inline `style` objects — Tailwind classes are only used
for the handful of `.gx-*` layout rules that need container queries.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`),
  or escape them in single-quoted strings.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
