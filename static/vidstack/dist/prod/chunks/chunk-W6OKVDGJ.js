import { toggleButtonProps, useToggleButton } from './chunk-SA4WUWXW.js';
import { useARIAKeyShortcuts } from './chunk-5K2RNKKZ.js';
import { isTrackCaptionKind } from './chunk-CW3ZGA4K.js';
import { Icon } from './chunk-GLI6O3AL.js';
import { setARIALabel } from './chunk-25YO7G2G.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_component } from 'maverick.js/dom';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { mergeProperties } from 'maverick.js/std';
import { closedCaptionsOnPaths, closedCaptionsPaths } from 'media-icons';

var CaptionButtonDefinition = defineCustomElement({
  tagName: "media-caption-button",
  props: toggleButtonProps,
  setup({ host, props: { $disabled, $defaultAppearance }, accessors }) {
    const { $store: $media, remote } = useMedia(), $pressed = () => !!$media.textTrack, toggle = useToggleButton(host, {
      $props: { $pressed, $disabled },
      onPress
    });
    useARIAKeyShortcuts(host, "toggleCaptions");
    onAttach(() => {
      setARIALabel(
        host.el,
        () => $media.textTrack ? "Closed-Captions Off" : "Closed-Captions On"
      );
    });
    host.setAttributes({
      "data-hidden": () => $media.textTracks.filter(isTrackCaptionKind).length == 0,
      "default-appearance": $defaultAppearance
    });
    function onPress(event) {
      if ($disabled())
        return;
      remote.toggleCaptions(event);
    }
    return mergeProperties(toggle, accessors(), {
      $render: () => {
        return [
          $$_create_component(Icon, { paths: closedCaptionsOnPaths, slot: "on" }),
          $$_create_component(Icon, { paths: closedCaptionsPaths, slot: "off" })
        ];
      }
    });
  }
});

export { CaptionButtonDefinition };
