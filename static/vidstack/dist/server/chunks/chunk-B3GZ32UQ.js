import { toggleButtonProps, useToggleButton } from './chunk-F77P4SG6.js';
import { useARIAKeyShortcuts } from './chunk-FPSFPUBI.js';
import { Icon } from './chunk-IWORFIII.js';
import { setARIALabel } from './chunk-EWIZ7YX3.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_component } from 'maverick.js/ssr';
import { computed } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { volumeHighPaths, volumeLowPaths, mutePaths } from 'media-icons';

var MuteButtonDefinition = defineCustomElement({
  tagName: "media-mute-button",
  props: toggleButtonProps,
  setup({ host, props: { $disabled, $defaultAppearance } }) {
    const { $store: $media, remote } = useMedia(), $pressed = computed(() => $media.muted || $media.volume === 0), toggle = useToggleButton(host, {
      $props: { $pressed, $disabled },
      onPress
    });
    useARIAKeyShortcuts(host, "toggleMuted");
    onAttach(() => {
      setARIALabel(host.el, () => $pressed() ? "Unmute" : "Mute");
    });
    host.setAttributes({
      "data-muted": $pressed,
      "data-volume": getVolumeText,
      "default-appearance": $defaultAppearance
    });
    function getVolumeText() {
      if ($media.muted || $media.volume === 0)
        return "muted";
      else if ($media.volume >= 0.5)
        return "high";
      else if ($media.volume < 0.5)
        return "low";
    }
    function onPress(event) {
      if ($disabled())
        return;
      $pressed() ? remote.unmute(event) : remote.mute(event);
    }
    return mergeProperties(toggle, {
      $render: () => {
        return [
          $$_create_component(Icon, { paths: volumeHighPaths, slot: "volume-high" }),
          $$_create_component(Icon, { paths: volumeLowPaths, slot: "volume-low" }),
          $$_create_component(Icon, { paths: mutePaths, slot: "volume-muted" })
        ];
      }
    });
  }
});

export { MuteButtonDefinition };
