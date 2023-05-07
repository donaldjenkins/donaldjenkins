import type { MediaContext } from '../../context';
import { HTMLMediaProvider } from '../html/provider';
import type { MediaFullscreenAdapter, MediaPictureInPictureAdapter, MediaProvider, MediaSetupContext } from '../types';
export declare const VIDEO_PROVIDER: unique symbol;
/**
 * The video provider adapts the `<video>` element to enable loading videos via the HTML Media
 * Element API.
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/video}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @example
 * ```html
 * <media-player
 *   src="https://media-files.vidstack.io/720p.mp4"
 *   poster="https://media-files.vidstack.io/poster.png"
 * >
 *   <media-outlet></media-outlet>
 * </media-player>
 * ```
 */
export declare class VideoProvider extends HTMLMediaProvider implements MediaProvider {
    [VIDEO_PROVIDER]: boolean;
    get type(): string;
    fullscreen?: MediaFullscreenAdapter;
    pictureInPicture?: MediaPictureInPictureAdapter;
    constructor(video: HTMLVideoElement, context: MediaContext);
    setup(context: MediaSetupContext): void;
    /**
     * The native HTML `<audio>` element.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement}
     */
    get video(): HTMLVideoElement;
}
