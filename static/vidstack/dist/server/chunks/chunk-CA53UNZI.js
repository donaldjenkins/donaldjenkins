import { formatTime } from './chunk-E6EPK3UH.js';
import { sliderValueFormattersContext } from './chunk-TW2KE7QB.js';
import { useSliderStore } from './chunk-J5ZUXZE6.js';
import { round } from './chunk-N2X5VJTG.js';
import { $$_ssr } from 'maverick.js/ssr';
import { useContext, computed } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

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
var SliderValueDefinition = defineCustomElement({
  tagName: "media-slider-value",
  props: sliderValueTextProps,
  setup({ props: { $type, $format, $decimalPlaces, $padHours, $padMinutes, $showHours } }) {
    const $slider = useSliderStore(), formatters = useContext(sliderValueFormattersContext);
    const $text = computed(() => {
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
    return () => $$_ssr($$_templ, $text);
  }
});

export { SliderValueDefinition };
