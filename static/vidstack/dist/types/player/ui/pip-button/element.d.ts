import type { MediaPIPButtonElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-pip-button': MediaPIPButtonElement;
    }
}
export declare const PIPButtonDefinition: import("maverick.js/element").CustomElementDefinition<MediaPIPButtonElement>;
