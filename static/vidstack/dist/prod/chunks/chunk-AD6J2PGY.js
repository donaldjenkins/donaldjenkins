import { sliderValueFormattersContext } from './chunk-TW2KE7QB.js';
import { sliderStoreContext } from './chunk-J5ZUXZE6.js';
import { IS_SAFARI } from './chunk-KKTONNDY.js';
import { round, clampNumber, getNumberOfDecimalPlaces } from './chunk-CVLY5S52.js';
import { setAttributeIfEmpty } from './chunk-25YO7G2G.js';
import { useFocusVisible } from './chunk-YQSJJLRL.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { $$_next_template, $$_create_template } from 'maverick.js/dom';
import { provideContext, getScope, useContext, effect, peek, scoped } from 'maverick.js';
import { onAttach } from 'maverick.js/element';
import { ariaBool, setStyle, mergeProperties, noop, listenEvent, dispatchEvent, createEvent, isDOMEvent, isKeyboardEvent } from 'maverick.js/std';

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
  effect(() => {
    const target = host.$el();
    if (!target || $disabled())
      return;
    listenEvent(target, "focus", onFocus);
    listenEvent(target, "pointerenter", onPointerEnter);
    listenEvent(target, "pointermove", onPointerMove);
    listenEvent(target, "pointerleave", onPointerLeave);
    listenEvent(target, "pointerdown", onPointerDown);
    listenEvent(target, "keydown", onKeyDown);
    listenEvent(target, "keyup", onKeyUp);
  });
  effect(() => {
    if ($disabled() || !$store.dragging)
      return;
    listenEvent(document, "pointerup", onDocumentPointerUp);
    listenEvent(document, "pointermove", onDocumentPointerMove);
    if (IS_SAFARI)
      listenEvent(document, "touchmove", onDocumentTouchMove, { passive: false });
  });
  function onFocus() {
    updatePointerValue($store.value);
  }
  function updateValue(value, trigger) {
    $store.value = Math.max($store.min, Math.min(value, $store.max));
    const event = createEvent(host.el, "value-change", { detail: $store.value, trigger });
    host.el?.dispatchEvent(event);
    onValueChange?.(event);
    if ($store.dragging) {
      const event2 = createEvent(host.el, "drag-value-change", { detail: value, trigger });
      host.el?.dispatchEvent(event2);
      onDragValueChange?.(event2);
    }
  }
  function updatePointerValue(value, trigger) {
    $store.pointerValue = Math.max($store.min, Math.min(value, $store.max));
    dispatchEvent(host.el, "pointer-value-change", { detail: value, trigger });
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
    if ($store.dragging)
      return;
    $store.dragging = true;
    const dragStartEvent = createEvent(host.el, "drag-start", { detail: value, trigger });
    host.el?.dispatchEvent(dragStartEvent);
    onDragStart?.(dragStartEvent);
  }
  function onStopDragging(value, trigger) {
    if (!$store.dragging)
      return;
    $store.dragging = false;
    remote.resumeUserIdle(trigger);
    const dragEndEvent = createEvent(host.el, "drag-start", { detail: value, trigger });
    host.el?.dispatchEvent(dragEndEvent);
    onDragEnd?.(dragEndEvent);
  }
  let lastDownKey;
  function onKeyDown(event) {
    if (isDOMEvent(event)) {
      const trigger = event.trigger;
      if (isKeyboardEvent(trigger))
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
    if (isDOMEvent(event)) {
      const trigger = event.trigger;
      if (isKeyboardEvent(trigger))
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
  function onDocumentTouchMove(event) {
    event.preventDefault();
  }
  function onDocumentPointerMove(event) {
    updatePointerValue(getPointerValue(event), event);
  }
}

// src/player/ui/slider/create.tsx
var $$_templ = /* @__PURE__ */ $$_create_template(`<!$><div part="track"></div>`);
var $$_templ_2 = /* @__PURE__ */ $$_create_template(`<!$><div part="track track-fill"></div>`);
var $$_templ_3 = /* @__PURE__ */ $$_create_template(`<!$><div part="track track-progress"></div>`);
var $$_templ_4 = /* @__PURE__ */ $$_create_template(`<!$><div part="thumb-container"><div part="thumb"></div></div>`);
function createSlider(host, { $props, readonly, aria, ...callbacks }, accessors) {
  provideContext(sliderStoreContext);
  provideContext(sliderValueFormattersContext);
  const scope = getScope(), $store = useContext(sliderStoreContext), $focused = useFocusVisible(host.$el), { $disabled, $min, $max, $value, $step } = $props;
  host.setAttributes({
    disabled: $disabled,
    "data-dragging": () => $store.dragging,
    "data-pointing": () => $store.pointing,
    "data-interactive": () => $store.interactive,
    "aria-disabled": () => ariaBool($disabled()),
    "aria-valuemin": aria?.valueMin ?? (() => $store.min),
    "aria-valuemax": aria?.valueMax ?? (() => $store.max),
    "aria-valuenow": aria?.valueNow ?? (() => Math.round($store.value)),
    "aria-valuetext": aria?.valueText ?? (() => round($store.value / $store.max * 100, 2) + "%"),
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
  onAttach(() => {
    setAttributeIfEmpty(host.el, "role", "slider");
    setAttributeIfEmpty(host.el, "tabindex", "0");
    setAttributeIfEmpty(host.el, "aria-orientation", "horizontal");
    setAttributeIfEmpty(host.el, "autocomplete", "off");
  });
  effect(() => {
    $store.focused = $focused();
  });
  effect(() => {
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
      setStyle(preview, name, styles[name]);
    }
    function onPreviewResize() {
      const rect2 = preview.getBoundingClientRect();
      setStyle(preview, "--computed-width", rect2.width + "px");
      setStyle(preview, "--computed-height", rect2.height + "px");
    }
    window.requestAnimationFrame(onPreviewResize);
    const observer = new ResizeObserver(onPreviewResize);
    observer.observe(preview);
    return () => observer.disconnect();
  });
  if (!readonly) {
    effect(() => {
      $store.min = $min();
      $store.max = $max();
    });
    effect(() => {
      if (peek(() => $store.dragging))
        return;
      $store.value = getClampedValue($store.min, $store.max, $value(), $step());
    });
  }
  effect(() => {
    if (!$disabled())
      return;
    $store.dragging = false;
    $store.pointing = false;
  });
  return {
    $store,
    members: mergeProperties(
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
          set: noop
        }),
        subscribe: (callback) => scoped(() => effect(() => callback($store)), scope),
        $render: () => {
          return [$$_next_template($$_templ), $$_next_template($$_templ_2), $$_next_template($$_templ_3), $$_next_template($$_templ_4)];
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

export { createSlider, sliderProps };
