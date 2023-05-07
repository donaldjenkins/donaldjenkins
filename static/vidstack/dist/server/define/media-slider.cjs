'use strict';

var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');
var maverick_js = require('maverick.js');
var std = require('maverick.js/std');

// src/define/media-slider.ts
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

// src/utils/number.ts
function round(num, decimalPlaces = 2) {
  return Number(num.toFixed(decimalPlaces));
}
function getNumberOfDecimalPlaces(num) {
  var _a;
  return ((_a = String(num).split(".")[1]) == null ? void 0 : _a.length) ?? 0;
}
function clampNumber(min, value, max) {
  return Math.max(min, Math.min(max, value));
}
var sliderValueFormattersContext = maverick_js.createContext(() => ({}));
var sliderStore = maverick_js.createStore({
  min: 0,
  max: 100,
  value: 50,
  pointerValue: 0,
  focused: false,
  dragging: false,
  pointing: false,
  get interactive() {
    return this.dragging || this.focused || this.pointing;
  },
  get fillRate() {
    return calcRate(this.min, this.max, this.value);
  },
  get fillPercent() {
    return this.fillRate * 100;
  },
  get pointerRate() {
    return calcRate(this.min, this.max, this.pointerValue);
  },
  get pointerPercent() {
    return this.pointerRate * 100;
  }
});
function calcRate(min, max, value) {
  const range = max - min, offset = value - min;
  return range > 0 ? offset / range : 0;
}
var sliderStoreContext = maverick_js.createContext(() => sliderStore.create());
var mediaContext = maverick_js.createContext();
function useMedia() {
  return maverick_js.useContext(mediaContext);
}

// src/player/ui/slider/utils.ts
function getClampedValue(min, max, value, step) {
  return clampNumber(min, round(value, getNumberOfDecimalPlaces(step)), max);
}
function getValueFromRate(min, max, rate, step) {
  const boundRate = clampNumber(0, rate, 1);
  const range = max - min;
  const fill = range * boundRate;
  const stepRatio = Math.round(fill / step);
  const steps = step * stepRatio;
  return min + steps;
}

