import { type ReadSignal } from 'maverick.js';
import type { ScreenOrientationEventTarget } from './events';
import type { ScreenOrientationLockType, ScreenOrientationType } from './types';
export declare function createScreenOrientationAdapter($target: ReadSignal<ScreenOrientationEventTarget | null>): ScreenOrientationAdapter;
export interface ScreenOrientationAdapter {
    /**
     * The current screen orientation. It will return `undefined` if the Screen Orientation API
     * is not available.
     *
     * @signal
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
     * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
     */
    readonly orientation: ScreenOrientationType | undefined;
    /**
     * Whether the screen orientation is currently locked.
     *
     * @signal
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
     * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
     */
    readonly locked: boolean;
    /**
     * Whether the native Screen Orientation API is available.
     */
    readonly supported: boolean;
    /**
     * Locks the orientation of the screen to the desired orientation type using the
     * Screen Orientation API.
     *
     * @param lockType - The screen lock orientation type.
     * @throws Error - If screen orientation API is unavailable.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
     * @see {@link https://w3c.github.io/screen-orientation}
     */
    lock(lockType: ScreenOrientationLockType): Promise<void>;
    /**
     * Unlocks the orientation of the screen to it's default state using the Screen Orientation
     * API. This method will throw an error if the API is unavailable.
     *
     * @throws Error - If screen orientation API is unavailable.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
     * @see {@link https://w3c.github.io/screen-orientation}
     */
    unlock(): Promise<void>;
}
