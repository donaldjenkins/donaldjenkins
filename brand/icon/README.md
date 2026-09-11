# donaldjenkins.com — square icon and favicon

The mark is two discs — one Eton Blue `#96C8A2`, one Chicago `#575757` — inside a rounded Gurkha `#9C9B77` frame, outlined not filled, 3084 × 3084 on a transparent ground.

⭐ **The master is the vault's canonical favicon build.** `icon.svg` here is a byte-for-byte copy of `System/40 Identity/assets/donaldjenkins-favicon.svg`, which the [[Design charter]] §4 makes the single authority for this artwork. Change it there and copy it here; never the other way round, and never by hand.

Set up 6th September, 2026, on the model of `~/Sites/raffish.design/brand/icon/`. Re-pointed at the canonical master 7th September, 2026 — see *The colour drift* below, which is the reason this folder exists in its present form.

## Files

| File | Use |
| --- | --- |
| `icon.svg` | **The master.** Byte-identical to the vault canonical favicon and to `static/icon.svg`. Transparent, and carries a `prefers-color-scheme: dark` block that lifts **only the grey disc** to `#CCCCCC`, matching `donaldjenkins-lockup-dark.svg`. ⭐ The signature colours stay themselves in dark mode: Gurkha frame, Eton Blue disc. |
| `favicon.ico` | 16, 32 and 48px rasters, PNG-compressed inside the ICO container. |
| `apple-touch-icon.png` | 180 × 180, transparent. iOS rounds the corners itself. |
| `icon-192.png`, `icon-512.png` | Web-app manifest icons. |
| `avatar-1024.png` | Square avatar for X, GitHub and the like. |
| `_superseded/bimi-source-drifted.svg` | The Inkscape file this folder was originally built from — `sodipodi:docname="donaldjenkins-bimi.svg"`, 3084 × 3084. **Kept only as provenance; it is not a source.** Its frame colour drifted (`#a8a67a`) and it carries a white ground. Its green, `#96c8a2`, was counted as drift too until the palette adopted Eton Blue on 7th September 2026 — see below. |
| `_superseded/favicon-2023.ico` | The photographic mark pulled from the `donaldjenkins` R2 bucket before the 6th September swap, so that swap stays reversible. |

⚠️ **This folder is the source, not what the site serves.** Hugo publishes `static/` to the site root, so the served copies are `static/favicon.ico`, `static/icon.svg`, `static/apple-touch-icon.png`, `static/icon-192.png`, `static/icon-512.png` and `static/manifest.webmanifest`. Nothing here reaches the site until it is copied there.

## The colour drift, and why the master moved

⚠️ **A generated-output folder is only as good as its master, and this one had the wrong master for a day.**

`bimi-source.svg` was adopted on 6th September as the source of truth because it was the file the artwork had been supplied as. It was never checked against the palette. It carries `#96c8a2` and `#a8a67a` — the pair the [[Design charter]] §4 records as *drift*, corrected across the identity on 30th August 2026 to Summer Green `#94C7A1` and Gurkha `#9C9B77`. Every raster built from it inherited them, and those rasters were what the site served.

📝 **The site's own `static/icon.svg` was correct throughout.** It had been updated in August 2026 and is the canonical build; only the rasters, and this folder's master, were wrong. That is why the defect survived a look at the site: the SVG favicon a desktop browser prefers was right, and the PNG an iOS home screen uses was not.

📝 **The earlier note here proposed fixing this in the palette spec.** That was the wrong end. `Brand colour palette.md` is generated and already carried `#94C7A1`; it was the SVG that disagreed with the palette, not the palette that disagreed with itself.

⭐ **Then the green moved on purpose.** Later on 7th September 2026 the palette renamed Summer Green to **Eton Blue** and revalued it `#94C7A1` → **`#96C8A2`** (ΔE 0.55) — a decision, not a correction; see `Brand colour palette.md`. The canonical master and every raster here were rebuilt in Eton Blue in #12 (`587ad2f`). So the drifted file's green is now the palette's green by coincidence; its olive `#a8a67a` is still drift, and the vault master is still the only source.

⭐ **The structural fix is that the master is no longer local.** `icon.svg` is now a copy of the vault canonical file, and `build-icons.py` reads it without writing it — the earlier script emitted its own "cleaned" `icon.svg`, which is how a drifted file came to look like a source of truth.

## Head markup

In `layouts/partials/head/favicons.html`:

```html
<meta name="theme-color" content="{{ site.Params.color }}" /><!-- #9C9B77 -->
<link rel="icon" href="{{ .Site.BaseURL }}favicon.ico?v=5" sizes="any" />
<link rel="icon" href="{{ .Site.BaseURL }}icon.svg?v=5" type="image/svg+xml" />
<link rel="apple-touch-icon" href="{{ .Site.BaseURL }}apple-touch-icon.png?v=5" />
<link rel="manifest" href="{{ .Site.BaseURL }}manifest.webmanifest" />
```

