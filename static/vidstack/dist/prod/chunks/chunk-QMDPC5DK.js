import { MediaRemoteControl } from './chunk-YGKQUFHH.js';
import { preconnect } from './chunk-TOHOCF6L.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_walker, $$_effect, $$_attr, $$_listen, $$_create_template } from 'maverick.js/dom';
import { signal, effect } from 'maverick.js';
import { defineCustomElement, onConnect } from 'maverick.js/element';

// src/player/ui/poster/props.ts
var posterProps = {
  alt: {}
};

// src/player/ui/poster/element.tsx
var $$_templ = /* @__PURE__ */ $$_create_template(`<!$><img part="img" />`);
var PosterDefinition = defineCustomElement({
  tagName: "media-poster",
  props: posterProps,
  setup({ host, props: { $alt } }) {
    const { $store: $media } = useMedia(), remote = new MediaRemoteControl();
    const $crossorigin = () => $media.crossorigin, $imgSrc = () => $media.canLoad && $media.poster.length ? $media.poster : null, $imgAlt = () => $imgSrc() ? $alt() : null, $imgLoading = signal(true), $imgError = signal(false);
    host.setAttributes({
      "data-loading": $imgLoading,
      "data-hidden": $imgError
    });
    onConnect(() => {
      window.requestAnimationFrame(() => {
        if (!$media.canLoad)
          preconnect($media.poster);
      });
      remote.setTarget(host.el);
      remote.hidePoster();
      return () => remote.showPoster();
    });
    effect(() => {
      const isLoading = $media.canLoad && !!$media.poster;
      $imgLoading.set(isLoading);
      $imgError.set(false);
    });
    function onLoad() {
      $imgLoading.set(false);
    }
    function onError() {
      $imgLoading.set(false);
      $imgError.set(true);
    }
    return () => (() => {
      const [$$_root, $$_walker] = $$_create_walker($$_templ);
      $$_effect(() => $$_attr($$_root, "src", $imgSrc()));
      $$_effect(() => $$_attr($$_root, "alt", $imgAlt()));
      $$_effect(() => $$_attr($$_root, "crossorigin", $crossorigin()));
      $$_listen($$_root, "load", onLoad);
      $$_listen($$_root, "error", onError);
      return $$_root;
    })();
  }
});

export { PosterDefinition };
