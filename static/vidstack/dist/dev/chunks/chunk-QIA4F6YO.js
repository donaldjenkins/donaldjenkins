import { sliderProps, createSlider } from './chunk-AD6J2PGY.js';
import { defineCustomElement } from 'maverick.js/element';

var SliderDefinition = defineCustomElement({
  tagName: "media-slider",
  props: sliderProps,
  setup({ host, props, accessors }) {
    const { members } = createSlider(host, { $props: props }, accessors);
    return members;
  }
});

export { SliderDefinition };
