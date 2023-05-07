'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var maverick_js = require('maverick.js');
var std = require('maverick.js/std');
var mediaIcons = require('media-icons');

// src/define/media-icon.ts
var $$_templ = ['<!$><svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-media-icon="true">', "</svg>"];
var MediaIconDefinition = element.defineCustomElement({
  tagName: "media-icon",
  props: {
    type: {}
  },
  setup({ host, props: { $type }, accessors }) {
    const $paths = maverick_js.signal("");
    {
      const type = $type();
      if (type && mediaIcons.paths[type])
        $paths.set(mediaIcons.paths[type]);
    }
    element.onAttach(() => {
      let hydrate = host.el.hasAttribute("mk-h");
      maverick_js.effect(() => {
        const type = $type();
        if (hydrate) {
          hydrate = false;
          return;
        }
        if (type && mediaIcons.lazyPaths[type]) {
          mediaIcons.lazyPaths[type]().then(({ default: paths2 }) => {
            if (type === maverick_js.peek($type))
              $paths.set(paths2);
          });
        } else
          $paths.set("");
      });
    });
    return std.mergeProperties(accessors(), {
      $render: () => ssr.$$_ssr($$_templ, ssr.$$_inject_html($paths))
    });
  }
});

// src/define/media-icon.ts
element.registerLiteCustomElement(MediaIconDefinition);
