import { $$_ssr, $$_attr, $$_inject_html } from 'maverick.js/ssr';

// src/icons/icon.tsx
var $$_templ = ['<!$><svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-media-icon="true"', ">", "</svg>"];
function Icon({ slot, paths }) {
  return $$_ssr($$_templ, $$_attr("slot", slot), $$_inject_html(paths));
}

export { Icon };
