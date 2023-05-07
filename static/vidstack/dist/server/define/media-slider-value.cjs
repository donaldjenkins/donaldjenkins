'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var maverick_js = require('maverick.js');

// src/define/media-slider-value.ts

// src/utils/number.ts
function round(num, decimalPlaces = 2) {
  return Number(num.toFixed(decimalPlaces));
}

// src/utils/time.ts
function padNumberWithZeroes(num, expectedLength) {
  const str = String(num);
  const actualLength = str.length;
  const shouldPad = actualLength < expectedLength;
  if (shouldPad) {
    const padLength = expectedLength - actualLength;
    const padding = `0`.repeat(padLength);
    return `${padding}${num}`;
  }
  return str;
}
function parseTime(duration) {
  const hours = Math.trunc(duration / 3600);
  const minutes = Math.trunc(duration % 3600 / 60);
  const seconds = Math.trunc(duration % 60);
  const fraction = Number((duration - Math.trunc(duration)).toPrecision(3));
  return {
    hours,
    minutes,
    seconds,
    fraction
  };
}
function formatTime(duration, shouldPadHours = false, shouldPadMinutes = false, shouldAlwaysShowHours = false) {
  const { hours, minutes, seconds } = parseTime(duration);
  const paddedHours = shouldPadHours ? padNumberWithZeroes(hours, 2) : hours;
  const paddedMinutes = shouldPadMinutes ? padNumberWithZeroes(minutes, 2) : minutes;
  const paddedSeconds = padNumberWithZeroes(seconds, 2);
  if (hours > 0 || shouldAlwaysShowHours) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${paddedMinutes}:${paddedSeconds}`;
}
var sliderValueFormattersContext = maverick_js.createContext(() => ({}));
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

// src/player/ui/slider-value/props.ts
var sliderValueTextProps = {
  type: { initial: "current" },
  format: {},
  showHours: { initial: false },
  padHours: { initial: false },
  padMinutes: { initial: false },
  decimalPlaces: { initial: 2 }
};

// src/player/ui/slider-value/element.tsx
var $$_templ = ["<!$><span><!$>", "</span>"];
var SliderValueDefinition = element.defineCustomElement({
  tagName: "media-slider-value",
  props: sliderValueTextProps,
  setup({ props: { $type, $format, $decimalPlaces, $padHours, $padMinutes, $showHours } }) {
    const $slider = useSliderStore(), formatters = maverick_js.useContext(sliderValueFormattersContext);
    const $text = maverick_js.computed(() => {
      var _a;
      const value = $type() === "current" ? $slider.value : $slider.pointerValue;
      const format = $format();
      if (format === "percent") {
        const range = $slider.max - $slider.min;
        const percent = value / range * 100;
        return (formatters.percent ?? round)(percent, $decimalPlaces()) + "\uFE6A";
      } else if (format === "time") {
        return (formatters.time ?? formatTime)(value, $padHours(), $padMinutes(), $showHours());
      } else {
        return ((_a = formatters.value) == null ? void 0 : _a.call(formatters, value)) ?? value.toFixed(2);
      }
    });
    return () => ssr.$$_ssr($$_templ, $text);
  }
});

// src/define/media-slider-value.ts
element.registerLiteCustomElement(SliderValueDefinition);
