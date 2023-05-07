import { toggleButtonProps, useToggleButton } from './chunk-SA4WUWXW.js';
import { useARIAKeyShortcuts } from './chunk-5K2RNKKZ.js';
import { Icon } from './chunk-GLI6O3AL.js';
import { setARIALabel } from './chunk-25YO7G2G.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_component } from 'maverick.js/dom';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { pictureInPicturePaths, pictureInPictureExitPaths } from 'media-icons';

var PIPButtonDefinition = defineCustomElement({
  tagName: "media-pip-button",
  props: toggleButtonProps,
  setup({ host, props: { $disabled, $defaultAppearance }, accessors }) {
    const { $store: $media, remote } = useMedia(), $pressed = () => $media.pictureInPicture, toggle = useToggleButton(host, {
      $props: { $pressed, $disabled },
      onPress
    });
    useARIAKeyShortcuts(host, "togglePictureInPicture");
    onAttach(() => {
      setARIALabel(
        host.el,
        () => $media.pictureInPicture ? "Exit Picture In Picture" : "Enter Picture In Picture"
      );
    });
    host.setAttributes({
      "data-hidden": () => !$media.canPictureInPicture,
      "data-pip": () => $media.pictureInPicture,
      "default-appearance": $defaultAppearance
    });
    function onPress(event) {
      if ($disabled())
        return;
      $pressed() ? remote.exitPictureInPicture(event) : remote.enterPictureInPicture(event);
    }
    return mergeProperties(toggle, accessors(), {
      $render: () => {
        return [
          $$_create_component(Icon, { paths: pictureInPicturePaths, slot: "enter" }),
          $$_create_component(Icon, { paths: pictureInPictureExitPaths, slot: "exit" })
        ];
      }
    });
  }
});

export { PIPButtonDefinition };
