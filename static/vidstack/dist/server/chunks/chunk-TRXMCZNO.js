import { sliderProps, createSlider } from './chunk-L4CLTNDQ.js';
import { functionThrottle } from './chunk-JELAJF2G.js';
import { round } from './chunk-N2X5VJTG.js';
import { setAttributeIfEmpty } from './chunk-EWIZ7YX3.js';
import { useMedia } from './chunk-3ULVZKKX.js';
import { effect } from 'maverick.js';
import { defineCustomElement, onAttach } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

// src/player/ui/volume-slider/props.ts
var volumeSliderProps = {
  ...sliderProps,
  min: { initial: 0, attribute: false },
  max: { initial: 100, attribute: false },
  value: { initial: 100, attribute: false }
};

// src/player/ui/volume-slider/element.tsx
var VolumeSliderDefinition = defineCustomElement({
  tagName: "media-volume-slider",
  props: volumeSliderProps,
  setup({ host, props, accessors }) {
    const { $store: $media, remote } = useMedia(), { $store, members } = createSlider(
      host,
      {
        $props: props,
        readonly: true,
        aria: { valueMin: 0, valueMax: 100 },
        onValueChange: functionThrottle(onVolumeChange, 25)
      },
      accessors
    );
    onAttach(() => {
      setAttributeIfEmpty(host.el, "aria-label", "Media volume");
    });
    effect(() => {
      const newValue = $media.muted ? 0 : $media.volume * 100;
      $store.value = newValue;
      dispatchEvent(host.el, "value-change", { detail: newValue });
    });
    function onVolumeChange(event) {
      if (!event.trigger)
        return;
      const mediaVolume = round(event.detail / 100, 3);
      remote.changeVolume(mediaVolume, event);
    }
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

export { VolumeSliderDefinition };
