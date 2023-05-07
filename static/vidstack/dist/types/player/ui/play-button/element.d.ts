import type { MediaPlayButtonElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-play-button': MediaPlayButtonElement;
    }
}
export declare const PlayButtonDefinition: import("maverick.js/element").CustomElementDefinition<MediaPlayButtonElement>;
