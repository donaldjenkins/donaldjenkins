# donaldjenkins.com — square icon and favicon

Built 6th September, 2026, from the identity master at `Documents/Work in progress/Tidy/Identity assets/donaldjenkins-square.svg`. The mark is two discs — one green, one graphite — inside a rounded olive frame on a white ground. It is the same artwork the site has served since August 2026; what this folder adds is a documented source of truth and a build script, on the model of `~/Sites/raffish.design/brand/icon/`.

## Files

| File | Use |
| --- | --- |
| `bimi-source.svg` | The master as supplied — Inkscape's own file, `sodipodi:docname="donaldjenkins-bimi.svg"`, 3084 × 3084. Kept verbatim so the provenance is not lost. Start from `icon.svg` for anything new. |
| `icon.svg` | The same artwork with the editor's namespaces, metadata and `sodipodi:namedview` stripped — 1,161 bytes against the master's 2,576. White ground, so it is the opaque variant. |
| `favicon.ico` | 16, 32 and 48px rasters, PNG-compressed inside the ICO container. |
| `apple-touch-icon.png` | 180 × 180. iOS rounds the corners itself; it is supplied square and opaque. |
| `icon-192.png`, `icon-512.png` | Web-app manifest icons. |
| `avatar-1024.png` | Square avatar for X, GitHub and the like. |

⚠️ **This folder is the source, not what the site serves.** Hugo publishes `static/` to the site root, so the served copies are `static/favicon.ico`, `static/icon.svg`, `static/apple-touch-icon.png`, `static/icon-192.png`, `static/icon-512.png` and `static/manifest.webmanifest`. Nothing here reaches the site until it is copied there.

## The two SVGs are not interchangeable

📝 **`static/icon.svg` is deliberately different from `icon.svg` here, and should stay that way.** The served one has a **transparent** ground and a `prefers-color-scheme: dark` block that lifts the discs to `#f0f0f0` / `#fff7d1` and the frame to `#94C7A1`, so the mark survives dark browser chrome. The master here has a **white** ground and no dark variant, because it was drawn for BIMI, which requires a solid background.

⚠️ **The greens have drifted apart.** The master uses `#96c8a2`; `static/icon.svg` uses `#94C7A1`. They are two steps apart per channel and indistinguishable at any favicon size, but they are not the same value, and only one of them can be the palette's. `Brand colour palette.md` in the cockpit is generated, never hand-written — so resolve this by fixing the palette spec and re-running `00 Meta/assets/make_palette.py`, not by editing either SVG.

## Head markup

Already in place, in `layouts/partials/head/favicons.html`:

```html
<meta name="theme-color" content="{{ site.Params.color }}" /><!-- #9c9a75 -->
<link rel="icon" href="{{ .Site.BaseURL }}favicon.ico?v=2" sizes="any" />
<link rel="icon" href="{{ .Site.BaseURL }}icon.svg?v=2" type="image/svg+xml" />
<link rel="apple-touch-icon" href="{{ .Site.BaseURL }}apple-touch-icon.png?v=2" />
<link rel="manifest" href="{{ .Site.BaseURL }}manifest.webmanifest" />
```

📝 **The `?v=2` is the only cache-buster there is**, and it is load-bearing — browsers keep favicons in a store that a hard reload does not clear. Any future change to the served rasters must bump it to `?v=3` in the same commit, or returning visitors keep the old mark indefinitely.

## Two things left undone

- ⏳ **`static/manifest.webmanifest` carries only an `icons` array** — no `name`, `short_name`, `theme_color`, `background_color` or `display`. It is valid but minimal, and an installed web app gets no name from it. raffish.design's equivalent sets all five.
- ⏳ **`static/favicon.ico` stores its three sizes as 32-bit BMP** and runs to 15,086 bytes; the one built here stores the same three as PNG and runs to 4,869 — the same artwork at 32 per cent of the size. Swapping it is safe (every browser in use reads PNG-in-ICO) but it is a live asset, so it is a decision, not a tidy-up. **If it is swapped, bump `?v=2`.**

## Rebuilding

`../../scripts/build-icons.py` reads the master and writes every output above:

```bash
python3 scripts/build-icons.py brand/icon/bimi-source.svg brand/icon
```

⛔ **Do not edit the rasters or the cleaned SVG by hand.** Change a number in the script — the size list, the render resolution — and rerun.

📝 **It has no third-party dependencies, by necessity.** None of `cairosvg`, `Pillow`, `rsvg-convert`, ImageMagick or Inkscape is installed on this machine; rasterising is macOS `sips`, and the ICO container is packed by the script itself. It renders once at 2048px and downsamples, which gives visibly cleaner antialiasing at 16 and 32px than rasterising the vector at those sizes directly.

## Where the mark is served

| Host | State as at 6th September, 2026 |
| --- | --- |
| `www.donaldjenkins.com/favicon.ico` | ✅ Current mark — matches `static/favicon.ico` byte for byte (`921c2d12…`). |
| `shared.via.dj/favicon.ico` | ⛔ **Still the 2023 photographic mark** (`c667be70…`, 39,916 bytes, `Last-Modified: 11 Feb 2023`). Bucket `donaldjenkins`; the superseded object is kept in `_superseded/`. Command and credential in the cockpit note. |
| `assets.via.dj/favicon.ico` | 404 — no object. Harmless while nothing but images is served from it. Bucket `assets-donaldjenkins`, which also carries `assets.donaldjenkins.com` and `cdn.donaldjenkins.com`. |

⚠️ **A PDF cannot carry a favicon.** It has no `<head>`, so the browser falls back to `/favicon.ico` at the origin — which is why the icon on `shared.via.dj/*.pdf` is a bucket-level object and not anything the site controls.
