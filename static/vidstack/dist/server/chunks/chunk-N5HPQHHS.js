import { useSliderStore } from './chunk-J5ZUXZE6.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_ssr, $$_attr } from 'maverick.js/ssr';
import { signal, effect, peek } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

var $$_templ = ['<!$><div part="container"><!$><img', "", ' part="img" loading="eager" decoding="async" /></div>'];
var SliderThumbnailDefinition = defineCustomElement({
  tagName: "media-slider-thumbnail",
  props: { src: { initial: "" } },
  setup({ host, props: { $src } }) {
    const $img = signal(null), $imgSrc = signal(""), $imgLoaded = signal(false), $error = signal(false), $coords = signal(null), $cueList = signal(null), $activeCue = signal(null), $hidden = () => $error() || !Number.isFinite($media.duration), $slider = useSliderStore(), { $store: $media } = useMedia(), $crossorigin = () => $media.crossorigin;
    host.setAttributes({
      "data-loading": () => !$hidden() && !$imgLoaded(),
      "data-hidden": $hidden
    });
    effect(() => {
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
    effect(() => {
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
    effect(() => {
      const cue = $activeCue();
      if (!cue) {
        $imgSrc.set("");
        $coords.set(null);
        return;
      }
      const [_src, _coords] = (cue.text || "").split("#");
      const [_props, _values] = _coords.split("=");
      $imgSrc.set(
        !peek($src).startsWith("/") && !/https?:/.test(_src) ? `${new URL(peek($src)).origin}${_src.replace(/^\/?/, "/")}` : _src
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
    effect(() => {
      $imgSrc();
      $imgLoaded.set(false);
    });
    const styleReverts = [];
    function applyStyle(el, name, value, priority) {
      el.style.setProperty(name, value, priority);
      styleReverts.push(() => el.style.removeProperty(name));
    }
    effect(() => {
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
    return () => $$_ssr($$_templ, $$_attr("src", $imgSrc), $$_attr("crossorigin", $crossorigin));
  }
});

export { SliderThumbnailDefinition };
