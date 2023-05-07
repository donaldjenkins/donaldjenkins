'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var std = require('maverick.js/std');
var maverick_js = require('maverick.js');

// src/define/media-live-indicator.ts
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

// src/player/ui/live-indicator/element.tsx
var $$_templ = ['<!$><div part="container"><div part="text">LIVE</div></div>'];
var LiveIndicatorDefinition = element.defineCustomElement({
  tagName: "media-live-indicator",
  setup({ host }) {
    const { $store: $media, remote } = useMedia();
    useFocusVisible(host.$el);
    host.setAttributes({
      tabindex: () => $media.live ? 0 : null,
      role: () => $media.live ? "button" : null,
      "data-live": () => $media.live,
      "data-live-edge": () => $media.liveEdge,
      "data-media-button": true
    });
    element.onAttach(() => {
      setARIALabel(host.el, () => $media.live ? "Go live" : null);
      const clickEvents = ["pointerup", "keydown"];
      for (const eventType of clickEvents)
        std.listenEvent(host.el, eventType, onPress);
    });
    function onPress(event) {
      if ($media.liveEdge || std.isKeyboardEvent(event) && !std.isKeyboardClick(event))
        return;
      remote.seekToLiveEdge(event);
    }
    return () => ssr.$$_ssr($$_templ);
  }
});

// src/define/media-live-indicator.ts
element.registerLiteCustomElement(LiveIndicatorDefinition);
