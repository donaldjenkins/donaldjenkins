# donaldjenkins-contactform — Cloudflare Worker

Handler for the site's `/contact` form: **browser → this Worker → Amazon SES (send)**.
The owner's copy is then received via **ImprovMX forwarding** (not SES). Full chain +
debugging playbook: vault doc `Sites/donaldjenkins.com/Contact form architecture.md`.

## Files
- `index.js` — the Worker. Self-contained: signs SES v2 `SendEmail` requests with Web
  Crypto (SigV4), no bundled AWS SDK. Sends a "thank you" to the visitor and a
  notification to `contact@donaldjenkins.com` (Reply-To = visitor).
- `wrangler.toml` — deploy config. Cloudflare account: **policymakr**.

## Secrets — NOT in this repo
Set as **encrypted** Worker variables in the Cloudflare dashboard
(policymakr account → Workers & Pages → `donaldjenkins-contactform` →
Settings → Variables and Secrets):

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` — optional, defaults to `us-east-1`

The AWS key belongs to IAM user `wp-donaldjenkins-postmaster` (policy: SES send).

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

## Notes / TODO
- **Spam protection is a weak arithmetic CAPTCHA.** Planned: replace with **Cloudflare
  Turnstile** — needs a matching change to the form shortcode
  `layouts/shortcodes/contactform.html` (add the widget + `cf-turnstile-response`) and a
  Turnstile widget already exists (site key `0x4AAAAAAE06XqGQ57giC8S2`). This is the fix
  for the SES bounce/reputation problem (bots beating the sum-CAPTCHA get an
  acknowledgement emailed to fake addresses → hard bounces).
- **History:** rebuilt 2026-08-13 — the previous Worker had **hardcoded AWS keys**
  (since rotated + deleted) and shipped the full AWS SDK as an ~8,000-line bundle. This
  version moves credentials to encrypted env vars and is clean, readable source.
