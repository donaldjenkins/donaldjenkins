'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var std = require('maverick.js/std');
var mediaIcons = require('media-icons');
var maverick_js = require('maverick.js');

// src/define/media-seek-button.ts
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

// src/player/ui/seek-button/element.tsx
var SeekButtonDefinition = element.defineCustomElement({
  tagName: "media-seek-button",
  props: { seconds: { initial: 30 }, defaultAppearance: { initial: false } },
  setup({ host, props: { $seconds, $defaultAppearance } }) {
    const { $store: $media, remote } = useMedia();
    useFocusVisible(host.$el);
    element.onAttach(() => {
      setAttributeIfEmpty(host.el, "tabindex", "0");
      setAttributeIfEmpty(host.el, "role", "button");
      setARIALabel(
        host.el,
        () => `Seek ${$seconds() > 0 ? "forward" : "backward"} ${$seconds()} seconds`
      );
      const clickEvents = ["pointerup", "keydown"];
      for (const eventType of clickEvents)
        std.listenEvent(host.el, eventType, onPress);
    });
    host.setAttributes({
      seconds: $seconds,
      "data-media-button": true,
      "default-appearance": $defaultAppearance,
      "data-hidden": () => !$media.canSeek
    });
    function onPress(event) {
      if (std.isKeyboardEvent(event) && !std.isKeyboardClick(event))
        return;
      remote.seek($media.currentTime + $seconds(), event);
    }
    return () => [
      ssr.$$_create_component(Icon, { paths: mediaIcons.seekBackwardPaths, slot: "backward" }),
      ssr.$$_create_component(Icon, { paths: mediaIcons.seekForwardPaths, slot: "forward" })
    ];
  }
});

// src/define/media-seek-button.ts
element.registerLiteCustomElement(SeekButtonDefinition);
