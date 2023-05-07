'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var std = require('maverick.js/std');
var mediaIcons = require('media-icons');
var maverick_js = require('maverick.js');

// src/define/media-play-button.ts
var $$_templ = ['<!$><svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-media-icon="true"', ">", "</svg>"];
function Icon({ slot, paths }) {
  return ssr.$$_ssr($$_templ, ssr.$$_attr("slot", slot), ssr.$$_inject_html(paths));
}
function setAttributeIfEmpty(target, name, value) {
  if (!target.hasAttribute(name))
    target.setAttribute(name, value);
}
function setARIALabel(target, label) {
  if (target.hasAttribute("aria-label") || target.hasAttribute("aria-describedby"))
    return;
  function updateAriaDescription() {
    std.setAttribute(target, "aria-label", label());
  }
  updateAriaDescription();
}
var mediaContext = maverick_js.createContext();
function useMedia() {
  return maverick_js.useContext(mediaContext);
}

// src/player/element/keyboard.ts
function useARIAKeyShortcuts(host, shortcut) {
  element.onAttach(() => {
    const { $keyShortcuts, ariaKeys } = useMedia(), keys = host.el.getAttribute("aria-keyshortcuts");
    if (keys) {
      ariaKeys[shortcut] = keys;
      return;
    }
    const shortcuts = $keyShortcuts()[shortcut];
    if (shortcuts)
      host.el.setAttribute("aria-keyshortcuts", shortcuts);
  });
}

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

// src/player/ui/play-button/element.tsx
var PlayButtonDefinition = element.defineCustomElement({
  tagName: "media-play-button",
  props: toggleButtonProps,
  setup({ host, props: { $disabled, $defaultAppearance } }) {
    const { $store: $media, remote } = useMedia(), $pressed = () => !$media.paused, toggle = useToggleButton(host, {
      $props: { $pressed, $disabled },
      onPress
    });
    useARIAKeyShortcuts(host, "togglePaused");
    element.onAttach(() => {
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
    return std.mergeProperties(toggle, {
      $render: () => {
        return [
          ssr.$$_create_component(Icon, { paths: mediaIcons.playPaths, slot: "play" }),
          ssr.$$_create_component(Icon, { paths: mediaIcons.replayPaths, slot: "replay" }),
          ssr.$$_create_component(Icon, { paths: mediaIcons.pausePaths, slot: "pause" })
        ];
      }
    });
  }
});

// src/define/media-play-button.ts
element.registerLiteCustomElement(PlayButtonDefinition);
