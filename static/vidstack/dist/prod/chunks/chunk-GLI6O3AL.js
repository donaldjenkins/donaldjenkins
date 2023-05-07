import { $$_create_walker, $$_attr, $$_inner_html, $$_create_template } from 'maverick.js/dom';

// src/icons/icon.tsx
var $$_templ = /* @__PURE__ */ $$_create_template(`<!$><svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-media-icon="true"></svg>`);
function Icon({ slot, paths }) {
  return (() => {
    const [$$_root, $$_walker] = $$_create_walker($$_templ);
    $$_attr($$_root, "slot", slot);
    $$_inner_html($$_root, paths);
    return $$_root;
  })();
}

export { Icon };
