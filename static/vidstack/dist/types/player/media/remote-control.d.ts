import type { Logger } from '../../foundation/logger/create-logger';
import type { MediaPlayerElement } from '../element/types';
import type { MediaFullscreenRequestTarget } from './request-events';
/**
 * A simple facade for dispatching media requests to the nearest media player element.
 *
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/state-management#media-remote}
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/state-management#updating}
 *
 */
export declare class MediaRemoteControl {
    private _logger?;
    private _target;
    private _player;
    private _prevTrackIndex;
    constructor(_logger?: Logger | undefined);
    /**
     * Set the target from which to dispatch media requests events from. The events should bubble
     * up from this target to the `<media-player>` element.
     *
     * @example
     * ```ts
     * const button = document.querySelector('button');
     * remote.setTarget(button);
     * ```
     */
    setTarget(target: EventTarget | null): void;
    /**
     * Returns the current `<media-player>` element. This method will attempt to find the player by
     * searching up from either the given `target` or default target set via `remote.setTarget`.
     *
     * @example
     * ```ts
     * const player = remote.getPlayer();
     * ```
     */
    getPlayer(target?: EventTarget | null): MediaPlayerElement | null;
    /**
     * Set the current `<media-player>` element so the remote can support toggle methods such as
     * `togglePaused` as they rely on the current media state.
     */
    setPlayer(player: MediaPlayerElement | null): void;
    /**
     * Dispatch a request to start the media loading process. This will only work if the media
     * player has been initialized with a custom loading strategy `<media-player load="custom">`.
     *
     * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#loading-strategies}
     */
    startLoading(trigger?: Event): void;
    /**
     * Dispatch a request to begin/resume media playback.
     */
    play(trigger?: Event): void;
    /**
     * Dispatch a request to pause media playback.
     */
    pause(trigger?: Event): void;
    /**
     * Dispatch a request to set the media volume to mute (0).
     */
    mute(trigger?: Event): void;
    /**
     * Dispatch a request to unmute the media volume and set it back to it's previous state.
     */
    unmute(trigger?: Event): void;
    /**
     * Dispatch a request to enter fullscreen.
     *
     * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#media-remote}
     */
    enterFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event): void;
    /**
     * Dispatch a request to exit fullscreen.
     *
     * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#media-remote}
     */
    exitFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event): void;
    /**
     * Dispatch a request to enter picture-in-picture mode.
     *
     * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#media-remote}
     */
    enterPictureInPicture(trigger?: Event): void;
    /**
     * Dispatch a request to exit picture-in-picture mode.
     *
     * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#media-remote}
     */
    exitPictureInPicture(trigger?: Event): void;
    /**
     * Notify the media player that a seeking process is happening and to seek to the given `time`.
     */
    seeking(time: number, trigger?: Event): void;
    /**
     * Notify the media player that a seeking operation has completed and to seek to the given `time`.
     * This is generally called after a series of `remote.seeking()` calls.
     */
    seek(time: number, trigger?: Event): void;
    seekToLiveEdge(trigger?: Event): void;
    /**
     * Dispatch a request to update the media volume to the given `volume` level which is a value
     * between 0 and 1.
     *
     * @example
     * ```ts
     * remote.changeVolume(0); // 0%
     * remote.changeVolume(0.05); // 5%
     * remote.changeVolume(0.5); // 50%
     * remote.changeVolume(0.75); // 70%
     * remote.changeVolume(1); // 100%
     * ```
     */
    changeVolume(volume: number, trigger?: Event): void;
    /**
     * Dispatch a request to change the current audio track.
     *
     * @example
     * ```ts
     * remote.changeAudioTrack(1); // track at index 1
     * ```
     */
    changeAudioTrack(index: number, trigger?: Event): void;
    /**
     * Dispatch a request to change the video quality. The special value `-1` represents auto quality
     * selection.
     *
     * @example
     * ```ts
     * remote.changeQuality(-1); // auto
     * remote.changeQuality(1); // quality at index 1
     * ```
     */
    changeQuality(index: number, trigger?: Event): void;
    /**
     * Dispatch a request to change the mode of the text track at the given index.
     *
     * @example
     * ```ts
     * remote.changeTextTrackMode(1, 'showing'); // track at index 1
     * ```
     */
    changeTextTrackMode(index: number, mode: TextTrackMode, trigger?: Event): void;
    /**
     * Dispatch a request to change the media playback rate.
     *
     * @example
     * ```ts
     * remote.changePlaybackRate(0.5); // Half the normal speed
     * remote.changePlaybackRate(1); // Normal speed
     * remote.changePlaybackRate(1.5); // 50% faster than normal
     * remote.changePlaybackRate(2); // Double the normal speed
     * ```
     */
    changePlaybackRate(rate: number, trigger?: Event): void;
    /**
     * Dispatch a request to resume user idle tracking. Refer to {@link MediaRemoteControl.pauseUserIdle}
     * for more information.
     */
    resumeUserIdle(trigger?: Event): void;
    /**
     * Dispatch a request to pause user idle tracking. Pausing tracking will result in the `user-idle`
     * attribute and state being `false` until `remote.resumeUserIdle()` is called. This method
     * is generally used when building custom controls and you'd like to prevent the UI from
     * dissapearing.
     *
     * @example
     * ```ts
     * // Prevent user idling while menu is being interacted with.
     * function onSettingsOpen() {
     *   remote.pauseUserIdle();
     * }
     *
     * function onSettingsClose() {
     *   remote.resumeUserIdle();
     * }
     * ```
     */
    pauseUserIdle(trigger?: Event): void;
    /**
     * Dispatch a request to load and show the native poster element.
     */
    showPoster(trigger?: Event): void;
    /**
     * Dispatch a request to prevent loading and to hide the native poster element.
     */
    hidePoster(trigger?: Event): void;
    /**
     * Dispatch a request to toggle the media playback state.
     */
    togglePaused(trigger?: Event): void;
    /**
     * Dispatch a request to toggle the media muted state.
     */
    toggleMuted(trigger?: Event): void;
    /**
     * Dispatch a request to toggle the media fullscreen state.
     *
     * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#media-remote}
     */
    toggleFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event): void;
    /**
     * Dispatch a request to toggle the media picture-in-picture mode.
     *
     * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#media-remote}
     */
    togglePictureInPicture(trigger?: Event): void;
    /**
     * Dispatch a request to toggle the current captions mode.
     */
    toggleCaptions(trigger?: Event): void;
    private _dispatchRequest;
    private _noPlayerWarning;
}