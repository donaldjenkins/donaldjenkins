import { sliderProps, createSlider } from './chunk-L4CLTNDQ.js';
import { functionThrottle } from './chunk-JELAJF2G.js';
import { formatSpokenTime, formatTime } from './chunk-E6EPK3UH.js';
import { sliderValueFormattersContext } from './chunk-TW2KE7QB.js';
import { setAttributeIfEmpty } from './chunk-EWIZ7YX3.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { effect, peek, provideContext } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

// src/player/ui/time-slider/props.ts
var timeSliderProps = {
  ...sliderProps,
  min: { initial: 0, attribute: false },
  max: { initial: 0, attribute: false },
  value: { initial: 0, attribute: false },
  pauseWhileDragging: { initial: false },
  seekingRequestThrottle: { initial: 100 }
};

// src/player/ui/time-slider/element.tsx
var TimeSliderDefinition = defineCustomElement({
  tagName: "media-time-slider",
  props: timeSliderProps,
  setup({
    host,
    props: { $pauseWhileDragging, $seekingRequestThrottle, $disabled, ...props },
    accessors
  }) {
    const { $store: $media, remote } = useMedia(), { $store, members } = createSlider(
      host,
      {
        $props: {
          ...props,
          $step: () => props.$step() / $media.duration * 100,
          $keyStep: () => props.$keyStep() / $media.duration * 100,
          $disabled: () => $disabled() || !$media.canSeek
        },
        readonly: true,
        aria: { valueMin: 0, valueMax: 100, valueText: getSpokenText },
        onDragStart,
        onDragEnd,
        onValueChange,
        onDragValueChange
      },
      accessors
    );
    onAttach(() => {
      setAttributeIfEmpty(host.el, "aria-label", "Media time");
    });
    effect(() => {
      const newValue = getPercent($media.currentTime);
      if (!peek(() => $store.dragging)) {
        $store.value = newValue;
        dispatchEvent(host.el, "value-change", { detail: newValue });
      }
    });
    let dispatchSeeking;
    effect(() => {
      dispatchSeeking = functionThrottle(seeking, $seekingRequestThrottle());
    });
    function seeking(time, event) {
      remote.seeking(time, event);
    }
    function seek(time, percent, event) {
      dispatchSeeking.cancel();
      if ($media.live && percent >= 99) {
        remote.seekToLiveEdge(event);
        return;
      }
      remote.seek(time, event);
    }
    let wasPlayingBeforeDragStart = false;
    function onDragStart(event) {
      if ($pauseWhileDragging()) {
        wasPlayingBeforeDragStart = !$media.paused;
        remote.pause(event);
      }
    }
    function onValueChange(event) {
      if ($store.dragging || !event.trigger)
        return;
      onDragEnd(event);
    }
    function onDragValueChange(event) {
      dispatchSeeking(getTime(event.detail), event);
    }
    function onDragEnd(event) {
      const percent = event.detail;
      seek(getTime(percent), percent, event);
      if ($pauseWhileDragging() && wasPlayingBeforeDragStart) {
        remote.play(event);
        wasPlayingBeforeDragStart = false;
      }
    }
    function getTime(percent) {
      return Math.round(percent / 100 * $media.duration);
    }
    function getPercent(time) {
      const rate = Math.max(
        0,
        Math.min(1, $media.liveEdge ? 1 : Math.min(time, $media.duration) / $media.duration)
      );
      return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
    }
    function getSpokenText() {
      const time = getTime($store.value);
      return Number.isFinite(time) ? `${formatSpokenTime(time)} out of ${formatSpokenTime($media.duration)}` : "live";
    }
    provideContext(sliderValueFormattersContext, {
      value(percent) {
        const time = getTime(percent);
        return Number.isFinite(time) ? ($media.live ? time - $media.duration : time).toFixed(0) : "LIVE";
      },
      time(percent, padHours, padMinutes, showHours) {
        const time = getTime(percent);
        const value = $media.live ? time - $media.duration : time;
        return Number.isFinite(time) ? `${value < 0 ? "-" : ""}${formatTime(Math.abs(value), padHours, padMinutes, showHours)}` : "LIVE";
      }
    });
    return mergeProperties(members, {
      // redeclare the following properties to ensure they're read-only.
      get min() {
        return members.min;
      },
      get max() {
        return members.max;
      },
      get value() {
        return members.value;
      }
    });
  }
});

export { TimeSliderDefinition };
