import type { MediaSeekButtonElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-seek-button': MediaSeekButtonElement;
    }
}
export declare const SeekButtonDefinition: import("maverick.js/element").CustomElementDefinition<MediaSeekButtonElement>;
