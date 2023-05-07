import { toggleButtonProps, useToggleButton } from './chunk-SA4WUWXW.js';
import { useARIAKeyShortcuts } from './chunk-PRKJFLQC.js';
import { Icon } from './chunk-GLI6O3AL.js';
import { setARIALabel } from './chunk-25YO7G2G.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_component } from 'maverick.js/dom';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { fullscreenPaths, fullscreenExitPaths } from 'media-icons';

var FullscreenButtonDefinition = defineCustomElement({
  tagName: "media-fullscreen-button",
  props: {
    ...toggleButtonProps,
    target: { initial: "prefer-media" }
  },
  setup({ host, props: { $target, $disabled, $defaultAppearance }, accessors }) {
    const { $store: $media, remote } = useMedia(), $pressed = () => $media.fullscreen, toggle = useToggleButton(host, {
      $props: { $pressed, $disabled },
      onPress
    });
    useARIAKeyShortcuts(host, "toggleFullscreen");
    onAttach(() => {
      setARIALabel(host.el, () => $media.fullscreen ? "Exit Fullscreen" : "Enter Fullscreen");
    });
    host.setAttributes({
      "data-hidden": () => !$media.canFullscreen,
      "data-fullscreen": () => $media.fullscreen,
      "default-appearance": $defaultAppearance
    });
    function onPress(event) {
      if ($disabled())
        return;
      $pressed() ? remote.exitFullscreen($target(), event) : remote.enterFullscreen($target(), event);
    }
    return mergeProperties(toggle, accessors(), {
      $render: () => {
        return [
          $$_create_component(Icon, { paths: fullscreenPaths, slot: "enter" }),
          $$_create_component(Icon, { paths: fullscreenExitPaths, slot: "exit" })
        ];
      }
    });
  }
});

export { FullscreenButtonDefinition };
