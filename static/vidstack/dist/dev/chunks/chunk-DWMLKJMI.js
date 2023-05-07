import { Icon } from './chunk-GLI6O3AL.js';
import { setAttributeIfEmpty, setARIALabel } from './chunk-25YO7G2G.js';
import { useFocusVisible } from './chunk-YQSJJLRL.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_component } from 'maverick.js/dom';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { listenEvent, isKeyboardEvent, isKeyboardClick } from 'maverick.js/std';
import { seekBackwardPaths, seekForwardPaths } from 'media-icons';

var SeekButtonDefinition = defineCustomElement({
  tagName: "media-seek-button",
  props: { seconds: { initial: 30 }, defaultAppearance: { initial: false } },
  setup({ host, props: { $seconds, $defaultAppearance } }) {
    const { $store: $media, remote } = useMedia();
    useFocusVisible(host.$el);
    onAttach(() => {
      setAttributeIfEmpty(host.el, "tabindex", "0");
      setAttributeIfEmpty(host.el, "role", "button");
      setARIALabel(
        host.el,
        () => `Seek ${$seconds() > 0 ? "forward" : "backward"} ${$seconds()} seconds`
      );
      const clickEvents = ["pointerup", "keydown"];
      for (const eventType of clickEvents)
        listenEvent(host.el, eventType, onPress);
    });
    host.setAttributes({
      seconds: $seconds,
      "data-media-button": true,
      "default-appearance": $defaultAppearance,
      "data-hidden": () => !$media.canSeek
    });
    function onPress(event) {
      if (isKeyboardEvent(event) && !isKeyboardClick(event))
        return;
      remote.seek($media.currentTime + $seconds(), event);
    }
    return () => [
      $$_create_component(Icon, { paths: seekBackwardPaths, slot: "backward" }),
      $$_create_component(Icon, { paths: seekForwardPaths, slot: "forward" })
    ];
  }
});

export { SeekButtonDefinition };
