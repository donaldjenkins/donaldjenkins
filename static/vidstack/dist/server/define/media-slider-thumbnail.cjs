'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var maverick_js = require('maverick.js');

// src/define/media-slider-thumbnail.ts
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

// src/player/ui/slider-thumbnail/element.tsx
var $$_templ = ['<!$><div part="container"><!$><img', "", ' part="img" loading="eager" decoding="async" /></div>'];
var SliderThumbnailDefinition = element.defineCustomElement({
  tagName: "media-slider-thumbnail",
  props: { src: { initial: "" } },
  setup({ host, props: { $src } }) {
    const $img = maverick_js.signal(null), $imgSrc = maverick_js.signal(""), $imgLoaded = maverick_js.signal(false), $error = maverick_js.signal(false), $coords = maverick_js.signal(null), $cueList = maverick_js.signal(null), $activeCue = maverick_js.signal(null), $hidden = () => $error() || !Number.isFinite($media.duration), $slider = useSliderStore(), { $store: $media } = useMedia(), $crossorigin = () => $media.crossorigin;
    host.setAttributes({
      "data-loading": () => !$hidden() && !$imgLoaded(),
      "data-hidden": $hidden
    });
    maverick_js.effect(() => {
      if (!$media.canLoad)
        return;
      const video = document.createElement("video");
      video.crossOrigin = "";
      const track = document.createElement("track");
      track.src = $src();
      track.default = true;
      track.kind = "metadata";
      video.append(track);
      let cancelled = false;
      $error.set(false);
      $imgLoaded.set(false);
      track.onload = () => {
        if (cancelled)
          return;
        $cueList.set(track.track.cues);
      };
      track.onerror = () => $error.set(true);
      return () => {
        cancelled = true;
        $cueList.set(null);
      };
    });
    maverick_js.effect(() => {
      const cues = $cueList();
      if (!cues || !Number.isFinite($media.duration)) {
        $activeCue.set(null);
        return;
      }
      const currentTime = $slider.pointerRate * $media.duration;
      for (let i = 0; i < cues.length; i++) {
        if (currentTime >= cues[i].startTime && currentTime <= cues[i].endTime) {
          $activeCue.set(cues[i]);
          break;
        }
      }
    });
    maverick_js.effect(() => {
      const cue = $activeCue();
      if (!cue) {
        $imgSrc.set("");
        $coords.set(null);
        return;
      }
      const [_src, _coords] = (cue.text || "").split("#");
      const [_props, _values] = _coords.split("=");
      $imgSrc.set(
        !maverick_js.peek($src).startsWith("/") && !/https?:/.test(_src) ? `${new URL(maverick_js.peek($src)).origin}${_src.replace(/^\/?/, "/")}` : _src
      );
      if (_props && _values) {
        const coords = {}, values = _values.split(",");
        for (let i = 0; i < _props.length; i++)
          coords[_props[i]] = +values[i];
        $coords.set(coords);
      } else {
        $coords.set(null);
      }
    });
    maverick_js.effect(() => {
      $imgSrc();
      $imgLoaded.set(false);
    });
    const styleReverts = [];
    function applyStyle(el, name, value, priority) {
      el.style.setProperty(name, value, priority);
      styleReverts.push(() => el.style.removeProperty(name));
    }
    maverick_js.effect(() => {
      const img = $img(), coords = $coords();
      if (!img || !coords || !$imgLoaded()) {
        for (const revert of styleReverts)
          revert();
        return;
      }
      const { w, h, x, y } = coords, { maxWidth, maxHeight, minWidth, minHeight } = getComputedStyle(host.el), minRatio = Math.max(parseInt(minWidth) / w, parseInt(minHeight) / h), maxRatio = Math.min(parseInt(maxWidth) / w, parseInt(maxHeight) / h), scale = maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;
      styleReverts.length = 0;
      applyStyle(host.el, "--thumbnail-width", `${w * scale}px`);
      applyStyle(host.el, "--thumbnail-height", `${h * scale}px`);
      applyStyle(img, "width", `${img.naturalWidth * scale}px`);
      applyStyle(img, "height", `${img.naturalHeight * scale}px`);
      applyStyle(img, "transform", `translate(-${x * scale}px, -${y * scale}px)`);
    });
    return () => ssr.$$_ssr($$_templ, ssr.$$_attr("src", $imgSrc), ssr.$$_attr("crossorigin", $crossorigin));
  }
});

// src/define/media-slider-thumbnail.ts
element.registerLiteCustomElement(SliderThumbnailDefinition);
