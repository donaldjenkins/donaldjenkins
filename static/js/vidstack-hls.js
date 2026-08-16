/* Point Vidstack's HLS provider at a self-hosted copy of hls.js.
 *
 * Vidstack's default is to fetch
 *   https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js
 * at runtime on any page with a video. That third-party fetch is the only
 * reason script-src needs a cdn.jsdelivr.net allowance, and it leaks visitor
 * IPs to jsDelivr. Serving hls.js from this origin instead keeps script-src
 * at a bare 'self'.
 *
 * The provider's `library` property is the documented hook for this, and it is
 * settable only from JavaScript — Vidstack 0.4.x exposes no `hls-library`
 * attribute. An inline script would be blocked by the CSP, hence this file.
 *
 * ORDERING MATTERS. This must run before Vidstack creates a provider. It is a
 * classic (non-module) script, so it executes during parsing, ahead of the
 * deferred `type="module"` prod.js that follows it. The listener is registered
 * on `document` in the CAPTURE phase, which reaches the event regardless of
 * whether it bubbles, and covers players that initialise late — the shortcodes
 * set load="visible", so a provider may not be created until the reader
 * scrolls to it.
 *
 * /hls/hls.min.js is mounted from node_modules/hls.js in config.toml.
 */
document.addEventListener(
  'provider-change',
  function (event) {
    var provider = event.detail;
    if (provider && provider.type === 'hls') {
      provider.library = '/hls/hls.min.js';
    }
  },
  true
);
