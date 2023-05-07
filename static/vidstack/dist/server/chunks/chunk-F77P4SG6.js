import { setAttributeIfEmpty } from './chunk-EWIZ7YX3.js';
import { useFocusVisible } from './chunk-FU2MDXXS.js';
import { effect } from 'maverick.js';
import { onAttach } from 'maverick.js/element';
import { ariaBool, listenEvent, isKeyboardEvent, isKeyboardClick } from 'maverick.js/std';

// src/player/ui/toggle-button/props.ts
var toggleButtonProps = {
  disabled: { initial: false },
  defaultPressed: { initial: false },
  defaultAppearance: { initial: false }
};
function useToggleButton(host, { $props: { $pressed, $disabled }, ...props }) {
  host.setAttributes({
    disabled: $disabled,
    "data-pressed": $pressed,
    "aria-pressed": () => ariaBool($pressed()),
    "data-media-button": true
  });
  useFocusVisible(host.$el);
  onAttach(() => {
    setAttributeIfEmpty(host.el, "tabindex", "0");
    setAttributeIfEmpty(host.el, "role", "button");
  });
  effect(() => {
    const target = host.$el();
    if (!target)
      return;
    const clickEvents = ["pointerup", "keydown"];
    for (const eventType of clickEvents)
      listenEvent(target, eventType, onPress);
  });
  function onPress(event) {
    var _a;
    const disabled = $disabled();
    if (disabled || isKeyboardEvent(event) && !isKeyboardClick(event)) {
      if (disabled)
        event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    (_a = props.onPress) == null ? void 0 : _a.call(props, event);
  }
  return {
    get pressed() {
      return $pressed();
    },
    get disabled() {
      return $disabled();
    }
  };
}

export { toggleButtonProps, useToggleButton };
