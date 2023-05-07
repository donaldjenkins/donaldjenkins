import { useSliderStore } from './chunk-J5ZUXZE6.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_walker, $$_effect, $$_attr, $$_listen, $$_ref, $$_create_template } from 'maverick.js/dom';
import { signal, effect } from 'maverick.js';
import { defineCustomElement, onConnect } from 'maverick.js/element';
import { dispatchEvent } from 'maverick.js/std';

// src/player/ui/slider-video/props.ts
var sliderVideoProps = {
  src: {}
};

// src/player/ui/slider-video/element.tsx
var $$_templ = /* @__PURE__ */ $$_create_template(`<!$><video muted="" playsinline="" preload="auto" part="video" style="max-width: unset"></video>`);
var SliderVideoDefinition = defineCustomElement({
  tagName: "media-slider-video",
  props: sliderVideoProps,
  setup({ host, props: { $src } }) {
    let videoElement = null;
    const $canPlay = signal(false), $error = signal(false), $slider = useSliderStore(), { $store: $media } = useMedia(), $crossorigin = () => $media.crossorigin, $videoSrc = () => $media.canPlay ? $src() : null, $hidden = () => !!$error() || !$media.canPlay || !Number.isFinite($media.duration);
    host.setAttributes({
      "data-loading": () => !$canPlay() && !$hidden(),
      "data-hidden": $hidden
    });
    effect(() => {
      if ($canPlay() && videoElement && Number.isFinite($media.duration) && Number.isFinite($slider.pointerRate)) {
        videoElement.currentTime = $slider.pointerRate * $media.duration;
      }
    });
    effect(() => {
      $src();
      $canPlay.set(false);
      $error.set(false);
    });
    onConnect(() => {
      if (videoElement.readyState >= 2)
        onCanPlay();
    });
    function onCanPlay(trigger) {
      $canPlay.set(true);
      dispatchEvent(host.el, "can-play", { trigger });
    }
    function onError(trigger) {
      $error.set(true);
      dispatchEvent(host.el, "error", { trigger });
    }
    return () => (() => {
      const [$$_root, $$_walker] = $$_create_walker($$_templ);
      $$_effect(() => $$_attr($$_root, "src", $videoSrc()));
      $$_effect(() => $$_attr($$_root, "crossorigin", $crossorigin()));
      $$_listen($$_root, "canplay", onCanPlay);
      $$_listen($$_root, "error", onError);
      $$_ref($$_root, (el) => void (videoElement = el));
      return $$_root;
    })();
  }
});

export { SliderVideoDefinition };
