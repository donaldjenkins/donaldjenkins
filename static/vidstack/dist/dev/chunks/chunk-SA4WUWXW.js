import { setAttributeIfEmpty } from './chunk-25YO7G2G.js';
import { useFocusVisible } from './chunk-YQSJJLRL.js';
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
    const disabled = $disabled();
    if (disabled || isKeyboardEvent(event) && !isKeyboardClick(event)) {
      if (disabled)
        event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    props.onPress?.(event);
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
