import { toggleButtonProps, useToggleButton } from './chunk-F77P4SG6.js';
import { useARIAKeyShortcuts } from './chunk-FPSFPUBI.js';
import { Icon } from './chunk-IWORFIII.js';
import { setARIALabel } from './chunk-EWIZ7YX3.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_component } from 'maverick.js/ssr';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { playPaths, replayPaths, pausePaths } from 'media-icons';

var PlayButtonDefinition = defineCustomElement({
  tagName: "media-play-button",
  props: toggleButtonProps,
  setup({ host, props: { $disabled, $defaultAppearance } }) {
    const { $store: $media, remote } = useMedia(), $pressed = () => !$media.paused, toggle = useToggleButton(host, {
      $props: { $pressed, $disabled },
      onPress
    });
    useARIAKeyShortcuts(host, "togglePaused");
    onAttach(() => {
      setARIALabel(host.el, () => $media.paused ? "Play" : "Pause");
    });
    host.setAttributes({
      "default-appearance": $defaultAppearance,
      "data-paused": () => $media.paused,
      "data-ended": () => $media.ended
    });
    function onPress(event) {
      if ($disabled())
        return;
      $pressed() ? remote.pause(event) : remote.play(event);
    }
    return mergeProperties(toggle, {
      $render: () => {
        return [
          $$_create_component(Icon, { paths: playPaths, slot: "play" }),
          $$_create_component(Icon, { paths: replayPaths, slot: "replay" }),
          $$_create_component(Icon, { paths: pausePaths, slot: "pause" })
        ];
      }
    });
  }
});

export { PlayButtonDefinition };
