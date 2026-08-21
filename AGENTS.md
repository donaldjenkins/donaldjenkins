# AGENTS.md

## Cursor Cloud specific instructions

This repo is the source for `donaldjenkins.com` — a **Hugo Extended** static site (the "Kensington" theme). There is no database and no application server. An optional Cloudflare Worker lives in `workers/contactform/`.

### Services / how to run

- **Dev server (main workflow):** `hugo server` — serves at `http://localhost:1313/` in the `development` environment (skips PostCSS/minify/fingerprint). Drafts are hidden unless you add `-D`.
- **Production build:** `hugo` (no subcommand) defaults to the `production` environment and runs the full PostCSS → minify → fingerprint pipeline, writing to `public/` (gitignored).
- **New content:** `hugo new content articles/<name>.md` (uses `archetypes/articles.md`).
- **Tests / lint:** none are wired up. `npm test` is a placeholder that intentionally exits 1. Do not treat its failure as a real error.

### Required toolchain (baked into the VM snapshot)

Hugo Extended, the standalone Dart Sass `sass` binary, Node/npm, and Go (Hugo Modules). `npm install` is required because `config.toml` mounts files from `node_modules/` (vidstack, hls.js, modern-normalize) into the site. Go + network access to GitHub are required because `config.toml` imports `github.com/donaldjenkins/documentation` as a Hugo Module to supply `content/policies/terms.md` and `privacy.md`.

### CRITICAL: Hugo version constraint (`0.114.0 ≤ Hugo < 0.128.0`)

The snapshot pins **Hugo 0.127.0** on purpose. The site does **not** build on current Hugo. Do not "upgrade" Hugo without also changing code:

- `config.toml` uses `paginate = 50`, which was **removed in Hugo 0.128.0** (hard error `paginate ... subsequently removed` in ≥ 0.128). Use `pagination.pagerSize` if you ever bump past 0.127.
- `layouts/contact/index.html` uses the global `{{ Content }}` function, which was **removed by the template-system overhaul in Hugo 0.146.0** (`function "Content" not defined` in ≥ 0.146). Would need to become `{{ .Content }}`.
- Dart Sass is invoked via `transpiler "dartsass"` (see `layouts/partials/head/styles.html`), which needs the standalone `sass` binary and **Hugo ≥ 0.114.0**. Older Hugo (e.g. the `0.112.5` referenced in a comment) instead needs the deprecated `dart-sass-embedded` binary.

Production (Cloudflare Pages) pins `HUGO_VERSION` in the external dashboard, not in the repo.

### Optional: contact-form Worker

`workers/contactform/` is a standalone Cloudflare Worker (`npx wrangler@3 dev`). It sends email via Amazon SES and needs real `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` secrets, so it cannot be exercised end-to-end in this environment without credentials. See `workers/contactform/README.md`.
