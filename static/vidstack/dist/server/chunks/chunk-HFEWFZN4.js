import { isTrackCaptionKind } from './chunk-BCHRLKDT.js';
import { DOMEvent } from 'maverick.js/std';

var MediaRemoteControl = class {
  constructor(_logger) {
    this._logger = _logger;
    this._target = null;
    this._player = null;
    this._prevTrackIndex = -1;
  }
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
  setTarget(target) {
    this._target = target;
  }
  /**
   * Returns the current `<media-player>` element. This method will attempt to find the player by
   * searching up from either the given `target` or default target set via `remote.setTarget`.
   *
   * @example
   * ```ts
   * const player = remote.getPlayer();
   * ```
   */
  getPlayer(target) {
    var _a;
    if (this._player)
      return this._player;
    (_a = target ?? this._target) == null ? void 0 : _a.dispatchEvent(
      new DOMEvent("find-media-player", {
        detail: (player) => void (this._player = player),
        bubbles: true,
        composed: true
      })
    );
    return this._player;
  }
  /**
   * Set the current `<media-player>` element so the remote can support toggle methods such as
   * `togglePaused` as they rely on the current media state.
   */
  setPlayer(player) {
    this._player = player;
  }
  /**
   * Dispatch a request to start the media loading process. This will only work if the media
   * player has been initialized with a custom loading strategy `<media-player load="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#loading-strategies}
   */
  startLoading(trigger) {
    this._dispatchRequest("media-start-loading", trigger);
  }
  /**
   * Dispatch a request to begin/resume media playback.
   */
  play(trigger) {
    this._dispatchRequest("media-play-request", trigger);
  }
  /**
   * Dispatch a request to pause media playback.
   */
  pause(trigger) {
    this._dispatchRequest("media-pause-request", trigger);
  }
  /**
   * Dispatch a request to set the media volume to mute (0).
   */
  mute(trigger) {
    this._dispatchRequest("media-mute-request", trigger);
  }
  /**
   * Dispatch a request to unmute the media volume and set it back to it's previous state.
   */
  unmute(trigger) {
    this._dispatchRequest("media-unmute-request", trigger);
  }
  /**
   * Dispatch a request to enter fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#media-remote}
   */
  enterFullscreen(target, trigger) {
    this._dispatchRequest("media-enter-fullscreen-request", trigger, target);
  }
  /**
   * Dispatch a request to exit fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#media-remote}
   */
  exitFullscreen(target, trigger) {
    this._dispatchRequest("media-exit-fullscreen-request", trigger, target);
  }
  /**
   * Dispatch a request to enter picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#media-remote}
   */
  enterPictureInPicture(trigger) {
    this._dispatchRequest("media-enter-pip-request", trigger);
  }
  /**
   * Dispatch a request to exit picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#media-remote}
   */
  exitPictureInPicture(trigger) {
    this._dispatchRequest("media-exit-pip-request", trigger);
  }
  /**
   * Notify the media player that a seeking process is happening and to seek to the given `time`.
   */
  seeking(time, trigger) {
    this._dispatchRequest("media-seeking-request", trigger, time);
  }
  /**
   * Notify the media player that a seeking operation has completed and to seek to the given `time`.
   * This is generally called after a series of `remote.seeking()` calls.
   */
  seek(time, trigger) {
    this._dispatchRequest("media-seek-request", trigger, time);
  }
  seekToLiveEdge(trigger) {
    this._dispatchRequest("media-live-edge-request", trigger);
  }
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
  changeVolume(volume, trigger) {
    this._dispatchRequest("media-volume-change-request", trigger, Math.max(0, Math.min(1, volume)));
  }
  /**
   * Dispatch a request to change the current audio track.
   *
   * @example
   * ```ts
   * remote.changeAudioTrack(1); // track at index 1
   * ```
   */
  changeAudioTrack(index, trigger) {
    this._dispatchRequest("media-audio-track-change-request", trigger, index);
  }
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
  changeQuality(index, trigger) {
    this._dispatchRequest("media-quality-change-request", trigger, index);
  }
  /**
   * Dispatch a request to change the mode of the text track at the given index.
   *
   * @example
   * ```ts
   * remote.changeTextTrackMode(1, 'showing'); // track at index 1
   * ```
   */
  changeTextTrackMode(index, mode, trigger) {
    this._dispatchRequest("media-text-track-change-request", trigger, {
      index,
      mode
    });
  }
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
  changePlaybackRate(rate, trigger) {
    this._dispatchRequest("media-rate-change-request", trigger, rate);
  }
  /**
   * Dispatch a request to resume user idle tracking. Refer to {@link MediaRemoteControl.pauseUserIdle}
   * for more information.
   */
  resumeUserIdle(trigger) {
    this._dispatchRequest("media-resume-user-idle-request", trigger);
  }
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
  pauseUserIdle(trigger) {
    this._dispatchRequest("media-pause-user-idle-request", trigger);
  }
  /**
   * Dispatch a request to load and show the native poster element.
   */
  showPoster(trigger) {
    this._dispatchRequest("media-show-poster-request", trigger);
  }
  /**
   * Dispatch a request to prevent loading and to hide the native poster element.
   */
  hidePoster(trigger) {
    this._dispatchRequest("media-hide-poster-request", trigger);
  }
  /**
   * Dispatch a request to toggle the media playback state.
   */
  togglePaused(trigger) {
    const player = this.getPlayer(trigger == null ? void 0 : trigger.target);
    if (!player) {
      return;
    }
    if (player.state.paused)
      this.play(trigger);
    else
      this.pause(trigger);
  }
  /**
   * Dispatch a request to toggle the media muted state.
   */
  toggleMuted(trigger) {
    const player = this.getPlayer(trigger == null ? void 0 : trigger.target);
    if (!player) {
      return;
    }
    if (player.state.muted)
      this.unmute(trigger);
    else
      this.mute(trigger);
  }
  /**
   * Dispatch a request to toggle the media fullscreen state.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#media-remote}
   */
  toggleFullscreen(target, trigger) {
    const player = this.getPlayer(trigger == null ? void 0 : trigger.target);
    if (!player) {
      return;
    }
    if (player.state.fullscreen)
      this.exitFullscreen(target, trigger);
    else
      this.enterFullscreen(target, trigger);
  }
  /**
   * Dispatch a request to toggle the media picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#media-remote}
   */
  togglePictureInPicture(trigger) {
    const player = this.getPlayer(trigger == null ? void 0 : trigger.target);
    if (!player) {
      return;
    }
    if (player.state.pictureInPicture)
      this.exitPictureInPicture(trigger);
    else
      this.enterPictureInPicture(trigger);
  }
  /**
   * Dispatch a request to toggle the current captions mode.
   */
  toggleCaptions(trigger) {
    const player = this.getPlayer(trigger == null ? void 0 : trigger.target);
    if (!player) {
      return;
    }
    const tracks = player.state.textTracks, track = player.state.textTrack;
    if (track) {
      const index = tracks.indexOf(track);
      this.changeTextTrackMode(index, "disabled", trigger);
      this._prevTrackIndex = index;
    } else {
      let index = this._prevTrackIndex;
      if (!tracks[index] || !isTrackCaptionKind(tracks[index])) {
        index = -1;
      }
      if (index === -1) {
        index = tracks.findIndex((track2) => isTrackCaptionKind(track2) && track2.default);
      }
      if (index === -1) {
        index = tracks.findIndex((track2) => isTrackCaptionKind(track2));
      }
      if (index >= 0)
        this.changeTextTrackMode(index, "showing", trigger);
      this._prevTrackIndex = -1;
    }
  }
  _dispatchRequest(type, trigger, detail) {
    const request = new DOMEvent(type, {
      bubbles: true,
      composed: true,
      detail,
      trigger
    });
    const target = (trigger == null ? void 0 : trigger.target) === document || (trigger == null ? void 0 : trigger.target) === window || (trigger == null ? void 0 : trigger.target) === document.body ? this._target ?? this.getPlayer() : (trigger == null ? void 0 : trigger.target) ?? this._target;
    target == null ? void 0 : target.dispatchEvent(request);
  }
  _noPlayerWarning(method) {
  }
};

export { MediaRemoteControl };
