import type { MediaCaptionButtonElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-caption-button': MediaCaptionButtonElement;
    }
}
export declare const CaptionButtonDefinition: import("maverick.js/element").CustomElementDefinition<MediaCaptionButtonElement>;
