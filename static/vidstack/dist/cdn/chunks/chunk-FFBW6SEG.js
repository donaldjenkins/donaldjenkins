import { isArray, onDispose, getCustomElementInstance, isUndefined } from './chunk-GKRV3IQ4.js';

// ../../node_modules/.pnpm/maverick.js@0.33.1/node_modules/maverick.js/dist/dev/chunks/chunk-SSRY32NA.js
function isDOMNode(node) {
  return node instanceof Node;
}
function isDOMElement(node) {
  return isDOMNode(node) && node.nodeType === 1;
}
function isDOMFragment(node) {
  return isDOMNode(node) && node.nodeType === 11;
}
function createFragment() {
  return document.createDocumentFragment();
}
function createComment(data) {
  return document.createComment(data);
}
function setAttribute(host, name, value) {
  if (!value && value !== "" && value !== 0) {
    host.removeAttribute(name);
  } else {
    const attrValue = value + "";
    if (host.getAttribute(name) !== attrValue) {
      host.setAttribute(name, attrValue);
    }
  }
}
function setStyle(host, property, value) {
  if (!value && value !== 0) {
    host.style.removeProperty(property);
  } else {
    host.style.setProperty(property, value + "");
  }
}
function toggleClass(host, name, value) {
  host.classList[value ? "add" : "remove"](name);
}
function getSlottedChildren(el, name) {
  const selector = name ? `slot[name="${name}"]` : "slot:not([name])";
  const slot = el.shadowRoot?.querySelector(selector);
  const childNodes = slot?.assignedNodes({ flatten: true }) ?? [];
  return Array.prototype.filter.call(childNodes, (node) => node.nodeType == 1);
}
function attachDeclarativeShadowDOM(element) {
  const template = element.firstChild;
  const mode = template.getAttribute("shadowroot");
  const shadowRoot = template.parentNode.attachShadow({ mode });
  shadowRoot.appendChild(template.content);
  template.remove();
}
function run(fn) {
  return fn();
}
function runAll(fns) {
  for (const fn of fns)
    fn();
}
function camelToKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function camelToTitleCase(str) {
  return uppercaseFirstChar(str.replace(/([A-Z])/g, " $1"));
}
function kebabToCamelCase(str) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}
function kebabToPascalCase(str) {
  return kebabToTitleCase(str).replace(/\s/g, "");
}
function kebabToTitleCase(str) {
  return uppercaseFirstChar(str.replace(/-./g, (x) => " " + x[1].toUpperCase()));
}
function uppercaseFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function lowercaseFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
var trailingSemicolon = /;\s*$/;
function trimTrailingSemicolon(text) {
  return text.replace(trailingSemicolon, "");
}
function flattenArray(array) {
  const flat = [];
  for (let i = 0; i < array.length; i++) {
    if (isArray(array[i])) {
      flat.push(...flattenArray(array[i]));
    } else if (array[i] || array[i] === 0) {
      flat.push(array[i]);
    }
  }
  return flat;
}
var EVENT = Event;
var DOM_EVENT = Symbol("DOM_EVENT");
var _a;
var DOMEvent = class extends EVENT {
  constructor(type, ...init) {
    super(type, init[0]);
    this[_a] = true;
    this.detail = init[0]?.detail;
    this.trigger = init[0]?.trigger;
  }
  /**
   * Walks up the event chain (following each `trigger`) and returns the origin event
   * that started the chain.
   */
  get originEvent() {
    return getOriginEvent(this) ?? this;
  }
  /**
   * Walks up the event chain (following each `trigger`) and determines whether the initial
   * event was triggered by the end user (ie: check whether `isTrusted` on the `originEvent` `true`).
   */
  get isOriginTrusted() {
    return getOriginEvent(this)?.isTrusted ?? false;
  }
};
_a = DOM_EVENT;
function createEvent(target, event, ...init) {
  return new DOMEvent(event, init[0]);
}
function dispatchEvent(target, event, ...init) {
  return target ? target.dispatchEvent(new DOMEvent(event, init[0])) : false;
}
function isDOMEvent(event) {
  return !!event?.[DOM_EVENT];
}
function getOriginEvent(event) {
  let trigger = event.trigger;
  while (trigger && trigger.trigger) {
    trigger = trigger.trigger;
  }
  return trigger;
}
function walkTriggerEventChain(event, callback) {
  if (!isDOMEvent(event))
    return;
  let trigger = event.trigger;
  while (trigger) {
    const returnValue = callback(trigger);
    if (returnValue)
      return [trigger, returnValue];
    trigger = trigger.trigger;
  }
  return;
}
function findTriggerEvent(event, type) {
  return walkTriggerEventChain(event, (e) => e.type === type)?.[0];
}
function hasTriggerEvent(event, type) {
  return !!findTriggerEvent(event, type);
}
function appendTriggerEvent(event, trigger) {
  const origin = getOriginEvent(event) ?? event;
  if (origin === trigger) {
    throw Error(
      "[maverick] attemping to append event as a trigger on itself (cyclic)"
    );
  }
  if (typeof origin.trigger !== "undefined") {
    console.warn(
      `[maverick] overwriting existing trigger event: \`${origin.trigger.type}\` -> \`${trigger?.type}\`

`,
      "Event:\n",
      event,
      "Origin Event:\n",
      origin,
      "Trigger Event:\n",
      trigger
    );
  }
  Object.defineProperty(origin, "trigger", {
    configurable: true,
    enumerable: true,
    get: () => trigger
  });
}
var EventsTarget = class extends EventTarget {
  addEventListener(type, callback, options) {
    return super.addEventListener(type, callback, options);
  }
  removeEventListener(type, callback, options) {
    return super.removeEventListener(type, callback, options);
  }
};
function listenEvent(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return onDispose(() => target.removeEventListener(type, handler, options));
}
function isPointerEvent(event) {
  return !!event?.type.startsWith("pointer");
}
function isTouchEvent(event) {
  return !!event?.type.startsWith("touch");
}
function isMouseEvent(event) {
  return /^(click|mouse)/.test(event?.type ?? "");
}
function isKeyboardEvent(event) {
  return !!event?.type.startsWith("key");
}
function wasEnterKeyPressed(event) {
  return isKeyboardEvent(event) && event.key === "Enter";
}
function wasEscapeKeyPressed(event) {
  return isKeyboardEvent(event) && event.key === "Escape";
}
function isKeyboardClick(event) {
  return isKeyboardEvent(event) && (event.key === "Enter" || event.key === " ");
}

