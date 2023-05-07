import { formatTime } from './chunk-E6EPK3UH.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_walker, $$_insert_at_marker_lite, $$_create_template } from 'maverick.js/dom';
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
var $$_templ = /* @__PURE__ */ $$_create_template(`<!$><span><!$></span>`);
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
    return () => (() => {
      const [$$_root, $$_walker] = $$_create_walker($$_templ), $$_expr = $$_walker.nextNode();
      $$_insert_at_marker_lite($$_expr, $formattedTime);
      return $$_root;
    })();
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
