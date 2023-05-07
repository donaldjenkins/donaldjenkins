import { toggleButtonProps, useToggleButton } from './chunk-F77P4SG6.js';
import { useARIAKeyShortcuts } from './chunk-FPSFPUBI.js';
import { isTrackCaptionKind } from './chunk-BCHRLKDT.js';
import { Icon } from './chunk-IWORFIII.js';
import { setARIALabel } from './chunk-EWIZ7YX3.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_create_component } from 'maverick.js/ssr';
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
