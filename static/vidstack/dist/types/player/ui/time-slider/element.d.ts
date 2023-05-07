import type { MediaTimeSliderElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-time–slider': MediaTimeSliderElement;
    }
}
export declare const TimeSliderDefinition: import("maverick.js/element").CustomElementDefinition<MediaTimeSliderElement>;
