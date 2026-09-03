# AGENTS.md — `donaldjenkins/donaldjenkins`

Read this before you touch anything. It is the only orientation a fresh agent
session gets. The rules in §1 are not optional.

This repo is the source for **donaldjenkins.com** — a **Hugo Extended** static
site (the "Kensington" theme). No database, no application server. There is one
optional Cloudflare Worker under `workers/contactform/`.

---

## 1. Operating rule — you branch, a human merges

**Pushing a `cursor/*` branch is fine and expected. Writing to `main` is not — ever.**

`main` deploys: Cloudflare Pages builds and publishes on every push to `main`, with
no staging gate between the remote and the live site. The push *is* the deployment.
`main` also carries a GitHub ruleset that requires a pull request — treat that as
binding whether or not the platform actually stops your push, since it depends on how
your pushes authenticate.

A **render check gates every merge**. It lives **outside this repo** (in the owner's
vault) and **you cannot run it**. It is run on the *merge result* — the thing that will
actually deploy — not on your branch. A clean build does not replace it: build success
proves the site *builds*, not that it *renders correctly* (a past Hugo bump built clean,
exit 0, yet silently rendered `/articles` through the wrong template). The check counts
rendered elements, so a **CSS-only change is invisible to it** — for stylesheet work,
"identical to baseline" is necessary but not sufficient, and you must preserve compiled
output separately (§4).

So:

- ✅ Branch off **latest `main`**, named `cursor/<short-description>`.
- ✅ Push the branch and **report back**: what changed, why, what you verified, and
  anything untested — say so explicitly.
- ⛔ **Never push to `main`.**
- ⛔ **Never merge** — not a branch, not a pull request (including your own), not a
  fast-forward that "cannot break anything". The merge decision is never yours.
- ⛔ **Never force-push** over a branch that is not yours; never delete or rename remote
  branches; never change repository settings, Actions, or branch protection.
- ⛔ **Never modify `node_modules`.** It is reinstalled fresh on Cloudflare.

Open pull requests are the owner's to resolve — leave existing ones untouched unless
asked. `cursor/*` branches are disposable by design and are cleaned up by the human
maintainer; don't tidy them yourself.

---

## 2. Build facts — do not "simplify" these

### The Cloudflare build command runs Hugo TWICE

```
curl -sL https://github.com/sass/dart-sass/releases/download/1.76.0/dart-sass-1.76.0-linux-x64.tar.gz | tar xz && export PATH="$PWD/dart-sass:$PATH" && hugo --gc --minify && hugo --gc --minify
```

Two deliberate things, neither to be tidied:

1. **Dart Sass is installed by the build command, not by Hugo.** Hugo Extended bundles
   only the old LibSass; for the `dartsass` transpiler it shells out to an external
   `sass` binary that Cloudflare does not provide (the `DART_SASS_VERSION` env var is
   inert here). The SCSS uses Dart-Sass-only features (`@use "sass:color"`, HWB
   `color.adjust(… $blackness: …)`), so Dart Sass is mandatory. **Do not reduce the
   command to `hugo --gc --minify` — production will fail.**
2. **Hugo is invoked twice on purpose.** PurgeCSS reads `hugo_stats.json` *during* the
   build, but Hugo writes that file only at the *end*. A single pass therefore purges
   against the previous run's stats and silently strips styles for any newly-added
   markup. Pass 1 writes correct stats; pass 2 consumes them (the same reason LaTeX is
   run twice). The failure is **invisible locally** — dev builds skip PostCSS entirely —
   and shows up as an unstyled component on the live site.

The build command is **shared between Production and Preview**, so a build-command change
cannot be trialled on Preview first.

### `hugo_stats.json` must exist

`[build] writeStats = true` regenerates it, and pass 2 always corrects it, so **committing
it is no longer load-bearing** — but PurgeCSS errors if `./hugo_stats.json` is missing, so
the file must still be present in the repo. Keep it.

### Toolchain pins

| Tool | Version | Where pinned |
|---|---|---|
| Hugo Extended | **0.165.0** | Cloudflare Pages dashboard env (`HUGO_VERSION`) |
| Node | **22.23.2** (floor **≥ 22.15**, see below) | Cloudflare env (`NODE_VERSION`); `.nvmrc` says `22` |
| Cloudflare build system | v2 | dashboard |
| Dart Sass | 1.76.0 | the build command above |