// src/player/ui/slider/use-events.ts
var SliderKeyDirection = {
  Left: -1,
  ArrowLeft: -1,
  Up: 1,
  ArrowUp: 1,
  Right: 1,
  ArrowRight: 1,
  Down: -1,
  ArrowDown: -1
};
function useSliderEvents(host, { $disabled, $step, $keyStep, $shiftKeyMultiplier }, { onValueChange, onDragStart, onDragValueChange, onDragEnd }, $store) {
  const remote = useMedia().remote;
  maverick_js.effect(() => {
    const target = host.$el();
    if (!target || $disabled())
      return;
    std.listenEvent(target, "focus", onFocus);
    std.listenEvent(target, "pointerenter", onPointerEnter);
    std.listenEvent(target, "pointermove", onPointerMove);
    std.listenEvent(target, "pointerleave", onPointerLeave);
    std.listenEvent(target, "pointerdown", onPointerDown);
    std.listenEvent(target, "keydown", onKeyDown);
    std.listenEvent(target, "keyup", onKeyUp);
  });
  maverick_js.effect(() => {
    if ($disabled() || !$store.dragging)
      return;
    std.listenEvent(document, "pointerup", onDocumentPointerUp);
    std.listenEvent(document, "pointermove", onDocumentPointerMove);
  });
  function onFocus() {
    updatePointerValue($store.value);
  }
  function updateValue(value, trigger) {
    var _a, _b;
    $store.value = Math.max($store.min, Math.min(value, $store.max));
    const event = std.createEvent(host.el, "value-change", { detail: $store.value, trigger });
    (_a = host.el) == null ? void 0 : _a.dispatchEvent(event);
    onValueChange == null ? void 0 : onValueChange(event);
    if ($store.dragging) {
      const event2 = std.createEvent(host.el, "drag-value-change", { detail: value, trigger });
      (_b = host.el) == null ? void 0 : _b.dispatchEvent(event2);
      onDragValueChange == null ? void 0 : onDragValueChange(event2);
    }
  }
  function updatePointerValue(value, trigger) {
    $store.pointerValue = Math.max($store.min, Math.min(value, $store.max));
    std.dispatchEvent(host.el, "pointer-value-change", { detail: value, trigger });
    if ($store.dragging)
      updateValue(value, trigger);
  }
  function getPointerValue(event) {
    const thumbClientX = event.clientX;
    const { left: trackLeft, width: trackWidth } = host.el.getBoundingClientRect();
    const thumbPositionRate = (thumbClientX - trackLeft) / trackWidth;
    return getValueFromRate($store.min, $store.max, thumbPositionRate, $step());
  }
  function onPointerEnter() {
    $store.pointing = true;
  }
  function onPointerMove(event) {
    if ($store.dragging)
      return;
    updatePointerValue(getPointerValue(event), event);
  }
  function onPointerLeave(event) {
    $store.pointing = false;
  }
  function onPointerDown(event) {
    const value = getPointerValue(event);
    onStartDragging(value, event);
    updatePointerValue(value, event);
  }
  function onStartDragging(value, trigger) {
    var _a;
    if ($store.dragging)
      return;
    $store.dragging = true;
    const dragStartEvent = std.createEvent(host.el, "drag-start", { detail: value, trigger });
    (_a = host.el) == null ? void 0 : _a.dispatchEvent(dragStartEvent);
    onDragStart == null ? void 0 : onDragStart(dragStartEvent);
  }
  function onStopDragging(value, trigger) {
    var _a;
    if (!$store.dragging)
      return;
    $store.dragging = false;
    remote.resumeUserIdle(trigger);
    const dragEndEvent = std.createEvent(host.el, "drag-start", { detail: value, trigger });
    (_a = host.el) == null ? void 0 : _a.dispatchEvent(dragEndEvent);
    onDragEnd == null ? void 0 : onDragEnd(dragEndEvent);
  }
  let lastDownKey;
  function onKeyDown(event) {
    if (std.isDOMEvent(event)) {
      const trigger = event.trigger;
      if (std.isKeyboardEvent(trigger))
        event = trigger;
      else
        return;
    }
    const { key } = event;
    if (key === "Home" || key === "PageUp") {
      updatePointerValue($store.min, event);
      updateValue($store.min, event);
      return;
    } else if (key === "End" || key === "PageDown") {
      updatePointerValue($store.max, event);
      updateValue($store.max, event);
      return;
    } else if (/[0-9]/.test(key)) {
      const value2 = ($store.max - $store.min) / 10 * Number(key);
      updatePointerValue(value2, event);
      updateValue(value2, event);
      return;
    }
    const value = getKeyValue(event);
    if (!value)
      return;
    const repeat = key === lastDownKey;
    if (!$store.dragging && repeat)
      onStartDragging(value, event);
    updatePointerValue(value, event);
    if (!repeat)
      updateValue(value, event);
    lastDownKey = key;
  }
  function onKeyUp(event) {
    if (std.isDOMEvent(event)) {
      const trigger = event.trigger;
      if (std.isKeyboardEvent(trigger))
        event = trigger;
      else
        return;
    }
    lastDownKey = "";
    if (!$store.dragging)
      return;
    const value = getKeyValue(event) ?? $store.value;
    updatePointerValue(value);
    onStopDragging(value, event);
  }
  function getKeyValue(event) {
    const { key, shiftKey } = event, isValidKey = Object.keys(SliderKeyDirection).includes(key);
    if (!isValidKey)
      return;
    const modifiedStep = !shiftKey ? $keyStep() : $keyStep() * $shiftKeyMultiplier(), direction = Number(SliderKeyDirection[key]), diff = modifiedStep * direction, steps = ($store.value + diff) / $step();
    return Number(($step() * steps).toFixed(3));
  }
  function onDocumentPointerUp(event) {
    const value = getPointerValue(event);
    updatePointerValue(value, event);
    onStopDragging(value, event);
  }
  function onDocumentPointerMove(event) {
    updatePointerValue(getPointerValue(event), event);
  }
}

