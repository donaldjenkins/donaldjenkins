# donaldjenkins-contactform — Cloudflare Worker

Handler for the site's `/contact` form: **browser → this Worker → Amazon SES (send)**.
The owner's copy is then received via **ImprovMX forwarding** (not SES). Full chain +
debugging playbook: vault doc `Sites/donaldjenkins.com/Contact form architecture.md`.

## Files
- `index.js` — the Worker. Self-contained: signs SES v2 `SendEmail` requests with Web
  Crypto (SigV4), no bundled AWS SDK. Sends **only** the notification to
  `contact@donaldjenkins.com` (Reply-To = visitor) — no visitor acknowledgement, so the one
  SES send goes to an address that can't bounce. Spam/bot filtering is server-side: a
  honeypot field + email validation (syntax, disposable-domain blocklist, MX/A DNS check).
- `wrangler.toml` — deploy config. Cloudflare account: **policymakr**.

## Secrets — NOT in this repo
Set as **encrypted** Worker variables in the Cloudflare dashboard
(policymakr account → Workers & Pages → `donaldjenkins-contactform` →
Settings → Variables and Secrets):

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` — optional, defaults to `us-east-1`

The AWS key belongs to IAM user `wp-donaldjenkins-postmaster` (policy: SES send).
(Turnstile was removed 2026-08-13 — if a `TURNSTILE_SECRET_KEY` variable is still set on the
Worker it is now unused and can be deleted.)

## Deploy
Node < 22 on this machine, so pin wrangler to v3. One-time: `npx wrangler@3 login`.
Then, from this folder:

```bash
env -u CLOUDFLARE_API_TOKEN npx --yes wrangler@3 deploy
```

`env -u CLOUDFLARE_API_TOKEN` hides the Pages-scoped token in the shell so wrangler uses
your OAuth login instead. **Existing Worker secrets are preserved across deploys** (a
deploy does not wipe them). Live URL:
`https://donaldjenkins-contactform.policymakr.workers.dev`

## Notes
- **Spam protection is first-party — no third parties, no client-side JS** (2026-08-13).
  Two layers, both in the Worker: (1) a **honeypot** field (`url`, hidden in the form's
  off-screen div) — reject if filled; (2) **email validation** — syntax + disposable-domain
  blocklist + a DNS MX/A check via Cloudflare `1.1.1.1` DoH. Validation is *fail-open* (only
  clear fakes are rejected; DNS ambiguity is forwarded) so a genuine enquiry is never
  silently dropped. On failure the form redirects to a pure-CSS `#error` modal (styled with
  `var(--danger-bg)` in `static/css/contact.css`).
- **No visitor acknowledgement email** — the on-page `#thanks` modal confirms receipt. So the
  only SES send is the owner notification to `contact@` (which can't bounce), which
  permanently removes the SES bounce source. The site is now fully JS-free.
- **History:** rebuilt 2026-08-13 — the previous Worker had **hardcoded AWS keys** (since
  rotated + deleted) and shipped the full AWS SDK as an ~8,000-line bundle. A brief Turnstile
  phase (same day) was then replaced by the honeypot/validation approach above, to preserve
  the site's "does not track you" privacy stance.
