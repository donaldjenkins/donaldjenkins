import type { MediaTimeElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-time': MediaTimeElement;
    }
}
export declare const TimeDefinition: import("maverick.js/element").CustomElementDefinition<MediaTimeElement>;
