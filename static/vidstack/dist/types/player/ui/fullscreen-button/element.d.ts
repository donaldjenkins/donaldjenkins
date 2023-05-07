import type { MediaFullscreenButtonElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-fullscreen-button': MediaFullscreenButtonElement;
    }
}
export declare const FullscreenButtonDefinition: import("maverick.js/element").CustomElementDefinition<MediaFullscreenButtonElement>;
