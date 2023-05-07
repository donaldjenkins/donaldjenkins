'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var std = require('maverick.js/std');
var mediaIcons = require('media-icons');
var maverick_js = require('maverick.js');

// src/define/media-caption-button.ts
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
var captionRE = /captions|subtitles/;
function isTrackCaptionKind(track) {
  return captionRE.test(track.kind);
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
    var _a2;
    const disabled = $disabled();
    if (disabled || std.isKeyboardEvent(event) && !std.isKeyboardClick(event)) {
      if (disabled)
        event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    (_a2 = props.onPress) == null ? void 0 : _a2.call(props, event);
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

// src/player/ui/caption-button/element.tsx
var CaptionButtonDefinition = element.defineCustomElement({
  tagName: "media-caption-button",
  props: toggleButtonProps,
  setup({ host, props: { $disabled, $defaultAppearance }, accessors }) {
    const { $store: $media, remote } = useMedia(), $pressed = () => !!$media.textTrack, toggle = useToggleButton(host, {
      $props: { $pressed, $disabled },
      onPress
    });
    useARIAKeyShortcuts(host, "toggleCaptions");
    element.onAttach(() => {
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
    return std.mergeProperties(toggle, accessors(), {
      $render: () => {
        return [
          ssr.$$_create_component(Icon, { paths: mediaIcons.closedCaptionsOnPaths, slot: "on" }),
          ssr.$$_create_component(Icon, { paths: mediaIcons.closedCaptionsPaths, slot: "off" })
        ];
      }
    });
  }
});

// src/define/media-caption-button.ts
element.registerLiteCustomElement(CaptionButtonDefinition);
