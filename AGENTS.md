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
- `src/main.tsx` — React entrypoint; imports `src/index.css` and mounts `App`
- `src/App.tsx` — the entire menu: palette, menu data, and every page component
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

## Direction

`<html>` is `lang="ar" dir="rtl"`. A few flex rows must stay in visual
left-to-right order regardless (the cover header band, the cover's bottom
label, the page-number row) and pin `direction: 'ltr'` explicitly. Leave those
pins in place when editing those rows.

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
