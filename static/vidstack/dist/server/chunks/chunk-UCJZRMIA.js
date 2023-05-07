import { useSliderStore } from './chunk-J5ZUXZE6.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_ssr, $$_attr } from 'maverick.js/ssr';
import { signal, effect } from 'maverick.js';
import { defineCustomElement, onConnect } from 'maverick.js/element';
import { dispatchEvent } from 'maverick.js/std';

// src/player/ui/slider-video/props.ts
var sliderVideoProps = {
  src: {}
};

// src/player/ui/slider-video/element.tsx
var $$_templ = ['<!$><video muted="" playsinline="" preload="auto"', "", ' part="video" style="max-width: unset"></video>'];
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
    return () => $$_ssr($$_templ, $$_attr("src", $videoSrc), $$_attr("crossorigin", $crossorigin));
  }
});

export { SliderVideoDefinition };
