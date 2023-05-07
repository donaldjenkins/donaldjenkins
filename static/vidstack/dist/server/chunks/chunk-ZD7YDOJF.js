import { MediaRemoteControl } from './chunk-HFEWFZN4.js';
import { preconnect } from './chunk-HJOTOEX7.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_ssr, $$_attr } from 'maverick.js/ssr';
import { signal, effect } from 'maverick.js';
import { defineCustomElement, onConnect } from 'maverick.js/element';

// src/player/ui/poster/props.ts
var posterProps = {
  alt: {}
};

// src/player/ui/poster/element.tsx
var $$_templ = ["<!$><img", "", "", ' part="img" />'];
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
    return () => $$_ssr($$_templ, $$_attr("src", $imgSrc), $$_attr("alt", $imgAlt), $$_attr("crossorigin", $crossorigin));
  }
});

export { PosterDefinition };
