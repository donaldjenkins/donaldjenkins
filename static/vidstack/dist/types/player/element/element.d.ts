import type { MediaPlayerConnectEvent, MediaPlayerElement } from './types';
declare global {
    interface HTMLElementTagNameMap {
        'media-player': MediaPlayerElement;
    }
    interface HTMLElementEventMap {
        'media-player-connect': MediaPlayerConnectEvent;
    }
}
export declare const PlayerDefinition: import("maverick.js/element").CustomElementDefinition<MediaPlayerElement>;
