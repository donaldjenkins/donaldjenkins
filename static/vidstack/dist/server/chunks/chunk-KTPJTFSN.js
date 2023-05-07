import { formatTime } from './chunk-E6EPK3UH.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_ssr } from 'maverick.js/ssr';
import { computed } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

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
var TimeDefinition = defineCustomElement({
  tagName: "media-time",
  props: timeProps,
  setup({ props: { $remainder, $padHours, $padMinutes, $showHours, $type } }) {
    const $media = useMedia().$store;
    const $formattedTime = computed(() => {
      const seconds = getSeconds($type(), $media), duration = $media.duration;
      if (!Number.isFinite(seconds + duration))
        return "LIVE";
      const time = $remainder() ? Math.max(0, duration - seconds) : seconds;
      return formatTime(time, $padHours(), $padMinutes(), $showHours());
    });
    return () => $$_ssr($$_templ, $formattedTime);
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

export { TimeDefinition };
