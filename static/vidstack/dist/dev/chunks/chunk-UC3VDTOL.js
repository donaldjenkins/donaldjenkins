import { IS_SAFARI } from './chunk-KKTONNDY.js';
import { getNumberOfDecimalPlaces } from './chunk-CVLY5S52.js';
import { isString, setAttribute, isUndefined, isNumber, useDisposalBin, listenEvent, dispatchEvent, isNil } from 'maverick.js/std';
import { onDispose } from 'maverick.js';

var AUDIO_EXTENSIONS = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
var AUDIO_TYPES = /* @__PURE__ */ new Set([
  "audio/mpeg",
  "audio/ogg",
  "audio/3gp",
  "audio/mp4",
  "audio/webm",
  "audio/flac"
]);
var VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
var VIDEO_TYPES = /* @__PURE__ */ new Set([
  "video/mp4",
  "video/webm",
  "video/3gp",
  "video/ogg",
  "video/avi",
  "video/mpeg"
]);
var HLS_VIDEO_EXTENSIONS = /\.(m3u8)($|\?)/i;
var HLS_VIDEO_TYPES = /* @__PURE__ */ new Set([
  // Apple sanctioned
  "application/vnd.apple.mpegurl",
  // Apple sanctioned for backwards compatibility
  "audio/mpegurl",
  // Very common
  "audio/x-mpegurl",
  // Very common
  "application/x-mpegurl",
  // Included for completeness
  "video/x-mpegurl",
  "video/mpegurl",
  "application/mpegurl"
]);
function isHLSSrc({ src, type }) {
  return isString(src) && HLS_VIDEO_EXTENSIONS.test(src) || HLS_VIDEO_TYPES.has(type);
}
function isMediaStream(src) {
  return !isUndefined(window.MediaStream) && src instanceof window.MediaStream;
}
function createRAFLoop(callback) {
  let id;
  function start() {
    if (!isUndefined(id))
      return;
    loop();
  }
  function loop() {
    id = window.requestAnimationFrame(function rafLoop() {
      if (isUndefined(id))
        return;
      callback();
      loop();
    });
  }
  function stop() {
    if (isNumber(id))
      window.cancelAnimationFrame(id);
    id = void 0;
  }
  return {
    start,
    stop
  };
}

// src/foundation/list/symbols.ts
var LIST_ADD = Symbol("LIST_ADD" );
var LIST_REMOVE = Symbol("LIST_REMOVE" );
var LIST_RESET = Symbol("LIST_RESET" );
var LIST_SELECT = Symbol("LIST_SELECT" );
var LIST_READONLY = Symbol("LIST_READONLY" );
var LIST_SET_READONLY = Symbol("LIST_SET_READONLY" );
var LIST_ON_RESET = Symbol("LIST_ON_RESET" );
var LIST_ON_REMOVE = Symbol("LIST_ON_REMOVE" );
var LIST_ON_USER_SELECT = Symbol("LIST_ON_USER_SELECT" );

