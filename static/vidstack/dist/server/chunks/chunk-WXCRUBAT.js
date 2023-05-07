import { setARIALabel } from './chunk-EWIZ7YX3.js';
import { useFocusVisible } from './chunk-FU2MDXXS.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_ssr } from 'maverick.js/ssr';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { listenEvent, isKeyboardEvent, isKeyboardClick } from 'maverick.js/std';

var $$_templ = ['<!$><div part="container"><div part="text">LIVE</div></div>'];
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
    return () => $$_ssr($$_templ);
  }
});

export { LiveIndicatorDefinition };
