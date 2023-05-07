import type { MediaCaptionsElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-captions': MediaCaptionsElement;
    }
}
export declare const CaptionsDefinition: import("maverick.js/element").CustomElementDefinition<MediaCaptionsElement>;