// src/player/media/providers/html/setup-events.ts
function setupHTMLMediaElementEvents(provider, { player, $store: $media, delegate, logger, audioTracks }) {
  const disposal = useDisposalBin();
  let isMediaWaiting = false, attachedLoadStartEventListeners = false, attachedCanPlayEventListeners = false;
  const timeRafLoop = createRAFLoop(() => {
    const newTime = provider.currentTime;
    if ($media.currentTime !== newTime)
      updateCurrentTime(newTime);
  });
  attachInitialEventListeners();
  attachAudioTracksListeners();
  onDispose(() => {
    timeRafLoop.stop();
    disposal.empty();
  });
  function attachMediaEventListener(eventType, handler) {
    return listenEvent(
      provider.media,
      eventType,
      (event) => {
        logger?.debugGroup(`\u{1F4FA} fired \`${event.type}\``).labelledLog("Event", event).labelledLog("Media Store", { ...$media }).dispatch();
        handler(event);
      } 
    );
  }
  function attachInitialEventListeners() {
    attachMediaEventListener("loadstart", onLoadStart);
    attachMediaEventListener("abort", onAbort);
    attachMediaEventListener("emptied", onEmptied);
    attachMediaEventListener("error", onError);
    {
      logger?.debug("attached initial media event listeners");
    }
  }
  function attachAudioTracksListeners() {
    if ("audioTracks" in provider.media) {
      let onAddAudioTrack2 = function(event) {
        const _track = event.track;
        const audioTrack = {
          id: _track.id + "",
          label: _track.label,
          language: _track.language,
          kind: _track.kind,
          selected: false
        };
        audioTracks[LIST_ADD](audioTrack, event);
        if (_track.enabled)
          audioTrack.selected = true;
      }, onRemoveAudioTrack2 = function(event) {
        const track = audioTracks.getById(event.track.id);
        if (track)
          audioTracks[LIST_REMOVE](track, event);
      }, getEnabledAudioTrack2 = function() {
        return Array.from(_tracks).find((track) => track.enabled);
      }, onAudioTrackChange2 = function(event) {
        let enabledTrack = getEnabledAudioTrack2();
        if (!enabledTrack)
          return;
        const track = audioTracks.getById(enabledTrack.id);
        if (track)
          audioTracks[LIST_SELECT](track, true, event);
      };
      const _tracks = provider.media.audioTracks;
      _tracks.onaddtrack = onAddAudioTrack2;
      _tracks.onremovetrack = onRemoveAudioTrack2;
      _tracks.onchange = onAudioTrackChange2;
      audioTracks.addEventListener("change", (event) => {
        const { current } = event.detail;
        const track = _tracks.getTrackById(current.id);
        if (track) {
          const prev = getEnabledAudioTrack2();
          if (prev)
            prev.enabled = false;
          track.enabled = true;
        }
      });
    }
  }
  function attachLoadStartEventListeners() {
    if (attachedLoadStartEventListeners)
      return;
    disposal.add(
      attachMediaEventListener("loadeddata", onLoadedData),
      attachMediaEventListener("loadedmetadata", onLoadedMetadata),
      attachMediaEventListener("canplay", onCanPlay),
      attachMediaEventListener("canplaythrough", onCanPlayThrough),
      attachMediaEventListener("durationchange", onDurationChange),
      attachMediaEventListener("play", onPlay),
      attachMediaEventListener("progress", onProgress),
      attachMediaEventListener("stalled", onStalled),
      attachMediaEventListener("suspend", onSuspend)
    );
    attachedLoadStartEventListeners = true;
  }
  function attachCanPlayEventListeners() {
    if (attachedCanPlayEventListeners)
      return;
    disposal.add(
      attachMediaEventListener("pause", onPause),
      attachMediaEventListener("playing", onPlaying),
      attachMediaEventListener("ratechange", onRateChange),
      attachMediaEventListener("seeked", onSeeked),
      attachMediaEventListener("seeking", onSeeking),
      attachMediaEventListener("ended", onEnded),
      attachMediaEventListener("volumechange", onVolumeChange),
      attachMediaEventListener("waiting", onWaiting)
    );
    attachedCanPlayEventListeners = true;
  }
  function updateCurrentTime(newTime, trigger) {
    delegate.dispatch("time-update", {
      // Avoid errors where `currentTime` can have higher precision.
      detail: {
        currentTime: Math.min(newTime, $media.seekableEnd),
        played: provider.media.played
      },
      trigger
    });
  }
  function onAbort(event) {
    delegate.dispatch("abort", { trigger: event });
  }
  function onLoadStart(event) {
    if (provider.media.networkState === 3) {
      onAbort(event);
      return;
    }
    attachLoadStartEventListeners();
    delegate.dispatch("load-start", { trigger: event });
  }
  function onEmptied(event) {
    delegate.dispatch("emptied", { trigger: event });
  }
  function onLoadedData(event) {
    delegate.dispatch("loaded-data", { trigger: event });
  }
  function onLoadedMetadata(event) {
    onStreamTypeChange();
    attachCanPlayEventListeners();
    delegate.dispatch("volume-change", {
      detail: { volume: provider.media.volume, muted: provider.media.muted }
    });
    delegate.dispatch("loaded-metadata", { trigger: event });
    if (IS_SAFARI && isHLSSrc($media.source)) {
      delegate.ready(getCanPlayDetail(), event);
    }
  }
  function getCanPlayDetail() {
    return {
      duration: provider.media.duration,
      buffered: provider.media.buffered,
      seekable: provider.media.seekable
    };
  }
  function onStreamTypeChange() {
    if ($media.streamType !== "unknown")
      return;
    const isLive = !Number.isFinite(provider.media.duration);
    delegate.dispatch("stream-type-change", {
      detail: isLive ? "live" : "on-demand"
    });
  }
  function onPlay(event) {
    if (!$media.canPlay)
      return;
    delegate.dispatch("play", { trigger: event });
  }
  function onPause(event) {
    if (provider.media.readyState === 1 && !isMediaWaiting)
      return;
    isMediaWaiting = false;
    timeRafLoop.stop();
    delegate.dispatch("pause", { trigger: event });
  }
  function onCanPlay(event) {
    delegate.ready(getCanPlayDetail(), event);
  }
  function onCanPlayThrough(event) {
    if ($media.started)
      return;
    delegate.dispatch("can-play-through", {
      trigger: event,
      detail: getCanPlayDetail()
    });
  }
  function onPlaying(event) {
    isMediaWaiting = false;
    delegate.dispatch("playing", { trigger: event });
    timeRafLoop.start();
  }
  function onStalled(event) {
    delegate.dispatch("stalled", { trigger: event });
    if (provider.media.readyState < 3) {
      isMediaWaiting = true;
      delegate.dispatch("waiting", { trigger: event });
    }
  }
  function onWaiting(event) {
    if (provider.media.readyState < 3) {
      isMediaWaiting = true;
      delegate.dispatch("waiting", { trigger: event });
    }
  }
  function onEnded(event) {
    timeRafLoop.stop();
    updateCurrentTime(provider.media.duration, event);
    delegate.dispatch("end", { trigger: event });
    if ($media.loop) {
      onLoop();
    } else {
      delegate.dispatch("ended", { trigger: event });
    }
  }
  function onDurationChange(event) {
    if ($media.ended)
      updateCurrentTime(provider.media.duration, event);
    delegate.dispatch("duration-change", {
      detail: provider.media.duration,
      trigger: event
    });
  }
  function onVolumeChange(event) {
    delegate.dispatch("volume-change", {
      detail: {
        volume: provider.media.volume,
        muted: provider.media.muted
      },
      trigger: event
    });
  }
  function onSeeked(event) {
    updateCurrentTime(provider.media.currentTime, event);
    delegate.dispatch("seeked", {
      detail: provider.media.currentTime,
      trigger: event
    });
    if (Math.trunc(provider.media.currentTime) === Math.trunc(provider.media.duration) && getNumberOfDecimalPlaces(provider.media.duration) > getNumberOfDecimalPlaces(provider.media.currentTime)) {
      updateCurrentTime(provider.media.duration, event);
      if (!provider.media.ended) {
        dispatchEvent(player, "media-play-request", { trigger: event });
      }
    }
  }
  function onSeeking(event) {
    delegate.dispatch("seeking", {
      detail: provider.media.currentTime,
      trigger: event
    });
  }
  function onProgress(event) {
    delegate.dispatch("progress", {
      detail: {
        buffered: provider.media.buffered,
        seekable: provider.media.seekable
      },
      trigger: event
    });
  }
  function onLoop() {
    const hasCustomControls = isNil(provider.media.controls);
    if (hasCustomControls)
      provider.media.controls = false;
    dispatchEvent(player, "media-loop-request");
  }
  function onSuspend(event) {
    delegate.dispatch("suspend", { trigger: event });
  }
  function onRateChange(event) {
    delegate.dispatch("rate-change", {
      detail: provider.media.playbackRate,
      trigger: event
    });
  }
  function onError(event) {
    const mediaError = provider.media.error;
    if (!mediaError)
      return;
    delegate.dispatch("error", {
      detail: {
        message: mediaError.message,
        code: mediaError.code,
        mediaError
      },
      trigger: event
    });
  }
}

