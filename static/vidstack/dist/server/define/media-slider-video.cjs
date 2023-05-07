'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var maverick_js = require('maverick.js');
var std = require('maverick.js/std');

// src/define/media-slider-video.ts
var mediaContext = maverick_js.createContext();
function useMedia() {
  return maverick_js.useContext(mediaContext);
}
var sliderStore = maverick_js.createStore({
  min: 0,
  max: 100,
  value: 50,
  pointerValue: 0,
  focused: false,
  dragging: false,
  pointing: false,
  get interactive() {
    return this.dragging || this.focused || this.pointing;
  },
  get fillRate() {
    return calcRate(this.min, this.max, this.value);
  },
  get fillPercent() {
    return this.fillRate * 100;
  },
  get pointerRate() {
    return calcRate(this.min, this.max, this.pointerValue);
  },
  get pointerPercent() {
    return this.pointerRate * 100;
  }
});
function calcRate(min, max, value) {
  const range = max - min, offset = value - min;
  return range > 0 ? offset / range : 0;
}
var sliderStoreContext = maverick_js.createContext(() => sliderStore.create());
function useSliderStore() {
  return maverick_js.useContext(sliderStoreContext);
}

// src/player/ui/slider-video/props.ts
var sliderVideoProps = {
  src: {}
};

// src/player/ui/slider-video/element.tsx
var $$_templ = ['<!$><video muted="" playsinline="" preload="auto"', "", ' part="video" style="max-width: unset"></video>'];
var SliderVideoDefinition = element.defineCustomElement({
  tagName: "media-slider-video",
  props: sliderVideoProps,
  setup({ host, props: { $src } }) {
    let videoElement = null;
    const $canPlay = maverick_js.signal(false), $error = maverick_js.signal(false), $slider = useSliderStore(), { $store: $media } = useMedia(), $crossorigin = () => $media.crossorigin, $videoSrc = () => $media.canPlay ? $src() : null, $hidden = () => !!$error() || !$media.canPlay || !Number.isFinite($media.duration);
    host.setAttributes({
      "data-loading": () => !$canPlay() && !$hidden(),
      "data-hidden": $hidden
    });
    maverick_js.effect(() => {
      if ($canPlay() && videoElement && Number.isFinite($media.duration) && Number.isFinite($slider.pointerRate)) {
        videoElement.currentTime = $slider.pointerRate * $media.duration;
      }
    });
    maverick_js.effect(() => {
      $src();
      $canPlay.set(false);
      $error.set(false);
    });
    element.onConnect(() => {
      if (videoElement.readyState >= 2)
        onCanPlay();
    });
    function onCanPlay(trigger) {
      $canPlay.set(true);
      std.dispatchEvent(host.el, "can-play", { trigger });
    }
    return () => ssr.$$_ssr($$_templ, ssr.$$_attr("src", $videoSrc), ssr.$$_attr("crossorigin", $crossorigin));
  }
});

// src/define/media-slider-video.ts
element.registerLiteCustomElement(SliderVideoDefinition);