// ../../node_modules/.pnpm/maverick.js@0.33.1/node_modules/maverick.js/dist/dev/std.js
function ariaBool(value) {
  return value ? "true" : "false";
}
function createDisposalBin() {
  const disposal = /* @__PURE__ */ new Set();
  return {
    add(...callbacks) {
      for (const callback of callbacks)
        disposal.add(callback);
    },
    empty() {
      for (const callback of disposal)
        callback();
      disposal.clear();
    }
  };
}
function useDisposalBin() {
  const disposal = createDisposalBin();
  onDispose(disposal.empty);
  return disposal;
}
function useHostConnected() {
  const instance = getCustomElementInstance();
  if (!instance) {
    throw Error(
      "[maverick] called `useHostConnected` outside of root or setup function"
    );
  }
  return () => instance.host.$connected();
}
function keysOf(obj) {
  return Object.keys(obj);
}
function mergeProperties(...sources) {
  const target = {};
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    if (source) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    }
  }
  return target;
}
function pick(source, props) {
  const target = {};
  for (const prop of props) {
    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
  }
  return target;
}
function omit(source, props) {
  return pick(
    source,
    keysOf(source).filter((key) => !props.includes(key))
  );
}
function deferredPromise() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function timedPromise(promise, timeout, timeoutMsg) {
  const timer = new Promise((_, reject) => {
    const timerId = setTimeout(() => {
      clearTimeout(timerId);
      reject(timeoutMsg);
    }, timeout);
  });
  return Promise.race([promise, timer]);
}
function waitTimeout(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
function waitAnimationFrame(callback) {
  return new Promise((resolve) => {
    window.requestAnimationFrame((time) => {
      callback?.(time);
      resolve();
    });
  });
}
function animationFrameThrottle(func) {
  let id;
  const pending = () => !isUndefined(id);
  const cancel = () => {
    if (isUndefined(id))
      return;
    window.cancelAnimationFrame(id);
    id = void 0;
  };
  function throttled(...args) {
    if (pending())
      return;
    id = window.requestAnimationFrame(() => {
      func.apply(this, args);
      id = void 0;
    });
  }
  throttled.cancel = cancel;
  throttled.pending = pending;
  return throttled;
}
var requestIdleCallback = "requestIdleCallback" in window ? window.requestIdleCallback : (cb) => window.requestAnimationFrame(cb);
function waitIdlePeriod(callback, options) {
  return new Promise((resolve) => {
    requestIdleCallback((deadline) => {
      callback?.(deadline);
      resolve();
    }, options);
  });
}

export { DOMEvent, EventsTarget, animationFrameThrottle, appendTriggerEvent, ariaBool, attachDeclarativeShadowDOM, camelToKebabCase, camelToTitleCase, createComment, createDisposalBin, createEvent, createFragment, deferredPromise, dispatchEvent, findTriggerEvent, flattenArray, getOriginEvent, getSlottedChildren, hasTriggerEvent, isDOMElement, isDOMEvent, isDOMFragment, isDOMNode, isKeyboardClick, isKeyboardEvent, isMouseEvent, isPointerEvent, isTouchEvent, kebabToCamelCase, kebabToPascalCase, kebabToTitleCase, keysOf, listenEvent, lowercaseFirstLetter, mergeProperties, omit, pick, run, runAll, setAttribute, setStyle, timedPromise, toggleClass, trimTrailingSemicolon, uppercaseFirstChar, useDisposalBin, useHostConnected, waitAnimationFrame, waitIdlePeriod, waitTimeout, walkTriggerEventChain, wasEnterKeyPressed, wasEscapeKeyPressed };
