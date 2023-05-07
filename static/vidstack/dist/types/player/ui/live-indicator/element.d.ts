import type { MediaLiveIndicatorElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-live-indicator': MediaLiveIndicatorElement;
    }
}
export declare const LiveIndicatorDefinition: import("maverick.js/element").CustomElementDefinition<MediaLiveIndicatorElement>;
