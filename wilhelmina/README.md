# Wilhelmina’s — Bulma 1 rebuild

Standalone Hugo site for [wilhelmina.gallery](https://www.wilhelmina.gallery/). It keeps the live gallery’s copy, Cloudflare Images and contact-form worker, and restyles the front end on **Bulma 1** instead of the current compiled Bulma 0.9.4 bundle.

This folder is independent of the Kensington theme at the repository root (donaldjenkins.com). Deploy it as its own Cloudflare Pages project with:

- **Build command:** `npm ci && hugo --gc --minify`
- **Publish directory:** `public`
- **Environment:** `HUGO_VERSION=0.147.8` (extended), `NODE_VERSION=22`, `HUGO_ENVIRONMENT=production`

## What changed versus the live site

- Bulma **1.0** via npm, compiled with Dart Sass through Hugo (CSS variables, current grid, themed yellow/sea palette).
- CSS-only navigation — no burger JavaScript, matching the JS-free approach on donaldjenkins.com.
- Valid HTML: theme colour `#fce70d`, no nested lists, no illegal `img` attributes, RSS/canonical URLs without a double slash.
- Responsive images through a `cfimg` shortcode (srcset + `sizes`) instead of a 12-breakpoint `<picture>`.
- Artist works live in front matter, so adding a painting is a YAML entry rather than a pasted shortcode.
- Honeypot field added alongside the existing arithmetic captcha (the live Worker still expects `Captcha`).
- Quicksand is self-hosted as `woff2` only (no EOT/SVG/TTF).

## Local preview

```bash
cd wilhelmina
npm install
hugo server
```

Hugo extended with Dart Sass is required (`toCSS` uses `transpiler: dartsass`).
