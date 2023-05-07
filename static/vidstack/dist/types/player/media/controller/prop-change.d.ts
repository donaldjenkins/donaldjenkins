import { type Signals } from 'maverick.js';
import type { MediaContext } from '../context';
import type { MediaControllerProps } from './types';
/**
 * This hook is responsible for dispatching media events that are in response to prop changes. Other
 * events dispatched by the player are in response to a media events, these events are the odd ones
 * that are in response to prop changes.
 */
export declare function useMediaPropChange({ $player, $store }: MediaContext, { $autoplay, $poster, $loop, $controls, $crossorigin, $playsinline, $logLevel, $liveEdgeTolerance, $minLiveDVRWindow, }: Signals<MediaControllerProps>): void;