// src/player/ui/slider/create.tsx
var $$_templ = ['<!$><div part="track"></div>'];
var $$_templ_2 = ['<!$><div part="track track-fill"></div>'];
var $$_templ_3 = ['<!$><div part="track track-progress"></div>'];
var $$_templ_4 = ['<!$><div part="thumb-container"><div part="thumb"></div></div>'];
function createSlider(host, { $props, readonly, aria, ...callbacks }, accessors) {
  maverick_js.provideContext(sliderStoreContext);
  maverick_js.provideContext(sliderValueFormattersContext);
  const scope = maverick_js.getScope(), $store = maverick_js.useContext(sliderStoreContext), $focused = useFocusVisible(host.$el), { $disabled, $min, $max, $value, $step } = $props;
  host.setAttributes({
    disabled: $disabled,
    "data-dragging": () => $store.dragging,
    "data-pointing": () => $store.pointing,
    "data-interactive": () => $store.interactive,
    "aria-disabled": () => std.ariaBool($disabled()),
    "aria-valuemin": (aria == null ? void 0 : aria.valueMin) ?? (() => $store.min),
    "aria-valuemax": (aria == null ? void 0 : aria.valueMax) ?? (() => $store.max),
    "aria-valuenow": (aria == null ? void 0 : aria.valueNow) ?? (() => Math.round($store.value)),
    "aria-valuetext": (aria == null ? void 0 : aria.valueText) ?? (() => round($store.value / $store.max * 100, 2) + "%"),
    "data-media-slider": true
  });
  host.setCSSVars({
    "--slider-fill-rate": () => $store.fillRate,
    "--slider-fill-value": () => $store.value,
    "--slider-fill-percent": () => $store.fillPercent + "%",
    "--slider-pointer-rate": () => $store.pointerRate,
    "--slider-pointer-value": () => $store.pointerValue,
    "--slider-pointer-percent": () => $store.pointerPercent + "%"
  });
  useSliderEvents(host, $props, callbacks, $store);
  element.onAttach(() => {
    setAttributeIfEmpty(host.el, "role", "slider");
    setAttributeIfEmpty(host.el, "tabindex", "0");
    setAttributeIfEmpty(host.el, "aria-orientation", "horizontal");
    setAttributeIfEmpty(host.el, "autocomplete", "off");
  });
  maverick_js.effect(() => {
    $store.focused = $focused();
  });
  maverick_js.effect(() => {
    const target = host.$el();
    if (!target || $disabled())
      return;
    const preview = target.querySelector('[slot="preview"]');
    if (!preview)
      return;
    const rect = preview.getBoundingClientRect();
    const styles = {
      "--computed-width": rect.width + "px",
      "--computed-height": rect.height + "px",
      "--preview-top": "calc(-1 * var(--media-slider-preview-gap, calc(var(--preview-height) - 2px)))",
      "--preview-width": "var(--media-slider-preview-width, var(--computed-width))",
      "--preview-height": "var(--media-slider-preview-height, var(--computed-height))",
      "--preview-width-half": "calc(var(--preview-width) / 2)",
      "--preview-left-clamp": "max(var(--preview-width-half), var(--slider-pointer-percent))",
      "--preview-right-clamp": "calc(100% - var(--preview-width-half))",
      "--preview-left": "min(var(--preview-left-clamp), var(--preview-right-clamp))"
    };
    for (const name of Object.keys(styles)) {
      std.setStyle(preview, name, styles[name]);
    }
    function onPreviewResize() {
      const rect2 = preview.getBoundingClientRect();
      std.setStyle(preview, "--computed-width", rect2.width + "px");
      std.setStyle(preview, "--computed-height", rect2.height + "px");
    }
    window.requestAnimationFrame(onPreviewResize);
    const observer = new ResizeObserver(onPreviewResize);
    observer.observe(preview);
    return () => observer.disconnect();
  });
  if (!readonly) {
    maverick_js.effect(() => {
      $store.min = $min();
      $store.max = $max();
    });
    maverick_js.effect(() => {
      if (maverick_js.peek(() => $store.dragging))
        return;
      $store.value = getClampedValue($store.min, $store.max, $value(), $step());
    });
  }
  maverick_js.effect(() => {
    if (!$disabled())
      return;
    $store.dragging = false;
    $store.pointing = false;
  });
  return {
    $store,
    members: std.mergeProperties(
      accessors(),
      {
        get value() {
          return $store.value;
        },
        set value(value) {
          $store.value = value;
        },
        get $store() {
          return $store;
        },
        state: new Proxy($store, {
          // @ts-expect-error
          set: std.noop
        }),
        subscribe: (callback) => maverick_js.scoped(() => maverick_js.effect(() => callback($store)), scope),
        $render: () => {
          return [ssr.$$_ssr($$_templ), ssr.$$_ssr($$_templ_2), ssr.$$_ssr($$_templ_3), ssr.$$_ssr($$_templ_4)];
        }
      },
      {}
    )
  };
}

// src/player/ui/slider/props.ts
var sliderProps = {
  min: { initial: 0 },
  max: { initial: 100 },
  disabled: { initial: false, type: { from: false } },
  value: { initial: 100 },
  step: { initial: 1 },
  keyStep: { initial: 1 },
  shiftKeyMultiplier: { initial: 5 }
};

// src/player/ui/slider/element.ts
var SliderDefinition = element.defineCustomElement({
  tagName: "media-slider",
  props: sliderProps,
  setup({ host, props, accessors }) {
    const { members } = createSlider(host, { $props: props }, accessors);
    return members;
  }
});

// src/define/media-slider.ts
element.registerLiteCustomElement(SliderDefinition);
