import { setARIALabel } from './chunk-25YO7G2G.js';
import { useFocusVisible } from './chunk-YQSJJLRL.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_next_template, $$_create_template } from 'maverick.js/dom';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { listenEvent, isKeyboardEvent, isKeyboardClick } from 'maverick.js/std';

var $$_templ = /* @__PURE__ */ $$_create_template(`<!$><div part="container"><div part="text">LIVE</div></div>`);
var LiveIndicatorDefinition = defineCustomElement({
  tagName: "media-live-indicator",
  setup({ host }) {
    const { $store: $media, remote } = useMedia();
    useFocusVisible(host.$el);
    host.setAttributes({
      tabindex: () => $media.live ? 0 : null,
      role: () => $media.live ? "button" : null,
      "data-live": () => $media.live,
      "data-live-edge": () => $media.liveEdge,
      "data-media-button": true
    });
    onAttach(() => {
      setARIALabel(host.el, () => $media.live ? "Go live" : null);
      const clickEvents = ["pointerup", "keydown"];
      for (const eventType of clickEvents)
        listenEvent(host.el, eventType, onPress);
    });
    function onPress(event) {
      if ($media.liveEdge || isKeyboardEvent(event) && !isKeyboardClick(event))
        return;
      remote.seekToLiveEdge(event);
    }
    return () => $$_next_template($$_templ);
  }
});

export { LiveIndicatorDefinition };
