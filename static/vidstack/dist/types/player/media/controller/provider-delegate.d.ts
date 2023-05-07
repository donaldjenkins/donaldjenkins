import { type Signals } from 'maverick.js';
import type { MediaContext } from '../context';
import type { MediaState } from '../state';
import type { MediaRequestManager } from './request-manager';
import type { MediaControllerProps } from './types';
/**
 * This hook is responsible for setting provider props on the current provider. All properties are
 * only set when media is ready for playback to avoid errors and to ensure changes are applied.
 */
export declare function useMediaProviderDelegate({ $provider, $store: $media }: MediaContext, requestManager: MediaRequestManager, { $paused, $volume, $muted, $currentTime, $playsinline, $playbackRate, }: Signals<MediaControllerProps>): Pick<MediaState, "muted" | "volume" | "playsinline" | "currentTime" | "paused" | "playbackRate">;
