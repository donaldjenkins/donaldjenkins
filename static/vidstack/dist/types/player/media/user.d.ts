import { type ReadSignal } from 'maverick.js';
import type { MediaControllerElement } from './controller/types';
import type { MediaStore } from './store';
export declare function createMediaUser($controller: ReadSignal<MediaControllerElement | null>, $media: MediaStore): MediaUser;
export interface MediaUser {
    idle: {
        /**
         * Whether the media user is currently idle.
         *
         * @signal
         */
        readonly idling: boolean;
        /**
         * Whether idle state tracking has been paused.
         *
         * @signal
         */
        paused: boolean;
        /**
         * The amount of delay in milliseconds while media playback is progressing without user
         * activity to indicate an idle state.
         *
         * @defaultValue 2000
         */
        delay: number;
    };
}
