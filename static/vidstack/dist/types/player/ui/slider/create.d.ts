import { type ReadSignal, type Signals } from 'maverick.js';
import { type CustomElementHost } from 'maverick.js/element';
import type { SliderProps } from './props';
import { type SliderStore } from './store';
import type { MediaSliderElement, SliderMembers } from './types';
import { type SliderEventCallbacks } from './use-events';
/**
 * This hook enables providing a custom built `input[type="range"]` that is cross-browser friendly,
 * ARIA friendly, mouse/touch friendly and easily stylable.
 */
export declare function createSlider(host: CustomElementHost<MediaSliderElement>, { $props, readonly, aria, ...callbacks }: SliderInit, accessors: () => SliderProps): Slider;
export interface Slider {
    $store: SliderStore;
    members: SliderMembers;
}
export interface SliderInit extends SliderEventCallbacks {
    $props: Signals<SliderProps>;
    readonly?: boolean;
    aria?: {
        valueMin?: number | ReadSignal<number>;
        valueMax?: number | ReadSignal<number>;
        valueNow?: number | ReadSignal<number>;
        valueText?: string | ReadSignal<string>;
    };
}
