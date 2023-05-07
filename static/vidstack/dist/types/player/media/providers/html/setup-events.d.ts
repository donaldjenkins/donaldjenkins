import type { MediaSetupContext } from '../types';
import type { HTMLMediaProvider } from './provider';
/**
 * This is hook is mainly responsible for listening to events fired by a `HTMLMediaElement` and
 * dispatching the respective Vidstack media events (e.g., `canplay` -> `can-play`).
 */
export declare function setupHTMLMediaElementEvents(provider: HTMLMediaProvider, { player, $store: $media, delegate, logger, audioTracks }: MediaSetupContext): void;
