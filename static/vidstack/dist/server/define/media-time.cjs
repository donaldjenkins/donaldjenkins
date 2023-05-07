'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var maverick_js = require('maverick.js');

// src/define/media-time.ts

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
var mediaContext = maverick_js.createContext();
function useMedia() {
  return maverick_js.useContext(mediaContext);
}

// src/player/ui/time/props.ts
var timeProps = {
  type: { initial: "current" },
  showHours: { initial: false },
  padHours: { initial: false },
  padMinutes: { initial: false },
  remainder: { initial: false }
};

// src/player/ui/time/element.tsx
var $$_templ = ["<!$><span><!$>", "</span>"];
var TimeDefinition = element.defineCustomElement({
  tagName: "media-time",
  props: timeProps,
  setup({ props: { $remainder, $padHours, $padMinutes, $showHours, $type } }) {
    const $media = useMedia().$store;
    const $formattedTime = maverick_js.computed(() => {
      const seconds = getSeconds($type(), $media), duration = $media.duration;
      if (!Number.isFinite(seconds + duration))
        return "LIVE";
      const time = $remainder() ? Math.max(0, duration - seconds) : seconds;
      return formatTime(time, $padHours(), $padMinutes(), $showHours());
    });
    return () => ssr.$$_ssr($$_templ, $formattedTime);
  }
});
function getSeconds(type, $media) {
  switch (type) {
    case "buffered":
      return $media.bufferedEnd;
    case "duration":
      return $media.duration;
    default:
      return $media.currentTime;
  }
}

// src/define/media-time.ts
element.registerLiteCustomElement(TimeDefinition);
