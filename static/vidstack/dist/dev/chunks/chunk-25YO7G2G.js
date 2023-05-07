import { effect } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

// src/utils/dom.ts
function setAttributeIfEmpty(target, name, value) {
  if (!target.hasAttribute(name))
    target.setAttribute(name, value);
}
function setARIALabel(target, label) {
  if (target.hasAttribute("aria-label") || target.hasAttribute("aria-describedby"))
    return;
  function updateAriaDescription() {
    setAttribute(target, "aria-label", label());
  }
  effect(updateAriaDescription);
}

export { setARIALabel, setAttributeIfEmpty };