There is **no Hugo version ceiling and no maximum** — the site tracks the pinned Hugo. Do
not add code or docs implying the repo must stay below some Hugo version.

### Node ≥ 22.15 is a hard floor locally

Hugo ≥ 0.161 runs PostCSS under Node's `--permission` sandbox and installs an ESM resolver
hook that calls `module.registerHooks()` — **added in Node v22.15.0 / v23.5.0**. On older
Node the production build dies in the PostCSS step, e.g.:

```
node: bad option: --permission
# or
SyntaxError: The requested module 'node:module' does not provide an export named 'registerHooks'
```

⚠️ **`node -v` does not prove which `node` runs — `which node` does.** A `node` earlier in
`PATH` can shadow the version you think is active (on the Cursor Cloud VM, `/exec-daemon/node`
is v22.14.0 and shadows nvm's newer build). Make sure the resolved `node` is ≥ 22.15, e.g.:

```bash
nvm use 22            # or: export PATH="$HOME/.nvm/versions/node/v22.*/bin:$PATH"
which node && node -v  # confirm BOTH the path and that it is >= 22.15
```

With a ≥ 22.15 `node`, a full production `hugo --gc --minify` completes in a couple of
seconds, exit 0. `hugo -e development` (or `hugo server`) skips PostCSS and is the fast
route while editing.

---

## 3. Commands

| Task | Command | Notes |
|---|---|---|
| Dev server | `hugo server` | `development` env; skips PostCSS/minify/fingerprint; drafts hidden unless `-D` |
| Quick build | `hugo -e development` | Skips PostCSS |
| Production build | the two-pass command in §2 | Requires external Dart Sass + Node ≥ 22.15 |
| New content | `hugo new content articles/<name>.md` | Uses `archetypes/articles.md` |
| Tests / lint | — | None. `npm test` is a placeholder that exits 1; not a real failure |

Output goes to `public/`, which is a **symlink to `public.nosync/`** (deliberate — keeps the
build tree out of any sync folder). `cleanDestinationDir = true` prunes stale output on each
build. Never place the working tree inside iCloud/Dropbox/etc.: sync eviction corrupts `.git`
and injects conflict copies into build output.

---

## 4. Gotchas that make local checks lie — and things NOT to "fix"

- **Preserve compiled-CSS parity on any refactor.** Build before and after and diff the
  output. The render check cannot see CSS changes (§1), so parity is your responsibility.
- **Hugo's resource cache serves stale CSS.** `resources/_gen/assets/sass/…` is not
  invalidated when an imported partial changes, and `--gc` does not clear it. To trust a
  CSS measurement: `rm -rf resources/_gen` and build with `--ignoreCache`.
- **Read the file the built HTML actually references.** CSS is content-hashed
  (`styles.min.<hash>.css`); inspecting everything in `public/css/` can show old hashes.
  Follow the `<link>` in the rendered HTML to the file that shipped.
- **`targetPath` is pinned to `css/styles.css`** in `layouts/partials/head/styles.html`.
  `static/_headers` keys its immutable-cache rule on `/css/styles.min.*`; renaming the
  target (e.g. to `main.min.*`) would silently drop that header. Leave it.
- **Preview deployments show broken card images — this is NOT a regression.** Cloudflare
  Images URLs are hardcoded absolute to `https://www.donaldjenkins.com/…`; on a `*.pages.dev`
  preview origin they are cross-origin and blocked by `img-src 'self'`. Production is fine
  because `'self'` *is* `www.donaldjenkins.com`. Same trap breaks CSP testing from
  `127.0.0.1`. Do not "fix" it. A green preview means the site *builds*, not that it renders
  correctly.

---

## 5. Where the durable record lives

Full history and rationale (`CHANGELOG.md`, `CLAUDE.md`, the render-check script and its
baselines) live in the owner's vault, **outside this repo**. This file is the in-repo
summary; when the two disagree, the vault is authoritative and you should flag the drift.

---

## 6. Optional: contact-form Worker

`workers/contactform/` is a standalone Cloudflare Worker (`npx wrangler@3 dev`). It sends
email via Amazon SES and needs real `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` secrets,
so it cannot be exercised end-to-end here without credentials. See its own `README.md`. It
is independent of the site build.
