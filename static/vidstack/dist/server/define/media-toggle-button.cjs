'use strict';

var element = require('maverick.js/element');
var maverick_js = require('maverick.js');
var std = require('maverick.js/std');

// src/define/media-toggle-button.ts

// src/player/ui/toggle-button/props.ts
var toggleButtonProps = {
  disabled: { initial: false },
  defaultPressed: { initial: false },
  defaultAppearance: { initial: false }
};
var $keyboard = maverick_js.signal(false);
function useFocusVisible($target) {
  const $focused = maverick_js.signal(false);
  element.onConnect(() => {
    const target = $target();
    maverick_js.effect(() => {
      if (!$keyboard()) {
        $focused.set(false);
        updateFocusAttr(target, false);
        std.listenEvent(target, "pointerenter", () => updateHoverAttr(target, true));
        std.listenEvent(target, "pointerleave", () => updateHoverAttr(target, false));
        return;
      }
      const active = document.activeElement === target;
      $focused.set(active);
      updateFocusAttr(target, active);
      std.listenEvent(target, "focus", () => {
        $focused.set(true);
        updateFocusAttr(target, true);
      });
      std.listenEvent(target, "blur", () => {
        $focused.set(false);
        updateFocusAttr(target, false);
      });
    });
  });
  return $focused;
}
function updateFocusAttr(target, isFocused) {
  std.setAttribute(target, "data-focus", isFocused);
  std.setAttribute(target, "data-hocus", isFocused);
}
function updateHoverAttr(target, isHovering) {
  std.setAttribute(target, "data-hocus", isHovering);
}
function setAttributeIfEmpty(target, name, value) {
  if (!target.hasAttribute(name))
    target.setAttribute(name, value);
}

// src/player/ui/toggle-button/use-toggle-button.ts
function useToggleButton(host, { $props: { $pressed, $disabled }, ...props }) {
  host.setAttributes({
    disabled: $disabled,
    "data-pressed": $pressed,
    "aria-pressed": () => std.ariaBool($pressed()),
    "data-media-button": true
  });
  useFocusVisible(host.$el);
  element.onAttach(() => {
    setAttributeIfEmpty(host.el, "tabindex", "0");
    setAttributeIfEmpty(host.el, "role", "button");
  });
  maverick_js.effect(() => {
    const target = host.$el();
    if (!target)
      return;
    const clickEvents = ["pointerup", "keydown"];
    for (const eventType of clickEvents)
      std.listenEvent(target, eventType, onPress);
  });
  function onPress(event) {
    var _a;
    const disabled = $disabled();
    if (disabled || std.isKeyboardEvent(event) && !std.isKeyboardClick(event)) {
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

// src/player/ui/toggle-button/element.ts
var ToggleButtonDefinition = element.defineCustomElement({
  tagName: "media-toggle-button",
  props: toggleButtonProps,
  setup({ host, props }) {
    const $pressed = maverick_js.signal(props.$defaultPressed()), toggle = useToggleButton(host, {
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

// src/define/media-toggle-button.ts
element.registerLiteCustomElement(ToggleButtonDefinition);
