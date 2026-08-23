#!/usr/bin/env python3
"""Generate the Cloudflare custom error pages into static/errors/.

Cloudflare's Custom Errors feature does not accept pasted HTML: it fetches a URL
you host and inlines the result (docs: rules/custom-errors/edit-error-pages).
So every page here must be self-contained and publicly reachable. That is why
the CSS and the logo are written INTO each file rather than linked -- a visitor
being blocked by the WAF may well have their subresource requests blocked too,
and an error page that arrives unstyled defeats the point.

Single source of truth: this script. Edit the template or PAGES below, re-run,
commit the regenerated static/errors/*.html, push, then RE-FETCH each page in
the Cloudflare dashboard -- Cloudflare keeps its own snapshot and will not pick
up a redeploy on its own.

    python3 scripts/build-error-pages.py

Constraints imposed by Cloudflare and honoured here:
  * <head>/</head> must be present.
  * <meta name="referrer"> must NOT be present -- it breaks challenges.
  * 1.5 MB (1,500,000 bytes) hard ceiling per page.
  * Pages carrying a challenge or a 5xx/1xxx box must contain the mandatory
    token for their type (see TOKEN in each entry); the build asserts this.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "static" / "errors"
SIZE_LIMIT = 1_500_000

# --------------------------------------------------------------------------
# Design tokens -- lifted from assets/sass/abstracts/_colors.scss so these
# pages cannot drift from the site palette.
# --------------------------------------------------------------------------
CSS = """
/* Palette from assets/sass/abstracts/_colors.scss. Kept literal rather than
   imported: these files are snapshotted by Cloudflare and must stand alone. */
:root {
  --bg-a: hsl(37, 100%, 92%);   /* papaya whip  -- the /404 gradient, top    */
  --bg-b: hsl(49, 100%, 91%);   /* baja white   -- the /404 gradient, bottom */
  --ink: hsl(111, 0%, 34%);     /* davys gray   -- $text-color               */
  --ink-strong: hsl(0, 0%, 20%);
  --accent: hsl(0, 50%, 56%);   /* fuzzy wuzzy brown -- $link-hover          */
  --muted: hsl(0, 0%, 42%);
}

/* Two @font-face rules from one file, exactly as static/css/404.css does it --
   figtree.woff2 is variable, so both weights resolve from the same source.
   font-display:swap matters here: if the visitor is blocked, this request may
   be blocked too, and the fallback must render immediately rather than after a
   three-second block period. */
@font-face {
  font-family: Figtree;
  src: url("/fonts/figtree.woff2") format("woff2");
  font-weight: normal;
  font-display: swap;
}
@font-face {
  font-family: Figtree;
  src: url("/fonts/figtree.woff2") format("woff2");
  font-weight: bold;
  font-display: swap;
}

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(-45deg, var(--bg-a), var(--bg-b));
  background-attachment: fixed;
  font-family: Figtree, "Avenir Next", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Tahoma, sans-serif;
  color: var(--ink);
  line-height: 1.5;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* Logo, top left, exactly as on /404 -- inlined as SVG rather than <img> so it
   survives a blocked subresource request. */
.masthead { padding: clamp(1rem, 3vw, 1.75rem); }
.masthead a {
  display: inline-block;
  line-height: 0;
  border-radius: 4px;
}
.masthead svg { width: 210px; max-width: 55vw; height: auto; }

main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* No flex-start fallback for short viewports: body uses min-height, so main
     grows past the fold rather than overflowing a fixed box, and centring
     simply stops applying. Nothing gets clipped. */
  padding: 2rem clamp(1rem, 5vw, 3rem) clamp(2rem, 6vh, 4rem);
}

.mark {
  /* The /404 mark is a 342px box whose contents are scaled to 0.6; matching
     that box keeps these illustrations the same visual weight as the original. */
  width: clamp(150px, min(30vh, 30vw), 300px);
  height: auto;
  margin-bottom: clamp(0.5rem, 2vh, 1.25rem);
}

