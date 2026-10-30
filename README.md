# AUREON Architecture

A premium, bilingual (فارسی / English) single-page studio website for the fictional architecture
practice **AUREON**. Built as a front-end-only showcase: scroll-driven storytelling, a pinned
horizontal project gallery, and a fully tokenised light/dark design system.

> **Fictional brand.** All projects, people, statistics, addresses and phone numbers are invented
> for design purposes. The contact form is a **demo**: it validates input and simulates a send
> locally — nothing leaves the browser. Social links point at the networks' homepages as
> placeholders.

## Stack

- **React 19 + TypeScript** (strict) + **Vite 7**
- **Tailwind CSS v4** (CSS-first configuration via `@theme`)
- **GSAP 3 + ScrollTrigger + @gsap/react** (`useGSAP`) for all motion
- **lucide-react** icons
- Self-hosted variable fonts: **Vazirmatn** (FA) and **Manrope** (EN)
- No 3D libraries — depth is achieved with layering, parallax, scale and clip-path only

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

Other scripts:

```bash
npm run build     # type-check (tsc -b) + production build to dist/
npm run preview   # serve the production build locally
npm run typecheck # type-check only
```

Requires Node.js 20.19+ or 22.12+ (Vite 7).

## Features

- **Bilingual FA/EN** with a central dictionary (`src/i18n/`), instant RTL/LTR switching without a
  reload, crossfade transition, and `localStorage` persistence (`aureon:lang`).
- **Light/dark theme** driven by CSS custom properties (`src/styles/theme.css`), seeded from the
  system preference on first visit, persisted in `localStorage` (`aureon:theme`), and applied
  before first paint by a tiny boot script in `index.html` (no flash).
- **Scroll storytelling**: pinned philosophy statements, a pinned horizontal project gallery
  (vertical scroll on desktop, native swipe on touch), and a six-beat pinned featured-project
  sequence with a clip-path "window" that mirrors correctly in RTL.
- **Micro-interactions**: custom cursor label over gallery cards, floating image preview in
  Expertise (pointer-fine only), accordion services, animated counters, magnetic-feel buttons.
- **Accessibility**: semantic landmarks, skip link, focus-visible rings, focus-trapped dialogs and
  mobile menu, `aria-expanded`/`aria-invalid` states, and a full `prefers-reduced-motion` fallback
  that disables pinning and reveals content statically.
- **Performance**: responsive WebP `srcSet`/`sizes` with explicit dimensions, lazy loading below
  the fold, eager hero image, font preloads with `unicode-range`, transform/opacity-only
  animation, and manual vendor chunks (`react`, `motion`).

## Project structure

```
public/
  fonts/            self-hosted woff2 (Manrope, Vazirmatn)
  images/           generated architecture imagery, multi-width WebP
src/
  animations/       gsap setup + per-section scroll choreography
  app/              App shell + Theme/Language providers
  components/       ui primitives, layout (Header/Footer/MobileMenu), animation helpers
  data/             projects, services, statistics, site metadata
  hooks/            language, theme, media queries, active section
  i18n/             en.ts / fa.ts dictionaries (single source of copy)
  sections/         Hero, Philosophy, Projects, FeaturedProject, About,
                    Expertise, Statistics, Contact
  styles/           theme.css (tokens) + index.css (Tailwind, base, components)
  types/            shared domain types
  utils/            image srcSet, number formatting (fa-IR digits), class names
```

## Design tokens

All colour, surface, border and shadow values live in `src/styles/theme.css` as semantic variables
(`--bg`, `--surface`, `--ink`, `--muted`, `--accent`, `--line`, …) with light and dark definitions.
Tailwind utilities map to them in `src/styles/index.css` (`bg-bg`, `text-ink`, `border-line`, …),
so components never hard-code palette values. Logical properties (`start`/`end`, `ms`/`me`) keep
every layout RTL-aware.

## Motion notes

- Every scroll animation is created inside `useGSAP` with a scoped ref and cleaned up on unmount;
  `gsap.matchMedia` selects desktop / touch / reduced-motion choreography.
- Direction-dependent values (gallery travel, featured clip window) are **function-based** with
  `invalidateOnRefresh`, so switching language refreshes existing triggers instead of recreating
  pins — this keeps pin spacers and downstream trigger positions stable.
- `ScrollTrigger.refresh()` is coalesced (`refreshScrollTriggers`) and re-run after language
  changes, font load, and any body size change (accordions, scrollbar locks, late images) via a
  `ResizeObserver`.

## Deployment

The build outputs a static SPA in `dist/`:

```bash
npm run build
```

Serve `dist/` from any static host (Netlify, Vercel, GitHub Pages, S3 + CloudFront, nginx).
All navigation is in-page anchors, so no server rewrite rules are required; if you prefer a
catch-all, point unknown paths at `index.html`.

Example nginx location:

```nginx
location / {
  root /var/www/aureon/dist;
  try_files $uri $uri/ /index.html;
}
```

## Imagery

Images were generated for this project and converted to multi-width WebP
(`public/images/<name>-<width>.webp`). They are committed with the repo, so the site has **no
runtime dependency on external image CDNs**.