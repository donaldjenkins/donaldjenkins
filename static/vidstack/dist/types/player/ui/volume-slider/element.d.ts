import type { MediaVolumeSliderElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-volume-slider': MediaVolumeSliderElement;
    }
}
export declare const VolumeSliderDefinition: import("maverick.js/element").CustomElementDefinition<MediaVolumeSliderElement>;