h1 {
  margin: 0;
  /* Sized off BOTH axes: the headings here run longer than the /404's
     "Uh oh.", so a vw-only clamp overflows a short viewport. */
  font-size: clamp(2.25rem, min(9vw, 13vh), 6.5rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.lede {
  margin: clamp(0.75rem, 2.5vh, 1.75rem) 0 0;
  font-size: clamp(1rem, 2.2vw, 1.5rem);
  max-width: 42ch;
  text-wrap: balance;
}

a { color: var(--ink); text-decoration-thickness: 1px; text-underline-offset: 3px; }
a:hover, a:focus-visible { color: var(--accent); }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }

/* The pill button from static/css/404.css -- defined there but never used on
   the live /404. Reused here so the set shares one visual language. */
.back {
  display: inline-block;
  margin-top: clamp(1.25rem, 4vh, 2.5rem);
  padding: 0.7em 2em;
  background: #fff;
  color: var(--ink);
  font-size: clamp(1rem, 2vw, 1.35rem);
  font-weight: 900;
  text-decoration: none;
  border-radius: 500px;
  box-shadow: 0 20px 70px 4px rgba(0, 0, 0, 0.1),
    inset 7px 33px 0 0 var(--bg-a);
  transition: transform 300ms ease, box-shadow 300ms ease, color 300ms ease;
}
.back:hover, .back:focus-visible {
  transform: translateY(-8px);
  box-shadow: 0 35px 90px 4px rgba(0, 0, 0, 0.28),
    inset 0 0 0 3px var(--ink);
}
@media (prefers-reduced-motion: reduce) {
  .back { transition: none; }
  .back:hover, .back:focus-visible { transform: none; }
}

/* Wrapper for the Cloudflare-injected token boxes (challenge widget, 5xx and
   1xxx detail blocks). Cloudflare's own cf.errors.css is NOT loaded on a custom
   page, so whatever it injects arrives unstyled -- these rules give it a
   readable home without assuming its internal markup. */
.cf-box {
  margin-top: clamp(1.25rem, 4vh, 2.5rem);
  width: min(100%, 38rem);
  font-size: 1rem;
  /* Centred, NOT left-aligned. Everything above this box is centred, so a
     ragged-left block starting at an arbitrary x reads as misaligned -- which
     is exactly how the first 5xx dashboard preview looked. The list below is
     the exception: its items stay left-aligned, but the list as a whole is
     centred as a group, which is the only way to keep bullets readable
     without breaking the page's centre line. */
  text-align: center;
}
.cf-box:empty { display: none; }
.cf-box > * { max-width: 100%; }
/* Cloudflare's 1xxx box lists a Requested URL and a full User-Agent string.
   Neither contains spaces, so `max-width` alone cannot contain them -- they
   overflow the box and then the page. A real Safari/Chrome UA is ~120
   characters, so this is production behaviour, not just a preview artefact
   (the preview inflates the URL further with a JWT). Break them anywhere. */
.cf-box { overflow-wrap: anywhere; }
.cf-box li { margin: 0.2em 0; }
.cf-box h1, .cf-box h2, .cf-box h3 {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--ink-strong);
}
.cf-box p { margin: 0.6em 0; }
.cf-box ul, .cf-box ol {
  display: inline-block;
  text-align: left;
  margin: 0.6em 0;
  padding-left: 1.25em;
}
.cf-box table {
  display: inline-table;
  text-align: left;
  border-collapse: collapse;
}
.cf-box td, .cf-box th { padding: 0.35em 0.6em; vertical-align: top; }
/* Cloudflare's box ends "Performance and Security by Cloudflare | Privacy".
   Without its own cf.errors.css that reads as "CloudflarePrivacy".
   ⚠️ The two links are NOT adjacent siblings -- an `a + a` rule does nothing.
   The real structure, read off a live dashboard preview on 23 Aug 2026, is:
       div.footer-link-wrapper
         span.footer-text     -> "Cloudflare"
         span.footer-divider  -> empty; cf.errors.css gives it its rule
         a.footer-text        -> "Privacy"
   So Cloudflare already provides the separator element; it is simply unstyled
   here. Style THAT rather than inventing spacing of our own. */
.cf-box .footer-divider {
  display: inline-block;
  width: 1px;
  height: 0.85em;
  margin: 0 0.6em;
  background: currentColor;
  opacity: 0.4;
  vertical-align: -0.08em;
}

