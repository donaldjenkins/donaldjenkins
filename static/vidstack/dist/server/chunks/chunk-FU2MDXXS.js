import { signal, effect } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { listenEvent, setAttribute } from 'maverick.js/std';

// src/foundation/observers/use-focus-visible.ts
var $keyboard = signal(false);
function useFocusVisible($target) {
  const $focused = signal(false);
  onConnect(() => {
    const target = $target();
    effect(() => {
      if (!$keyboard()) {
        $focused.set(false);
        updateFocusAttr(target, false);
        listenEvent(target, "pointerenter", () => updateHoverAttr(target, true));
        listenEvent(target, "pointerleave", () => updateHoverAttr(target, false));
        return;
      }
      const active = document.activeElement === target;
      $focused.set(active);
      updateFocusAttr(target, active);
      listenEvent(target, "focus", () => {
        $focused.set(true);
        updateFocusAttr(target, true);
      });
      listenEvent(target, "blur", () => {
        $focused.set(false);
        updateFocusAttr(target, false);
      });
    });
  });
  return $focused;
}
function updateFocusAttr(target, isFocused) {
  setAttribute(target, "data-focus", isFocused);
  setAttribute(target, "data-hocus", isFocused);
}
function updateHoverAttr(target, isHovering) {
  setAttribute(target, "data-hocus", isHovering);
}

export { useFocusVisible };