📝 **The `?v=` is the only cache-buster there is**, and it is load-bearing — browsers keep favicons in a store that a hard reload does not clear. It went to `?v=3` on 7th September 2026 with the colour fix, to `?v=4` the same day when the canonical master's dark-mode `<style>` was rewritten, and to `?v=5` later that day when the green became Eton Blue (#12). **Any change to a served icon must bump it in the same commit** — ⚠️ **the SVG counts, not only the rasters.** `static/icon.svg` is what a desktop browser actually shows in the tab, and a change confined to its `<style>` block still changes what the viewer sees.

📝 **`site.Params.color` was `#9c9a75` until 7th September 2026** — a fourth value of the signature colour, missed when the other three were reconciled on 30th August. It is now `#9C9B77`.

## Still undone

- ⏳ **`static/manifest.webmanifest` carries only an `icons` array** — no `name`, `short_name`, `theme_color`, `background_color` or `display`. It is valid but minimal, and an installed web app gets no name from it. raffish.design's equivalent sets all five.
- ⏳ **`avatar-1024.png` is transparent**, because it is built from the same transparent master as everything else. X and GitHub composite it on their own background, which is usually what is wanted; if a solid ground is ever preferred there, it needs a second render path, not a hand edit.
- (Done 7th September 2026: `static/favicon.ico` swapped for the PNG-in-ICO build — 5,330 bytes against the old 32-bit BMP's 15,086, same three sizes, same artwork; 5,324 bytes since the Eton Blue rebuild.)

## Rebuilding

`scripts/build-icons.py` reads the master and writes every raster above:

```bash
python3 scripts/build-icons.py brand/icon/icon.svg brand/icon
```

⛔ **Do not edit the rasters by hand, and do not edit `icon.svg` here at all** — it is a copy of the vault canonical file. Change a number in the script — the size list, the render resolution — and rerun.

📝 **The dark-mode `<style>` block is stripped before rasterising**, so the PNGs and the `.ico` are the light rendering. The presentation attributes on the paths carry the same colours, so nothing else about the artwork changes. ✅ **Proved on 7th September 2026:** the master's `<style>` was rewritten and all five rasters rebuilt **byte-identically**.

📝 **It has no third-party dependencies, by necessity.** None of `cairosvg`, `Pillow`, `rsvg-convert`, ImageMagick or Inkscape is installed on this machine; rasterising is macOS `sips`, and the ICO container is packed by the script itself. It renders once at 2048px and downsamples, which gives visibly cleaner antialiasing at 16 and 32px than rasterising the vector at those sizes directly. ✅ Verified byte-reproducible — a rerun into a scratch directory returns all five outputs identical.

## Where the mark is served

| Host | State as at 11th September, 2026 |
| --- | --- |
| `www.donaldjenkins.com/favicon.ico` | ✅ Eton Blue build (`1ba56b10…`, 5,324 bytes), byte-identical to `static/favicon.ico`. The other three rasters are byte-identical to `static/` too. |
| `www.donaldjenkins.com/icon.svg` | ✅ Canonical, Eton Blue (`8bae968e…`), byte-identical to the vault master. |
| `shared.via.dj/favicon.ico` | ✅ **Eton Blue build** — `1ba56b10…`, 5,324 bytes, `ETag e400df45…` (the object's MD5), `Last-Modified` 7th September 2026 10:49 GMT. Bucket `donaldjenkins` in the Policymakr account. 📝 Neither superseded object is kept in `_superseded/`, because both are already in git: the drifted build at `22ebdaa:brand/icon/favicon.ico`, and the Summer Green build (`6eb52213…`, 5,330 bytes, `ETag 4d4233ce…`) at `4cba1d2:brand/icon/favicon.ico`. The 2023 one is kept there only because it never was. |
| `assets.via.dj/favicon.ico` | 404 — no object. Harmless while nothing but images is served from it. |

⚠️ **A PDF cannot carry a favicon.** It has no `<head>`, so the browser falls back to `/favicon.ico` at the origin — which is why the icon on `shared.via.dj/*.pdf` is a bucket-level object and not anything the site controls.

To re-upload the R2 object (done 7th September 2026; kept because every future asset change on an R2 custom domain needs it):

```bash
cd ~/Sites/donaldjenkins && \
CLOUDFLARE_ACCOUNT_ID=96eec27309a1f09a3cb3b62746a80851 \
CLOUDFLARE_API_TOKEN=$(op item get "Cloudflare - raffish assets - R2 write" --fields label=credential --reveal) \
npx wrangler r2 object put donaldjenkins/favicon.ico \
  --file brand/icon/favicon.ico \
  --content-type image/x-icon \
  --cache-control "public, max-age=86400" \
  --remote
```

⚠️ **Then purge the edge cache** with `Cloudflare - cache purge - Policymakr` (Ops vault). Replacing the object alone does not change what the URL serves — a PoP will keep an old copy for up to four hours. Verify in a private window, not a hard reload: favicons live in a browser store of their own that a hard reload does not clear.
