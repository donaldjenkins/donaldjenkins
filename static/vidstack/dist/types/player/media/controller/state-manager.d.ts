import type { MediaContext } from '../context';
import type { MediaRequestContext } from './request-manager';
/**
 * This hook is responsible for listening to and normalizing media events, updating the media
 * state context, and satisfying media requests if a manager arg is provided.
 */
export declare function createMediaStateManager({ $player, $loader, $provider, $store: $media, qualities, audioTracks, textTracks, logger, }: MediaContext, requests: MediaRequestContext): MediaStateManager;
export interface MediaStateManager {
    handle(event: Event): void;
}