// src/player/media/providers/html/provider.ts
var HTMLMediaProvider = class {
  constructor(_media) {
    this._media = _media;
  }
  setup(context) {
    setupHTMLMediaElementEvents(this, context);
  }
  get type() {
    return "";
  }
  get media() {
    return this._media;
  }
  get paused() {
    return this._media.paused;
  }
  get muted() {
    return this._media.muted;
  }
  set muted(muted) {
    this._media.muted = muted;
  }
  get volume() {
    return this._media.volume;
  }
  set volume(volume) {
    this._media.volume = volume;
  }
  get currentTime() {
    return this._media.currentTime;
  }
  set currentTime(time) {
    this._media.currentTime = time;
  }
  get playsinline() {
    return this._media.hasAttribute("playsinline");
  }
  set playsinline(playsinline) {
    setAttribute(this._media, "playsinline", playsinline);
  }
  get playbackRate() {
    return this._media.playbackRate;
  }
  set playbackRate(rate) {
    this._media.playbackRate = rate;
  }
  async play() {
    return this._media.play();
  }
  async pause() {
    return this._media.pause();
  }
  async loadSource({ src }, preload) {
    this._media.preload = preload;
    if (isMediaStream(src)) {
      this._media.srcObject = src;
    } else {
      this._media.srcObject = null;
      this._media.src = isString(src) ? src : window.URL.createObjectURL(src);
    }
    this._media.load();
  }
};

export { AUDIO_EXTENSIONS, AUDIO_TYPES, HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES, HTMLMediaProvider, LIST_ADD, LIST_ON_REMOVE, LIST_ON_RESET, LIST_ON_USER_SELECT, LIST_READONLY, LIST_REMOVE, LIST_RESET, LIST_SELECT, LIST_SET_READONLY, VIDEO_EXTENSIONS, VIDEO_TYPES, createRAFLoop, isHLSSrc };
