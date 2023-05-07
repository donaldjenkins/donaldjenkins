import { sliderProps, createSlider } from './chunk-L4CLTNDQ.js';
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
