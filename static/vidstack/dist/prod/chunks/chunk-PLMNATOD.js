import { toggleButtonProps, useToggleButton } from './chunk-SA4WUWXW.js';
import { signal } from 'maverick.js';
import { defineCustomElement } from 'maverick.js/element';

var ToggleButtonDefinition = defineCustomElement({
  tagName: "media-toggle-button",
  props: toggleButtonProps,
  setup({ host, props }) {
    const $pressed = signal(props.$defaultPressed()), toggle = useToggleButton(host, {
      $props: { ...props, $pressed },
      onPress
    });
    function onPress() {
      if (props.$disabled())
        return;
      $pressed.set((p) => !p);
    }
    return toggle;
  }
});

export { ToggleButtonDefinition };
