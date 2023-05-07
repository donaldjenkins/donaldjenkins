import type { MediaMuteButtonElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-mute-button': MediaMuteButtonElement;
    }
}
export declare const MuteButtonDefinition: import("maverick.js/element").CustomElementDefinition<MediaMuteButtonElement>;
