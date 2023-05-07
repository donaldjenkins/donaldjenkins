import { type Signals } from 'maverick.js';
import { type ScreenOrientationAdapter } from '../../../foundation/orientation/screen-orientation';
import { Queue } from '../../../foundation/queue/queue';
import type { MediaContext } from '../context';
import type * as RE from '../request-events';
import { type MediaUser } from '../user';
import type { MediaStateManager } from './state-manager';
import type { MediaControllerProps } from './types';
/**
 * This hook is responsible for listening to media request events and calling the appropriate
 * actions on the current media provider. Do note that we queue actions until a media provider
 * has connected.
 */
export declare function createMediaRequestManager({ $player, $store: $media, $provider, logger, qualities, audioTracks, textTracks }: MediaContext, handler: MediaStateManager, requests: MediaRequestContext, $props: Signals<MediaControllerProps>): MediaRequestManager;
export declare class MediaRequestContext {
    _queue: Queue<MediaRequestQueueRecord>;
    _$isSeeking: import("maverick.js").WriteSignal<boolean>;
    _$isLooping: import("maverick.js").WriteSignal<boolean>;
    _$isReplay: import("maverick.js").WriteSignal<boolean>;
}
export interface MediaRequestQueueRecord {
    audioTrack: RE.MediaAudioTrackChangeRequestEvent;
    load: RE.MediaStartLoadingRequestEvent;
    play: RE.MediaPlayRequestEvent;
    pause: RE.MediaPauseRequestEvent;
    rate: RE.MediaRateChangeRequestEvent;
    volume: RE.MediaVolumeChangeRequestEvent | RE.MediaMuteRequestEvent | RE.MediaUnmuteRequestEvent;
    fullscreen: RE.MediaEnterFullscreenRequestEvent | RE.MediaExitFullscreenRequestEvent;
    seeked: RE.MediaSeekRequestEvent | RE.MediaLiveEdgeRequestEvent;
    seeking: RE.MediaSeekingRequestEvent;
    textTrack: RE.MediaTextTrackChangeRequestEvent;
    quality: RE.MediaQualityChangeRequestEvent;
    pip: RE.MediaEnterPIPRequestEvent | RE.MediaExitPIPRequestEvent;
    userIdle: RE.MediaResumeUserIdleRequestEvent | RE.MediaPauseUserIdleRequestEvent;
}
export interface MediaRequestManager {
    _user: MediaUser;
    _orientation: ScreenOrientationAdapter;
    _play(): Promise<void>;
    _pause(): Promise<void>;
    _seekToLiveEdge(): void;
    _enterFullscreen(target?: RE.MediaFullscreenRequestTarget): Promise<void>;
    _exitFullscreen(target?: RE.MediaFullscreenRequestTarget): Promise<void>;
    _enterPictureInPicture(): Promise<PictureInPictureWindow | void>;
    _exitPictureInPicture(): Promise<void>;
}
