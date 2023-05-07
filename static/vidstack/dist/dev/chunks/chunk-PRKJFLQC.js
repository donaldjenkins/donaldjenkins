import { HLS_PROVIDER } from './chunk-25M6M5V2.js';
import { AUDIO_PROVIDER } from './chunk-QTJNSLXI.js';
import { VIDEO_PROVIDER } from './chunk-2Q5ZIQUV.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { effect, signal, peek, onDispose } from 'maverick.js';
import { onAttach } from 'maverick.js/element';
import { listenEvent, DOMEvent, isKeyboardClick } from 'maverick.js/std';

// src/player/media/providers/type-check.ts
function isAudioProvider(provider) {
  return !!provider?.[AUDIO_PROVIDER];
}
function isVideoProvider(provider) {
  return !!provider?.[VIDEO_PROVIDER];
}
function isHLSProvider(provider) {
  return !!provider?.[HLS_PROVIDER];
}
function isHTMLAudioElement(element) {
  return element instanceof HTMLAudioElement;
}
function isHTMLVideoElement(element) {
  return element instanceof HTMLVideoElement;
}
function isHTMLMediaElement(element) {
  return isHTMLAudioElement(element) || isHTMLVideoElement(element);
}
var MEDIA_KEY_SHORTCUTS = {
  togglePaused: "k Space",
  toggleMuted: "m",
  toggleFullscreen: "f",
  togglePictureInPicture: "i",
  toggleCaptions: "c",
  seekBackward: "ArrowLeft",
  seekForward: "ArrowRight",
  volumeUp: "ArrowUp",
  volumeDown: "ArrowDown"
};
var MODIFIER_KEYS = /* @__PURE__ */ new Set(["Shift", "Alt", "Meta", "Control"]);
var BUTTON_SELECTORS = 'button, [role="button"]';
var IGNORE_SELECTORS = 'input, textarea, select, [contenteditable], [role^="menuitem"]';
function useKeyboard({ $player, $store: $media, ariaKeys, remote }, { $keyShortcuts, $keyDisabled, $keyTarget }) {
  effect(() => {
    const player = $player();
    if (!player || $keyDisabled())
      return;
    const target = $keyTarget() === "player" ? player : document, $active = signal(false);
    if (target === player) {
      listenEvent(player, "focusin", () => $active.set(true));
      listenEvent(player, "focusout", (event) => {
        if (!player.contains(event.target))
          $active.set(false);
      });
    } else {
      if (!peek($active)) {
        $active.set(document.querySelector("media-player") === player);
      }
      listenEvent(document, "focusin", (event) => {
        const activePlayer = event.composedPath().find((el) => el instanceof Element && el.localName === "media-player");
        if (activePlayer !== void 0)
          $active.set(player === activePlayer);
      });
    }
    function onPreventVideoKeys(event) {
      if (isHTMLMediaElement(event.target) && getMatchingMethod(event)) {
        event.preventDefault();
      }
    }
    effect(() => {
      if (!$active())
        return;
      listenEvent(target, "keyup", onKeyUp);
      listenEvent(target, "keydown", onKeyDown);
      listenEvent(target, "keydown", onPreventVideoKeys, { capture: true });
    });
    let seekTotal;
    function calcSeekAmount(event, type) {
      const seekBy = event.shiftKey ? 10 : 5;
      return seekTotal = Math.max(
        0,
        Math.min(
          (seekTotal ?? $media.currentTime) + (type === "seekForward" ? +seekBy : -seekBy),
          $media.duration
        )
      );
    }
    let timeSlider = null;
    function forwardTimeKeyEvent(event) {
      timeSlider?.dispatchEvent(new DOMEvent(event.type, { trigger: event }));
    }
    function seeking(event, type) {
      if (!$media.canSeek)
        return;
      if (!timeSlider)
        timeSlider = player.querySelector("media-time-slider");
      if (timeSlider) {
        forwardTimeKeyEvent(event);
      } else {
        remote.seeking(calcSeekAmount(event, type), event);
      }
    }
    function onKeyUp(event) {
      const focused = document.activeElement, sliderFocused = focused?.hasAttribute("data-media-slider");
      if (!event.key || !$media.canSeek || sliderFocused || focused?.matches(IGNORE_SELECTORS)) {
        return;
      }
      const method = getMatchingMethod(event);
      if (method?.startsWith("seek")) {
        event.preventDefault();
        event.stopPropagation();
        if (timeSlider) {
          forwardTimeKeyEvent(event);
          timeSlider = null;
        } else {
          remote.seek(seekTotal, event);
          seekTotal = null;
        }
      }
      if (method?.startsWith("volume")) {
        const volumeSlider = player.querySelector("media-volume-slider");
        volumeSlider?.dispatchEvent(new DOMEvent("keyup", { trigger: event }));
      }
    }
    function onKeyDown(event) {
      if (!event.key || MODIFIER_KEYS.has(event.key))
        return;
      const focused = document.activeElement;
      if (focused?.matches(IGNORE_SELECTORS) || isKeyboardClick(event) && focused?.matches(BUTTON_SELECTORS)) {
        return;
      }
      const sliderFocused = focused?.hasAttribute("data-media-slider"), method = getMatchingMethod(event);
      if (!method && /[0-9]/.test(event.key) && !sliderFocused) {
        event.preventDefault();
        event.stopPropagation();
        remote.seek($media.duration / 10 * Number(event.key), event);
        return;
      }
      if (!method || /volume|seek/.test(method) && sliderFocused)
        return;
      event.preventDefault();
      event.stopPropagation();
      switch (method) {
        case "seekForward":
        case "seekBackward":
          seeking(event, method);
          break;
        case "volumeUp":
        case "volumeDown":
          const volumeSlider = player.querySelector("media-volume-slider");
          if (volumeSlider) {
            volumeSlider.dispatchEvent(new DOMEvent("keydown", { trigger: event }));
          } else {
            const value = event.shiftKey ? 0.1 : 0.05;
            remote.changeVolume($media.volume + (method === "volumeUp" ? +value : -value), event);
          }
          break;
        case "toggleFullscreen":
          remote.toggleFullscreen("prefer-media", event);
          break;
        default:
          remote[method]?.(event);
      }
    }
    function getMatchingMethod(event) {
      const keyShortcuts = { ...$keyShortcuts(), ...ariaKeys };
      return Object.keys(keyShortcuts).find(
        (method) => keyShortcuts[method].split(" ").some(
          (keys) => replaceSymbolKeys(keys).replace(/Control/g, "Ctrl").split("+").every(
            (key) => MODIFIER_KEYS.has(key) ? event[key.toLowerCase() + "Key"] : event.key === key.replace("Space", " ")
          )
        )
      );
    }
  });
}
function useARIAKeyShortcuts(host, shortcut) {
  onAttach(() => {
    const { $keyShortcuts, ariaKeys } = useMedia(), keys = host.el.getAttribute("aria-keyshortcuts");
    if (keys) {
      ariaKeys[shortcut] = keys;
      {
        onDispose(() => {
          delete ariaKeys[shortcut];
        });
      }
      return;
    }
    const shortcuts = $keyShortcuts()[shortcut];
    if (shortcuts)
      host.el.setAttribute("aria-keyshortcuts", shortcuts);
  });
}
var SYMBOL_KEY_MAP = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
function replaceSymbolKeys(key) {
  return key.replace(/Shift\+(\d)/g, (_, num) => SYMBOL_KEY_MAP[num - 1]);
}

export { MEDIA_KEY_SHORTCUTS, isAudioProvider, isHLSProvider, isHTMLAudioElement, isHTMLMediaElement, isHTMLVideoElement, isVideoProvider, useARIAKeyShortcuts, useKeyboard };