import { $$_create_walker, $$_inner_html, $$_create_template } from 'maverick.js/dom';
import { signal, effect, peek } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { lazyPaths } from 'media-icons';

// src/icons/element.tsx
var $$_templ = /* @__PURE__ */ $$_create_template(`<!$><svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-media-icon="true"></svg>`);
var MediaIconDefinition = defineCustomElement({
  tagName: "media-icon",
  props: {
    type: {}
  },
  setup({ host, props: { $type }, accessors }) {
    const $paths = signal("");
    onAttach(() => {
      let hydrate = host.el.hasAttribute("mk-h");
      effect(() => {
        const type = $type();
        if (hydrate) {
          hydrate = false;
          return;
        }
        if (type && lazyPaths[type]) {
          lazyPaths[type]().then(({ default: paths2 }) => {
            if (type === peek($type))
              $paths.set(paths2);
          });
        } else
          $paths.set("");
      });
    });
    return mergeProperties(accessors(), {
      $render: () => (() => {
        const [$$_root, $$_walker] = $$_create_walker($$_templ);
        $$_inner_html($$_root, $paths);
        return $$_root;
      })()
    });
  }
});

export { MediaIconDefinition };
