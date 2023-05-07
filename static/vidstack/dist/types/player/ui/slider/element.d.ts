import type { MediaSliderElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-slider': MediaSliderElement;
    }
}
export declare const SliderDefinition: import("maverick.js/element").CustomElementDefinition<MediaSliderElement>;
