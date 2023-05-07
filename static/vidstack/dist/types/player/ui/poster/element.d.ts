import type { MediaPosterElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-poster': MediaPosterElement;
    }
}
export declare const PosterDefinition: import("maverick.js/element").CustomElementDefinition<MediaPosterElement>;