.cf-box code, .cf-box pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
}

/* Challenge widgets are interactive. This MUST stack, not row: Cloudflare
   injects several sibling elements into the challenge box (the widget, an
   explanatory paragraph, a Ray ID block, its own attribution), and a plain
   `display:flex` laid them out as side-by-side columns -- which is exactly
   what the first dashboard preview showed. Column, centred, with breathing
   room between the pieces.
   NB: token names are written WITHOUT their colon delimiters anywhere in this
   stylesheet. Cloudflare substitutes tokens by string replacement over the
   whole document, so a literal one in a comment would be replaced too -- and
   injected markup containing an end-comment sequence would break out of the
   comment and take the stylesheet with it. */
.cf-box--challenge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}
.cf-box--challenge > * { margin: 0; }

footer {
  padding: 0 clamp(1rem, 5vw, 3rem) clamp(1rem, 3vh, 2rem);
  text-align: center;
  font-size: 0.8125rem;
  color: var(--muted);
}
footer code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  letter-spacing: 0.02em;
}
"""

# --------------------------------------------------------------------------
# Logo -- read from static/images/logo.svg at build time and inlined.
# --------------------------------------------------------------------------
def logo_svg() -> str:
    raw = (ROOT / "static" / "images" / "logo.svg").read_text().strip()
    raw = re.sub(r"^<svg ", '<svg role="img" aria-label="Donald Jenkins" ', raw)
    return raw


# --------------------------------------------------------------------------
# Illustrations.
#
# All drawn in the idiom of the existing /404 mark (assets.via.dj/images/
# system/404.svg): a 0-100 field scaled to 0.6 about its centre, white fills,
# 6px black outlines, 5px round-capped detail strokes, and one coral accent.
# Accent colours are taken from that same illustration's own palette.
# --------------------------------------------------------------------------
CORAL = "#e15c64"
SAGE = "#849b87"
INK = "#000101"


def mark(body: str, label: str) -> str:
    """Wrap shapes drawn in a 0-100 field the way the /404 mark is wrapped."""
    return (
        f'<svg class="mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" '
        f'role="img" aria-label="{label}">'
        f'<g transform="translate(20 20) scale(0.6)" fill="none" stroke="{INK}" '
        f'stroke-width="6" stroke-linecap="round" stroke-linejoin="round">'
        f"{body}</g></svg>"
    )


SHIELD = (
    '<path d="M50 6 88 21v31c0 22-17 37-38 43C29 89 12 74 12 52V21Z" fill="#fff"/>'
)

MARKS = {
    # WAF block -- the shield did its job, and you are on the wrong side of it.
    "shield-slash": mark(
        SHIELD
        + f'<path d="M33 67 67 33" stroke="{CORAL}" stroke-width="9"/>',
        "A shield struck through",
    ),
    # Managed challenge -- same shield, but this one is about to let you past.
    "shield-check": mark(
        SHIELD
        + f'<path d="M33 51 45 63 68 38" stroke="{SAGE}" stroke-width="9"/>',
        "A shield with a tick",
    ),
    # IP / country block -- a globe, struck through the same way as the shield.
    "globe-slash": mark(
        '<circle cx="50" cy="50" r="40" fill="#fff"/>'
        '<ellipse cx="50" cy="50" rx="18" ry="40" stroke-width="5"/>'
        '<path d="M14.3 32h71.4M14.3 68h71.4" stroke-width="5"/>'
        # White halo first, so the slash reads cleanly over the meridians
        # instead of tangling with them.
        '<path d="M24 76 76 24" stroke="#fff" stroke-width="17"/>'
        f'<path d="M24 76 76 24" stroke="{CORAL}" stroke-width="9"/>',
        "A globe struck through",
    ),
    # IP / country challenge -- the 404 face, but quizzical rather than dead.
    "face-quizzical": mark(
        '<circle cx="50" cy="50" r="40" fill="#fff"/>'
        f'<circle cx="37" cy="47" r="4.5" fill="{INK}" stroke="none"/>'
        f'<circle cx="63" cy="47" r="4.5" fill="{INK}" stroke="none"/>'
        # One brow level, one raised -- the whole expression lives in the gap
        # between them and the eyes, so keep it wide.
        '<path d="M29 31h16" stroke-width="5"/>'
        '<path d="M55 32l16-8" stroke-width="5"/>'
        '<path d="M36 68q7-7 14 0t14 0" stroke-width="5"/>',
        "A quizzical face",
    ),
    # Rate limiting -- a stopwatch, hand swept round.
    "stopwatch": mark(
        '<circle cx="50" cy="57" r="34" fill="#fff"/>'
        '<path d="M42 11h16M50 11v12"/>'
        '<path d="M77 27l7 7"/>'
        f'<path d="M50 57V36" stroke="{CORAL}" stroke-width="7"/>'
        f'<circle cx="50" cy="57" r="4" fill="{INK}" stroke="none"/>',
        "A stopwatch",
    ),
    # 500 class -- the 404 dead face, wearing a cloud instead of a head.
    "cloud-dead": mark(
        '<path d="M27 78Q12 78 12 63.5 12 49 27 48 30 27 50 28q19 1 21 17 15 0 15 15'
        "t-15 18Z\" fill=\"#fff\"/>"
        '<path d="M33 43 43 53M43 43 33 53M55 43 65 53M65 43 55 53" stroke-width="5"/>'
        '<path d="M39 68q10-10 20 0" stroke-width="5"/>',
        "A cloud with a stricken face",
    ),
    # Interactive challenge -- the visitor does something. Cloudflare's own
    # interactive challenge is literally a checkbox, so this mirrors it. The
    # tick is coral, not sage, to keep it distinct from the managed-challenge
    # shield.
    "checkbox-tick": mark(
        '<rect x="14" y="14" width="72" height="72" rx="14" fill="#fff"/>'
        f'<path d="M31 51 44 64 70 33" stroke="{CORAL}" stroke-width="9"/>',
        "A ticked checkbox",
    ),
    # Non-interactive challenge -- the BROWSER does the work and the visitor
    # waits. An hourglass, not the rate-limiting stopwatch: waiting, not haste.
    "hourglass": mark(
        '<path d="M32 14v8c0 12 18 20 18 28 0 8-18 16-18 28v8h36v-8'
        'c0-12-18-20-18-28 0-8 18-16 18-28v-8Z" fill="#fff"/>'
        f'<path d="M50 62 37 82h26Z" fill="{CORAL}" stroke="none"/>'
        '<path d="M26 14h48M26 86h48" stroke-width="6"/>',
        "An hourglass",
    ),
    # 1000 class -- Cloudflare cannot reach the origin: the link is broken.
    "broken-link": mark(
        # The two halves stop well short of centre: round caps add 4 units
        # each, so a narrower gap would close up and read as one closed link.
        '<path d="M40 28H28a22 22 0 0 0 0 44h12" stroke-width="8"/>'
        '<path d="M60 28h12a22 22 0 0 1 0 44H60" stroke-width="8"/>'
        f'<path d="M50 18V6M35 22 27 11M65 22l8-11" stroke="{CORAL}" stroke-width="6"/>',
        "A chain link snapped in two",
    ),
}

# --------------------------------------------------------------------------
# The pages. `token` is the mandatory Cloudflare token for that page type; the
# build refuses to write a page that is missing its own token.
# --------------------------------------------------------------------------
CONTACT = (
    '<a href="https://www.donaldjenkins.com/contact">let me know</a>'
)

PAGES = [
    {
        "file": "waf-block.html",
        "cf_type": "WAF block",
        "api_id": "waf_block",
        "status": "403",
        "title": "Blocked",
        "mark": "shield-slash",
        "heading": "Blocked.",
        "lede": f"The firewall took against that request. If it was a genuine one, do {CONTACT}.",
        "button": ("https://www.donaldjenkins.com/", "Back to safety"),
        "token": None,
    },
    {
        "file": "ip-block.html",
        "cf_type": "IP/Country block",
        "api_id": "ip_block",
        "status": "403",
        "title": "Not here",
        "mark": "globe-slash",
        "heading": "Not here.",
        "lede": f"Requests from your corner of the internet aren’t being let through. Nothing personal — but do {CONTACT} if it should be.",
        "button": None,
        "token": None,
    },
    {
        "file": "country-challenge.html",
        "cf_type": "IP/Country challenge",
        "api_id": "country_challenge",
        # Cloudflare's injected ::CAPTCHA_BOX:: supplies BOTH a Ray ID and its
        # own "Performance and Security by Cloudflare" line, so this page adds
        # neither. An earlier build carried a "Security check by Cloudflare"
        # line here; it was dropped once the dashboard preview showed the
        # duplication. Do not reinstate without checking the preview first.
        "ray_id": False,
        "status": "403",
        "title": "Just checking",
        "mark": "face-quizzical",
        "heading": "Just checking.",
        "lede": "A quick test, and then you’re on your way.",
        "button": None,
        "token": "::CAPTCHA_BOX::",
        "token_class": "cf-box cf-box--challenge",
    },
    {
        "file": "managed-challenge.html",
        "cf_type": "Managed challenge / I’m Under Attack Mode",
        "api_id": "managed_challenge",
        # Cloudflare's injected ::CAPTCHA_BOX:: supplies BOTH a Ray ID and its
        # own "Performance and Security by Cloudflare" line, so this page adds
        # neither. An earlier build carried a "Security check by Cloudflare"
        # line here; it was dropped once the dashboard preview showed the
        # duplication. Do not reinstate without checking the preview first.
        "ray_id": False,
        "status": "403",
        "title": "One moment",
        "mark": "shield-check",
        "heading": "One moment.",
        "lede": "Making sure you’re a person and not a script. This usually takes a second or two.",
        "button": None,
        "token": "::CAPTCHA_BOX::",
        "token_class": "cf-box cf-box--challenge",
    },
    {
        "file": "interactive-challenge.html",
        "cf_type": "Interactive challenge",
        "api_id": "interactive_challenge",
        "status": "403",
        "title": "Your turn",
        "mark": "checkbox-tick",
        "heading": "Your turn.",
        "lede": "One quick check, and then you’re through.",
        "button": None,
        "token": "::CAPTCHA_BOX::",
        "token_class": "cf-box cf-box--challenge",
        # Cloudflare's challenge box supplies its own Ray ID.
        "ray_id": False,
    },
    {
        "file": "noninteractive-challenge.html",
        "cf_type": "Non-interactive challenge",
        "api_id": "noninteractive_challenge",
        "status": "403",
        "title": "Hold on",
        "mark": "hourglass",
        "heading": "Hold on.",
        "lede": "Your browser is doing the checking. Nothing for you to do.",
        "button": None,
        # ⚠️ This type takes IM_UNDER_ATTACK_BOX, NOT the CAPTCHA one -- they
        # are separate dashboard page types, so nothing needs swapping between
        # them.
        "token": "::IM_UNDER_ATTACK_BOX::",
        "token_class": "cf-box cf-box--challenge",
        # Assumed to carry its own Ray ID like the other challenge boxes.
        # ⚠️ UNVERIFIED -- confirm on the dashboard preview; if no Ray ID
        # appears, set this back to True.
        "ray_id": False,
    },
    {
        "file": "ratelimit-block.html",
        "cf_type": "Rate limiting block",
        "api_id": "ratelimit_block",
        "status": "429",
        "title": "Steady on",
        "mark": "stopwatch",
        "heading": "Steady on.",
        "lede": "That’s rather a lot of requests at once. Give it a minute and try again.",
        "button": ("https://www.donaldjenkins.com/", "Back to the site"),
        "token": None,
    },
    {
        "file": "500-errors.html",
        # Cloudflare's error box prints its own Ray ID (confirmed on the 5xx
        # dashboard preview, 23 Aug), so the page must not print a second.
        "ray_id": False,
        "cf_type": "500 class errors",
        "api_id": "500_errors",
        "status": "5xx",
        "title": "It’s not you",
        "mark": "cloud-dead",
        "heading": "It’s not you.",
        "lede": "Something at this end fell over. It’s very likely temporary.",
        "button": ("https://www.donaldjenkins.com/", "Try the front page"),
        "token": "::CLOUDFLARE_ERROR_500S_BOX::",
    },
    {
        "file": "1000-errors.html",
        # Cloudflare's error box prints its own Ray ID (confirmed on the 5xx
        # dashboard preview, 23 Aug), so the page must not print a second.
        "ray_id": False,
        "cf_type": "1000 class errors",
        "api_id": "1000_errors",
        "status": "1xxx",
        "title": "Wires crossed",
        "mark": "broken-link",
        "heading": "Wires crossed.",
        "lede": f"Cloudflare can’t reach this site properly just now. If it stays that way, do {CONTACT}.",
        "button": ("https://www.donaldjenkins.com/", "Try the front page"),
        "token": "::CLOUDFLARE_ERROR_1000S_BOX::",
    },
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <!-- NB: this page deliberately carries no referrer meta tag - Cloudflare
         documents that one disrupts challenges. Do not add it.
         Cloudflare error page: {cf_type} ({api_id}, HTTP {status}).
         Generated by scripts/build-error-pages.py - edit that, not this. -->
    <title>{title} &middot; Donald Jenkins</title>
    <style>{css}</style>
  </head>
  <body>
    <header class="masthead">
      <a href="https://www.donaldjenkins.com/" title="Donald Jenkins &mdash; home"
        >{logo}</a
      >
    </header>
    <main>
      {mark}
      <h1>{heading}</h1>
      <p class="lede">{lede}</p>
{extra}
    </main>
{footer}
  </body>
</html>
"""


