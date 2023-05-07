import type { MediaState } from './state';
export interface MediaStore extends MediaState {
}
export declare const mediaStore: import("maverick.js").Store<MediaStore>;
/**
 * Resets all media state and leaves general player state intact (i.e., `autoplay`, `volume`, etc.).
 */
export declare function softResetMediaStore($media: MediaStore): void;
