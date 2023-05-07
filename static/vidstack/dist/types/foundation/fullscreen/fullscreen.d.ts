import { type ReadSignal } from 'maverick.js';
import type { FullscreenEventTarget } from './events';
export declare function createFullscreenAdapter($target: ReadSignal<FullscreenEventTarget | null>): FullscreenAdapter;
export declare function canFullscreen(): boolean;
export interface FullscreenAdapter {
    /**
     * Whether the host element is in fullscreen mode.
     */
    readonly active: boolean;
    /**
     * Whether the native browser fullscreen API is available, or the current provider can
     * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
     * only that it can be attempted.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API}
     */
    readonly supported: boolean;
    /**
     * Request to display the current host element in fullscreen.
     *
     * @throws Error - if fullscreen API is not available.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen}
     */
    enter(): Promise<void>;
    /**
     * Attempt to exit fullscreen on the current host element.
     *
     * @throws Error - if fullscreen API is not available.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/exitFullscreen}
     */
    exit(): Promise<void>;
}