def build() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    logo = logo_svg()
    written = []

    for page in PAGES:
        extra = []
        if page["token"]:
            cls = page.get("token_class", "cf-box")
            extra.append(f'      <div class="{cls}">{page["token"]}</div>')
        if page["button"]:
            href, label = page["button"]
            extra.append(f'      <a class="back" href="{href}">{label}</a>')

        # Pages whose Cloudflare box already prints a Ray ID must not print a
        # second one -- see the challenge pages.
        footer = (
            "    <footer>Ray ID <code>::RAY_ID::</code></footer>"
            if page.get("ray_id", True)
            else ""
        )

        html = TEMPLATE.format(
            footer=footer,
            cf_type=page["cf_type"],
            api_id=page["api_id"],
            status=page["status"],
            title=page["title"],
            css=CSS,
            logo=logo,
            mark=MARKS[page["mark"]],
            heading=page["heading"],
            lede=page["lede"],
            extra="\n".join(extra),
        )

        # Cloudflare's own constraints, checked rather than trusted.
        assert "<head>" in html and "</head>" in html, page["file"]
        assert 'name="referrer"' not in html, page["file"]
        if page["token"]:
            assert page["token"] in html, f'{page["file"]} lost its mandatory token'
        # ⚠️ No page may carry a token that is not its own. Cloudflare replaces
        # tokens by string matching across the entire document -- including
        # inside comments -- so a stray one injects foreign markup into a page
        # that has no business rendering it. This guard exists because a
        # comment explaining the challenge layout once reintroduced a literal
        # CAPTCHA token onto all seven pages.
        expected = set()
        if page["token"]:
            expected.add(page["token"])
        if page.get("ray_id", True):
            expected.add("::RAY_ID::")
        found = set(re.findall(r"::[A-Z_0-9]+::", html))
        if found != expected:
            print(
                f"FAIL {page['file']}: tokens {sorted(found)} "
                f"but expected {sorted(expected)}",
                file=sys.stderr,
            )
            return 1

        size = len(html.encode("utf-8"))
        if size > SIZE_LIMIT:
            print(f"FAIL {page['file']}: {size} bytes exceeds {SIZE_LIMIT}", file=sys.stderr)
            return 1

        (OUT / page["file"]).write_text(html)
        written.append((page["file"], size, page["cf_type"]))

    width = max(len(f) for f, _, _ in written)
    for name, size, cf_type in written:
        print(f"  {name:<{width}}  {size:>6,} B   {cf_type}")
    print(f"\n{len(written)} pages written to {OUT.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    sys.exit(build())
