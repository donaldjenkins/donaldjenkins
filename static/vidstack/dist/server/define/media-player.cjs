'use strict';

var std = require('maverick.js/std');
var maverick_js = require('maverick.js');
var element = require('maverick.js/element');
var ssr = require('maverick.js/ssr');

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/utils/number.ts
function getNumberOfDecimalPlaces(num) {
  var _a6;
  return ((_a6 = String(num).split(".")[1]) == null ? void 0 : _a6.length) ?? 0;
}
function clampNumber(min, value, max) {
  return Math.max(min, Math.min(max, value));
}
var init_number = __esm({
  "src/utils/number.ts"() {
  }
});

// src/foundation/list/symbols.ts
var LIST_ADD, LIST_REMOVE, LIST_RESET, LIST_SELECT, LIST_READONLY, LIST_SET_READONLY, LIST_ON_RESET, LIST_ON_REMOVE, LIST_ON_USER_SELECT;
var init_symbols = __esm({
  "src/foundation/list/symbols.ts"() {
    LIST_ADD = Symbol(0);
    LIST_REMOVE = Symbol(0);
    LIST_RESET = Symbol(0);
    LIST_SELECT = Symbol(0);
    LIST_READONLY = Symbol(0);
    LIST_SET_READONLY = Symbol(0);
    LIST_ON_RESET = Symbol(0);
    LIST_ON_REMOVE = Symbol(0);
    LIST_ON_USER_SELECT = Symbol(0);
  }
});

// src/player/media/quality/symbols.ts
var SET_AUTO_QUALITY, ENABLE_AUTO_QUALITY;
var init_symbols2 = __esm({
  "src/player/media/quality/symbols.ts"() {
    SET_AUTO_QUALITY = Symbol(0);
    ENABLE_AUTO_QUALITY = Symbol(0);
  }
});

// src/player/media/tracks/text/symbols.ts
var ATTACH_VIDEO, TEXT_TRACK_READY_STATE, TEXT_TRACK_UPDATE_ACTIVE_CUES, TEXT_TRACK_CAN_LOAD, TEXT_TRACK_ON_MODE_CHANGE, TEXT_TRACK_NATIVE, TEXT_TRACK_NATIVE_HLS;
var init_symbols3 = __esm({
  "src/player/media/tracks/text/symbols.ts"() {
    ATTACH_VIDEO = Symbol(0);
    TEXT_TRACK_READY_STATE = Symbol(0);
    TEXT_TRACK_UPDATE_ACTIVE_CUES = Symbol(0);
    TEXT_TRACK_CAN_LOAD = Symbol(0);
    TEXT_TRACK_ON_MODE_CHANGE = Symbol(0);
    TEXT_TRACK_NATIVE = Symbol(0);
    TEXT_TRACK_NATIVE_HLS = Symbol(0);
  }
});
function isTrackCaptionKind(track) {
  return captionRE.test(track.kind);
}
var _a2, _b, _c, TextTrack, captionRE;
var init_text_track = __esm({
  "src/player/media/tracks/text/text-track.ts"() {
    init_symbols3();
    TextTrack = class extends std.EventsTarget {
      constructor(init) {
        super();
        this.id = "";
        this.label = "";
        this.language = "";
        this.default = false;
        this._canLoad = false;
        this._currentTime = 0;
        this._mode = "disabled";
        this._metadata = {};
        this._regions = [];
        this._cues = [];
        this._activeCues = [];
        /* @internal */
        this[_a2] = 0;
        /* @internal */
        this[_b] = null;
        /* @internal */
        this[_c] = null;
        for (const prop of Object.keys(init))
          this[prop] = init[prop];
        if (!init.src)
          this[TEXT_TRACK_READY_STATE] = 2;
      }
      static createId(track) {
        return `id::${track.type}-${track.kind}-${track.src ?? track.label}`;
      }
      get metadata() {
        return this._metadata;
      }
      get regions() {
        return this._regions;
      }
      get cues() {
        return this._cues;
      }
      get activeCues() {
        return this._activeCues;
      }
      /**
       * - 0: Not Loading
       * - 1: Loading
       * - 2: Ready
       * - 3: Error
       */
      get readyState() {
        return this[TEXT_TRACK_READY_STATE];
      }
      get mode() {
        return this._mode;
      }
      set mode(mode) {
        this.setMode(mode);
      }
      addCue(cue, trigger) {
        var _a6;
        let i = 0, length = this._cues.length;
        for (i = 0; i < length; i++)
          if (cue.endTime <= this._cues[i].startTime)
            break;
        if (i === length)
          this._cues.push(cue);
        else
          this._cues.splice(i, 0, cue);
        if ((trigger == null ? void 0 : trigger.type) !== "cuechange") {
          (_a6 = this[TEXT_TRACK_NATIVE]) == null ? void 0 : _a6.track.addCue(cue);
        }
        this.dispatchEvent(new std.DOMEvent("add-cue", { detail: cue, trigger }));
        if (cue.startTime >= this._currentTime && cue.endTime <= this._currentTime) {
          this[TEXT_TRACK_UPDATE_ACTIVE_CUES](this._currentTime, trigger);
        }
      }
      removeCue(cue, trigger) {
        var _a6;
        const index = this._cues.indexOf(cue);
        if (index >= 0) {
          const isActive = this._activeCues.includes(cue);
          this._cues.splice(index, 1);
          (_a6 = this[TEXT_TRACK_NATIVE]) == null ? void 0 : _a6.track.removeCue(cue);
          this.dispatchEvent(new std.DOMEvent("remove-cue", { detail: cue, trigger }));
          if (isActive) {
            this[TEXT_TRACK_UPDATE_ACTIVE_CUES](this._currentTime, trigger);
          }
        }
      }
      setMode(mode, trigger) {
        var _a6;
        if (this._mode === mode)
          return;
        this._mode = mode;
        if (mode === "disabled") {
          this._activeCues = [];
          this._activeCuesChanged();
        } else {
          this._load();
        }
        this.dispatchEvent(new std.DOMEvent("mode-change", { detail: this, trigger }));
        (_a6 = this[TEXT_TRACK_ON_MODE_CHANGE]) == null ? void 0 : _a6.call(this);
      }
      /* @internal */
      [(_a2 = TEXT_TRACK_READY_STATE, _b = TEXT_TRACK_ON_MODE_CHANGE, _c = TEXT_TRACK_NATIVE, TEXT_TRACK_UPDATE_ACTIVE_CUES)](currentTime, trigger) {
        this._currentTime = currentTime;
        if (this.mode === "disabled" || !this._cues.length)
          return;
        const activeCues = [];
        for (let i = 0, length = this._cues.length; i < length; i++) {
          const cue = this._cues[i];
          if (currentTime >= cue.startTime && currentTime <= cue.endTime) {
            activeCues.push(cue);
          }
        }
        let changed = activeCues.length !== this._activeCues.length;
        if (!changed) {
          for (let i = 0; i < activeCues.length; i++) {
            if (!this._activeCues.includes(activeCues[i])) {
              changed = true;
              break;
            }
          }
        }
        this._activeCues = activeCues;
        if (changed)
          this._activeCuesChanged(trigger);
      }
      /* @internal */
      [TEXT_TRACK_CAN_LOAD]() {
        this._canLoad = true;
        if (this._mode !== "disabled")
          this._load();
      }
      async _load() {
        var _a6, _b2;
        if (!this._canLoad || !this.src || this[TEXT_TRACK_READY_STATE] > 0)
          return;
        this[TEXT_TRACK_READY_STATE] = 1;
        this.dispatchEvent(new std.DOMEvent("load-start"));
        try {
          const { parseResponse } = await import('media-captions');
          const { errors, metadata, regions, cues } = await parseResponse(fetch(this.src), {
            type: this.type,
            encoding: this.encoding
          });
          if (((_a6 = errors[0]) == null ? void 0 : _a6.code) === 0) {
            throw errors[0];
          } else {
            this._metadata = metadata;
            this._regions = regions;
            this._cues = cues;
            this[TEXT_TRACK_READY_STATE] = 2;
            const nativeTrack = (_b2 = this[TEXT_TRACK_NATIVE]) == null ? void 0 : _b2.track;
            if (nativeTrack)
              for (const cue of this._cues)
                nativeTrack.addCue(cue);
            this.dispatchEvent(new std.DOMEvent("load"));
          }
        } catch (error) {
          this[TEXT_TRACK_READY_STATE] = 3;
          this.dispatchEvent(new std.DOMEvent("error", { detail: error }));
        }
      }
      _activeCuesChanged(trigger) {
        this.dispatchEvent(new std.DOMEvent("cue-change", { trigger }));
      }
    };
    captionRE = /captions|subtitles/;
  }
});
function canOrientScreen() {
  return false;
}
function canPlayHLSNatively(video) {
  return false;
}
function canUsePictureInPicture(video) {
  return false;
}
function canUseVideoPresentation(video) {
  return false;
}
function isHLSSupported() {
  return false;
}
var IS_CHROME, IS_SAFARI;
var init_support = __esm({
  "src/utils/support.ts"() {
    IS_CHROME = false;
    IS_SAFARI = false;
  }
});

// src/utils/error.ts
function coerceToError(error) {
  return error instanceof Error ? error : Error(JSON.stringify(error));
}
var init_error = __esm({
  "src/utils/error.ts"() {
  }
});
function isHLSSrc({ src, type }) {
  return std.isString(src) && HLS_VIDEO_EXTENSIONS.test(src) || HLS_VIDEO_TYPES.has(type);
}
var AUDIO_EXTENSIONS, AUDIO_TYPES, VIDEO_EXTENSIONS, VIDEO_TYPES, HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES;
var init_mime = __esm({
  "src/utils/mime.ts"() {
    AUDIO_EXTENSIONS = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
    AUDIO_TYPES = /* @__PURE__ */ new Set([
      "audio/mpeg",
      "audio/ogg",
      "audio/3gp",
      "audio/mp4",
      "audio/webm",
      "audio/flac"
    ]);
    VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
    VIDEO_TYPES = /* @__PURE__ */ new Set([
      "video/mp4",
      "video/webm",
      "video/3gp",
      "video/ogg",
      "video/avi",
      "video/mpeg"
    ]);
    HLS_VIDEO_EXTENSIONS = /\.(m3u8)($|\?)/i;
    HLS_VIDEO_TYPES = /* @__PURE__ */ new Set([
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
  }
});
function createRAFLoop(callback) {
  let id;
  function start() {
    if (!std.isUndefined(id))
      return;
    loop();
  }
  function loop() {
    id = window.requestAnimationFrame(function rafLoop() {
      if (std.isUndefined(id))
        return;
      callback();
      loop();
    });
  }
  function stop() {
    if (std.isNumber(id))
      window.cancelAnimationFrame(id);
    id = void 0;
  }
  return {
    start,
    stop
  };
}
var init_raf_loop = __esm({
  "src/foundation/hooks/raf-loop.ts"() {
  }
});
function setupHTMLMediaElementEvents(provider, { player, $store: $media, delegate, logger, audioTracks }) {
  const disposal = std.useDisposalBin();
  let isMediaWaiting = false, attachedLoadStartEventListeners = false, attachedCanPlayEventListeners = false;
  const timeRafLoop = createRAFLoop(() => {
    const newTime = provider.currentTime;
    if ($media.currentTime !== newTime)
      updateCurrentTime(newTime);
  });
  attachInitialEventListeners();
  attachAudioTracksListeners();
  maverick_js.onDispose(() => {
    timeRafLoop.stop();
    disposal.empty();
  });
  function attachMediaEventListener(eventType, handler) {
    return std.listenEvent(
      provider.media,
      eventType,
      handler
    );
  }
  function attachInitialEventListeners() {
    attachMediaEventListener("loadstart", onLoadStart);
    attachMediaEventListener("abort", onAbort);
    attachMediaEventListener("emptied", onEmptied);
    attachMediaEventListener("error", onError);
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
        std.dispatchEvent(player, "media-play-request", { trigger: event });
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
    const hasCustomControls = std.isNil(provider.media.controls);
    if (hasCustomControls)
      provider.media.controls = false;
    std.dispatchEvent(player, "media-loop-request");
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
var init_setup_events = __esm({
  "src/player/media/providers/html/setup-events.ts"() {
    init_raf_loop();
    init_symbols();
    init_mime();
    init_number();
    init_support();
  }
});
var HTMLMediaProvider;
var init_provider = __esm({
  "src/player/media/providers/html/provider.ts"() {
    init_mime();
    init_setup_events();
    HTMLMediaProvider = class {
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
        std.setAttribute(this._media, "playsinline", playsinline);
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
        {
          this._media.srcObject = null;
          this._media.src = std.isString(src) ? src : window.URL.createObjectURL(src);
        }
        this._media.load();
      }
    };
  }
});

// src/player/media/providers/audio/provider.ts
var provider_exports = {};
__export(provider_exports, {
  AUDIO_PROVIDER: () => AUDIO_PROVIDER,
  AudioProvider: () => AudioProvider
});
var AUDIO_PROVIDER, _a3, AudioProvider;
var init_provider2 = __esm({
  "src/player/media/providers/audio/provider.ts"() {
    init_provider();
    AUDIO_PROVIDER = Symbol(0);
    AudioProvider = class extends HTMLMediaProvider {
      constructor() {
        super(...arguments);
        this[_a3] = true;
      }
      get type() {
        return "audio";
      }
      setup(context) {
        super.setup(context);
        if (this.type === "audio")
          context.delegate.dispatch("provider-setup", { detail: this });
      }
      /**
       * The native HTML `<audio>` element.
       *
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
       */
      get audio() {
        return this._media;
      }
    };
    _a3 = AUDIO_PROVIDER;
  }
});
function preconnect(url, rel = "preconnect") {
  return false;
}
function loadScript(src) {
  if (pendingRequests[src])
    return pendingRequests[src].promise;
  const promise = std.deferredPromise(), exists = document.querySelector(`script[src="${src}"]`);
  if (!std.isNull(exists)) {
    promise.resolve();
    return promise.promise;
  }
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => {
    promise.resolve();
    delete pendingRequests[src];
  };
  script.onerror = () => {
    promise.reject();
    delete pendingRequests[src];
  };
  setTimeout(() => document.head.append(script), 0);
  return promise.promise;
}
var pendingRequests;
var init_network = __esm({
  "src/utils/network.ts"() {
    pendingRequests = {};
  }
});
function discoverNativeHLSTextTracks(video, context) {
  video.textTracks.onaddtrack = (event) => {
    const nativeTrack = event.track;
    if (!nativeTrack || findTextTrackElement(video, nativeTrack))
      return;
    const track = new TextTrack({
      id: nativeTrack.id,
      kind: nativeTrack.kind,
      label: nativeTrack.label,
      language: nativeTrack.language,
      type: "vtt"
    });
    track[TEXT_TRACK_NATIVE] = { track: nativeTrack };
    track[TEXT_TRACK_READY_STATE] = 2;
    track[TEXT_TRACK_NATIVE_HLS] = true;
    let lastIndex = 0;
    const onCueChange = (event2) => {
      if (!nativeTrack.cues)
        return;
      for (let i = lastIndex; i < nativeTrack.cues.length; i++) {
        track.addCue(nativeTrack.cues[i], event2);
        lastIndex++;
      }
    };
    onCueChange(event);
    nativeTrack.oncuechange = onCueChange;
    context.textTracks.add(track, event);
    track.setMode(nativeTrack.mode, event);
  };
  maverick_js.onDispose(() => {
    var _a6;
    video.textTracks.onaddtrack = null;
    for (const track of context.textTracks) {
      const nativeTrack = (_a6 = track[TEXT_TRACK_NATIVE]) == null ? void 0 : _a6.track;
      if (nativeTrack == null ? void 0 : nativeTrack.oncuechange)
        nativeTrack.oncuechange = null;
    }
  });
}
function findTextTrackElement(video, track) {
  return Array.from(video.children).find((el) => el.track === track);
}
var init_native_hls_text_tracks = __esm({
  "src/player/media/providers/video/native-hls-text-tracks.ts"() {
    init_symbols3();
    init_text_track();
  }
});
var VideoPictureInPicture;
var init_picture_in_picture = __esm({
  "src/player/media/providers/video/picture-in-picture.ts"() {
    init_support();
    VideoPictureInPicture = class {
      constructor(_video, { delegate }) {
        this._video = _video;
        const onChange = (active, event) => {
          delegate.dispatch("picture-in-picture-change", {
            detail: active,
            trigger: event
          });
        };
        std.listenEvent(this._video, "enterpictureinpicture", (event) => onChange(true, event));
        std.listenEvent(this._video, "leavepictureinpicture", (event) => onChange(false, event));
      }
      get active() {
        return document.pictureInPictureElement === this._video;
      }
      get supported() {
        return canUsePictureInPicture(this._video);
      }
      async enter() {
        return this._video.requestPictureInPicture();
      }
      exit() {
        return document.exitPictureInPicture();
      }
    };
  }
});
var VideoPresentation, FullscreenPresentationAdapter, PIPPresentationAdapter;
var init_video_presentation = __esm({
  "src/player/media/providers/video/presentation/video-presentation.ts"() {
    init_support();
    VideoPresentation = class {
      constructor(_video, { $player, logger, delegate }) {
        this._video = _video;
        this._mode = "inline";
        std.listenEvent(this._video, "webkitpresentationmodechanged", (event) => {
          const prevMode = this._mode;
          this._mode = this._video.webkitPresentationMode;
          std.dispatchEvent($player(), "video-presentation-change", {
            detail: this._mode,
            trigger: event
          });
          ["fullscreen", "picture-in-picture"].forEach((type) => {
            if (this._mode === type || prevMode === type) {
              delegate.dispatch(`${type}-change`, {
                detail: this._mode === type,
                trigger: event
              });
            }
          });
        });
      }
      get _supported() {
        return canUseVideoPresentation(this._video);
      }
      async _setPresentationMode(mode) {
        if (this._mode === mode)
          return;
        this._video.webkitSetPresentationMode(mode);
      }
    };
    FullscreenPresentationAdapter = class {
      constructor(_presentation) {
        this._presentation = _presentation;
      }
      get active() {
        return this._presentation._mode === "fullscreen";
      }
      get supported() {
        return this._presentation._supported;
      }
      async enter() {
        this._presentation._setPresentationMode("fullscreen");
      }
      async exit() {
        this._presentation._setPresentationMode("inline");
      }
    };
    PIPPresentationAdapter = class {
      constructor(_presentation) {
        this._presentation = _presentation;
      }
      get active() {
        return this._presentation._mode === "picture-in-picture";
      }
      get supported() {
        return this._presentation._supported;
      }
      async enter() {
        this._presentation._setPresentationMode("picture-in-picture");
      }
      async exit() {
        this._presentation._setPresentationMode("inline");
      }
    };
  }
});

// src/player/media/providers/video/provider.ts
var provider_exports2 = {};
__export(provider_exports2, {
  VIDEO_PROVIDER: () => VIDEO_PROVIDER,
  VideoProvider: () => VideoProvider
});
var VIDEO_PROVIDER, _a4, VideoProvider;
var init_provider3 = __esm({
  "src/player/media/providers/video/provider.ts"() {
    init_support();
    init_symbols3();
    init_provider();
    init_native_hls_text_tracks();
    init_picture_in_picture();
    init_video_presentation();
    VIDEO_PROVIDER = Symbol(0);
    VideoProvider = class extends HTMLMediaProvider {
      constructor(video, context) {
        super(video);
        this[_a4] = true;
        if (canUseVideoPresentation()) {
          const presentation = new VideoPresentation(video, context);
          this.fullscreen = new FullscreenPresentationAdapter(presentation);
          this.pictureInPicture = new PIPPresentationAdapter(presentation);
        } else if (canUsePictureInPicture()) {
          this.pictureInPicture = new VideoPictureInPicture(video, context);
        }
      }
      get type() {
        return "video";
      }
      setup(context) {
        super.setup(context);
        if (canPlayHLSNatively(this.video)) {
          discoverNativeHLSTextTracks(this.video, context);
        }
        context.textRenderers[ATTACH_VIDEO](this.video);
        maverick_js.onDispose(() => {
          context.textRenderers[ATTACH_VIDEO](null);
        });
        if (this.type === "video")
          context.delegate.dispatch("provider-setup", { detail: this });
      }
      /**
       * The native HTML `<audio>` element.
       *
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement}
       */
      get video() {
        return this._media;
      }
    };
    _a4 = VIDEO_PROVIDER;
  }
});
async function loadHLSLibrary(lib, { player, delegate, logger }) {
  const callbacks = {
    onLoadStart() {
      std.dispatchEvent(player, "hls-lib-load-start");
    },
    onLoaded(ctor2) {
      std.dispatchEvent(player, "hls-lib-loaded", { detail: ctor2 });
    },
    onLoadError(e) {
      const error = coerceToError(e);
      std.dispatchEvent(player, "hls-lib-load-error", { detail: error });
      delegate.dispatch("error", { detail: { message: error.message, code: 4 } });
    }
  };
  let ctor = await loadHLSScript(lib, callbacks);
  if (std.isUndefined(ctor) && !std.isString(lib))
    ctor = await importHLS(lib, callbacks);
  if (!ctor)
    return null;
  if (!ctor.isSupported()) {
    const message = "[vidstack]: `hls.js` is not supported in this environment";
    std.dispatchEvent(player, "hls-unsupported");
    delegate.dispatch("error", { detail: { message, code: 4 } });
    return null;
  }
  return ctor;
}
async function importHLS(loader, callbacks = {}) {
  var _a6, _b2, _c2, _d, _e;
  if (std.isUndefined(loader))
    return void 0;
  (_a6 = callbacks.onLoadStart) == null ? void 0 : _a6.call(callbacks);
  if (loader.prototype && loader.prototype !== Function) {
    (_b2 = callbacks.onLoaded) == null ? void 0 : _b2.call(callbacks, loader);
    return loader;
  }
  try {
    const ctor = (_c2 = await loader()) == null ? void 0 : _c2.default;
    if (ctor && !!ctor.isSupported) {
      (_d = callbacks.onLoaded) == null ? void 0 : _d.call(callbacks, ctor);
    } else {
      throw Error(
        false ? "[vidstack] failed importing `hls.js`. Dynamic import returned invalid constructor." : ""
      );
    }
    return ctor;
  } catch (err) {
    (_e = callbacks.onLoadError) == null ? void 0 : _e.call(callbacks, err);
  }
  return void 0;
}
async function loadHLSScript(src, callbacks = {}) {
  var _a6, _b2, _c2;
  if (!std.isString(src))
    return void 0;
  (_a6 = callbacks.onLoadStart) == null ? void 0 : _a6.call(callbacks);
  try {
    await loadScript(src);
    if (!std.isFunction(window.Hls)) {
      throw Error(
        false ? "[vidstack] failed loading `hls.js`. Could not find a valid `Hls` constructor on window" : ""
      );
    }
    const ctor = window.Hls;
    (_b2 = callbacks.onLoaded) == null ? void 0 : _b2.call(callbacks, ctor);
    return ctor;
  } catch (err) {
    (_c2 = callbacks.onLoadError) == null ? void 0 : _c2.call(callbacks, err);
  }
  return void 0;
}
var init_lib_loader = __esm({
  "src/player/media/providers/hls/lib-loader.ts"() {
    init_error();
    init_network();
  }
});
function setupHLS(provider, { player, logger, delegate, $store, qualities, audioTracks, textTracks }, callbacks) {
  maverick_js.effect(() => {
    const ctor = provider.$ctor();
    if (!ctor)
      return;
    const isLive = maverick_js.peek(() => $store.streamType).includes("live"), isLiveLowLatency = maverick_js.peek(() => $store.streamType).includes("ll-");
    const instance = new ctor({
      lowLatencyMode: isLiveLowLatency,
      backBufferLength: isLiveLowLatency ? 4 : isLive ? 8 : void 0,
      renderTextTracksNatively: false,
      ...provider.config
    });
    for (const event of Object.values(ctor.Events))
      instance.on(event, dispatchHLSEvent);
    instance.on(ctor.Events.ERROR, onError);
    provider.$instance.set(instance);
    for (const callback of callbacks)
      callback(instance);
    std.dispatchEvent(player, "hls-instance", { detail: instance });
    instance.attachMedia(provider.media);
    instance.on(ctor.Events.AUDIO_TRACK_SWITCHED, onAudioTrackSwitched);
    instance.on(ctor.Events.LEVEL_SWITCHED, onLevelSwitched);
    instance.on(ctor.Events.LEVEL_LOADED, onLevelLoaded);
    instance.on(ctor.Events.NON_NATIVE_TEXT_TRACKS_FOUND, (eventType, data) => {
      const event = new std.DOMEvent(eventType, { detail: data });
      let currentTrack = -1;
      for (let i = 0; i < data.tracks.length; i++) {
        const nonNativeTrack = data.tracks[i], init = nonNativeTrack.subtitleTrack ?? nonNativeTrack.closedCaptions, track = new TextTrack({
          id: `hls-${nonNativeTrack.kind}${i}`,
          src: init == null ? void 0 : init.url,
          label: nonNativeTrack.label,
          language: init == null ? void 0 : init.lang,
          kind: nonNativeTrack.kind
        });
        track[TEXT_TRACK_READY_STATE] = 2;
        track[TEXT_TRACK_ON_MODE_CHANGE] = () => {
          if (track.mode === "showing") {
            instance.subtitleTrack = i;
            currentTrack = i;
          } else if (currentTrack === i) {
            instance.subtitleTrack = -1;
            currentTrack = -1;
          }
        };
        if (nonNativeTrack.default)
          track.setMode("showing", event);
        textTracks.add(track, event);
      }
    });
    instance.on(ctor.Events.CUES_PARSED, (eventType, data) => {
      const track = textTracks.getById(`hls-${data.track}`);
      if (!track)
        return;
      const event = new std.DOMEvent(eventType, { detail: data });
      for (const cue of data.cues) {
        cue.positionAlign = "auto";
        track.addCue(cue, event);
      }
    });
    qualities[ENABLE_AUTO_QUALITY] = () => {
      instance.currentLevel = -1;
    };
    qualities.addEventListener("change", () => {
      if (qualities.auto)
        return;
      instance[qualities.switch + "Level"] = qualities.selectedIndex;
      if (IS_CHROME)
        provider.video.currentTime = provider.video.currentTime;
    });
    audioTracks.addEventListener("change", () => {
      if (instance.audioTrack !== audioTracks.selectedIndex) {
        instance.audioTrack = audioTracks.selectedIndex;
      }
    });
    delegate.dispatch("provider-setup", { detail: provider });
    return () => {
      qualities[ENABLE_AUTO_QUALITY] = void 0;
      instance.destroy();
      provider.$instance.set(null);
    };
  });
  maverick_js.effect(() => {
    if (!$store.live)
      return;
    const instance = provider.$instance();
    if (!instance)
      return;
    const rafLoop = createRAFLoop(() => {
      $store.liveSyncPosition = instance.liveSyncPosition ?? Infinity;
    });
    rafLoop.start();
    return rafLoop.stop;
  });
  function dispatchHLSEvent(eventType, detail) {
    player.dispatchEvent(new std.DOMEvent(toDOMEventType(eventType), { detail }));
  }
  function onAudioTrackSwitched(eventType, data) {
    const track = audioTracks[data.id];
    if (track) {
      audioTracks[LIST_SELECT](track, true, new std.DOMEvent(eventType, { detail: data }));
    }
  }
  function onLevelSwitched(eventType, data) {
    const quality = qualities[data.level];
    if (quality) {
      qualities[LIST_SELECT](quality, true, new std.DOMEvent(eventType, { detail: data }));
    }
  }
  function onLevelLoaded(eventType, data) {
    if ($store.canPlay)
      return;
    const { type, live, totalduration: duration } = data.details;
    const event = new std.DOMEvent(eventType, { detail: data });
    delegate.dispatch("stream-type-change", {
      detail: live ? type === "EVENT" && Number.isFinite(duration) ? "live:dvr" : "live" : "on-demand",
      trigger: event
    });
    delegate.dispatch("duration-change", { detail: duration, trigger: event });
    const instance = provider.instance;
    const media = instance.media;
    if (instance.currentLevel === -1) {
      qualities[SET_AUTO_QUALITY](true, event);
    }
    for (const track of instance.audioTracks) {
      audioTracks[LIST_ADD](
        {
          id: track.id + "",
          label: track.name,
          language: track.lang || "",
          kind: "main"
        },
        event
      );
    }
    for (const level of instance.levels) {
      qualities[LIST_ADD](
        {
          width: level.width,
          height: level.height,
          codec: level.codecSet,
          bitrate: level.bitrate
        },
        event
      );
    }
    media.dispatchEvent(new std.DOMEvent("canplay", { trigger: event }));
  }
  function onError(eventType, data) {
    var _b2, _c2, _d;
    if (data.fatal) {
      switch (data.type) {
        case "networkError":
          (_b2 = provider.instance) == null ? void 0 : _b2.startLoad();
          break;
        case "mediaError":
          (_c2 = provider.instance) == null ? void 0 : _c2.recoverMediaError();
          break;
        default:
          (_d = provider.instance) == null ? void 0 : _d.destroy();
          provider.$instance.set(null);
          break;
      }
    }
  }
}
var toDOMEventType;
var init_setup = __esm({
  "src/player/media/providers/hls/setup.ts"() {
    init_raf_loop();
    init_symbols();
    init_support();
    init_symbols2();
    init_symbols3();
    init_text_track();
    toDOMEventType = (type) => std.camelToKebabCase(type);
  }
});

// src/player/media/providers/hls/provider.ts
var provider_exports3 = {};
__export(provider_exports3, {
  HLSProvider: () => HLSProvider,
  HLS_PROVIDER: () => HLS_PROVIDER
});
var HLS_PROVIDER, JS_DELIVR_CDN, _a5, HLSProvider;
var init_provider4 = __esm({
  "src/player/media/providers/hls/provider.ts"() {
    init_network();
    init_support();
    init_provider3();
    init_lib_loader();
    init_setup();
    HLS_PROVIDER = Symbol(0);
    JS_DELIVR_CDN = "https://cdn.jsdelivr.net";
    HLSProvider = class extends VideoProvider {
      constructor() {
        super(...arguments);
        this[_a5] = true;
        this.$ctor = maverick_js.signal(null);
        this.$instance = maverick_js.signal(null);
        this._instanceCallbacks = /* @__PURE__ */ new Set();
        this._library = `${JS_DELIVR_CDN}/npm/hls.js@^1.0.0/dist/hls${".min.js"}`;
        /**
         * The `hls.js` configuration object.
         *
         * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning}
         */
        this.config = {};
      }
      get type() {
        return "hls";
      }
      get canLiveSync() {
        return true;
      }
      /**
       * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
       *
       * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js`
       */
      get library() {
        return this._library;
      }
      set library(library) {
        this._library = library;
      }
      preconnect() {
        if (!std.isString(this._library))
          return;
        preconnect(this._library);
      }
      setup(context) {
        super.setup(context);
        loadHLSLibrary(this._library, context).then((ctor) => this.$ctor.set(() => ctor));
        setupHLS(this, context, this._instanceCallbacks);
      }
      /**
       * The `hls.js` constructor.
       */
      get ctor() {
        return this.$ctor();
      }
      /**
       * The current `hls.js` instance.
       */
      get instance() {
        return this.$instance();
      }
      async loadSource({ src }) {
        maverick_js.effect(() => {
          if (!std.isString(src))
            return;
          const instance = this.$instance();
          instance == null ? void 0 : instance.loadSource(src);
        });
      }
      /**
       * The given callback is invoked when a new `hls.js` instance is created and right before it's
       * attached to media.
       */
      onInstance(callback) {
        const instance = maverick_js.peek(this.$instance);
        if (instance)
          callback(instance);
        this._instanceCallbacks.add(callback);
        return () => this._instanceCallbacks.delete(callback);
      }
    };
    _a5 = HLS_PROVIDER;
    /**
     * Whether `hls.js` is supported in this environment.
     */
    HLSProvider.supported = isHLSSupported();
  }
});
var $keyboard = maverick_js.signal(false);
function useFocusVisible($target) {
  const $focused = maverick_js.signal(false);
  element.onConnect(() => {
    const target = $target();
    maverick_js.effect(() => {
      if (!$keyboard()) {
        $focused.set(false);
        updateFocusAttr(target, false);
        std.listenEvent(target, "pointerenter", () => updateHoverAttr(target, true));
        std.listenEvent(target, "pointerleave", () => updateHoverAttr(target, false));
        return;
      }
      const active = document.activeElement === target;
      $focused.set(active);
      updateFocusAttr(target, active);
      std.listenEvent(target, "focus", () => {
        $focused.set(true);
        updateFocusAttr(target, true);
      });
      std.listenEvent(target, "blur", () => {
        $focused.set(false);
        updateFocusAttr(target, false);
      });
    });
  });
  return $focused;
}
function updateFocusAttr(target, isFocused) {
  std.setAttribute(target, "data-focus", isFocused);
  std.setAttribute(target, "data-hocus", isFocused);
}
function updateHoverAttr(target, isHovering) {
  std.setAttribute(target, "data-hocus", isHovering);
}

// ../../node_modules/.pnpm/fscreen@1.2.0/node_modules/fscreen/dist/fscreen.esm.js
var key = {
  fullscreenEnabled: 0,
  fullscreenElement: 1,
  requestFullscreen: 2,
  exitFullscreen: 3,
  fullscreenchange: 4,
  fullscreenerror: 5,
  fullscreen: 6
};
var webkit = [
  "webkitFullscreenEnabled",
  "webkitFullscreenElement",
  "webkitRequestFullscreen",
  "webkitExitFullscreen",
  "webkitfullscreenchange",
  "webkitfullscreenerror",
  "-webkit-full-screen"
];
var moz = [
  "mozFullScreenEnabled",
  "mozFullScreenElement",
  "mozRequestFullScreen",
  "mozCancelFullScreen",
  "mozfullscreenchange",
  "mozfullscreenerror",
  "-moz-full-screen"
];
var ms = [
  "msFullscreenEnabled",
  "msFullscreenElement",
  "msRequestFullscreen",
  "msExitFullscreen",
  "MSFullscreenChange",
  "MSFullscreenError",
  "-ms-fullscreen"
];
var document2 = typeof window !== "undefined" && typeof window.document !== "undefined" ? window.document : {};
var vendor = "fullscreenEnabled" in document2 && Object.keys(key) || webkit[0] in document2 && webkit || moz[0] in document2 && moz || ms[0] in document2 && ms || [];
var fscreen = {
  requestFullscreen: function(element) {
    return element[vendor[key.requestFullscreen]]();
  },
  requestFullscreenFunction: function(element) {
    return element[vendor[key.requestFullscreen]];
  },
  get exitFullscreen() {
    return document2[vendor[key.exitFullscreen]].bind(document2);
  },
  get fullscreenPseudoClass() {
    return ":" + vendor[key.fullscreen];
  },
  addEventListener: function(type, handler, options) {
    return document2.addEventListener(vendor[key[type]], handler, options);
  },
  removeEventListener: function(type, handler, options) {
    return document2.removeEventListener(vendor[key[type]], handler, options);
  },
  get fullscreenEnabled() {
    return Boolean(document2[vendor[key.fullscreenEnabled]]);
  },
  set fullscreenEnabled(val) {
  },
  get fullscreenElement() {
    return document2[vendor[key.fullscreenElement]];
  },
  set fullscreenElement(val) {
  },
  get onfullscreenchange() {
    return document2[("on" + vendor[key.fullscreenchange]).toLowerCase()];
  },
  set onfullscreenchange(handler) {
    return document2[("on" + vendor[key.fullscreenchange]).toLowerCase()] = handler;
  },
  get onfullscreenerror() {
    return document2[("on" + vendor[key.fullscreenerror]).toLowerCase()];
  },
  set onfullscreenerror(handler) {
    return document2[("on" + vendor[key.fullscreenerror]).toLowerCase()] = handler;
  }
};
var fscreen_esm_default = fscreen;
function createFullscreenAdapter($target) {
  const $active = maverick_js.signal(false), exit = () => exitFullscreen(maverick_js.peek($target));
  let listening = false;
  maverick_js.effect(() => {
    const target = $target();
    if (target) {
      std.listenEvent(fscreen_esm_default, "fullscreenchange", async (trigger) => {
        const active = isFullscreen(target);
        if (active === $active())
          return;
        if (!active)
          listening = false;
        $active.set(active);
        std.dispatchEvent(target, "fullscreen-change", { detail: active, trigger });
      });
      std.listenEvent(fscreen_esm_default, "fullscreenerror", (trigger) => {
        if (!listening)
          return;
        std.dispatchEvent(target, "fullscreen-error", { detail: null, trigger });
        listening = false;
      });
      return async () => {
        if (canFullscreen())
          await exit();
      };
    }
    return;
  });
  return {
    get active() {
      return $active();
    },
    get supported() {
      return canFullscreen();
    },
    async enter() {
      try {
        listening = true;
        return await requestFullscreen(maverick_js.peek($target));
      } catch (error) {
        listening = false;
        throw error;
      }
    },
    exit
  };
}
function canFullscreen() {
  return fscreen_esm_default.fullscreenEnabled;
}
function isFullscreen(host) {
  if (fscreen_esm_default.fullscreenElement === host)
    return true;
  try {
    return host.matches(
      // @ts-expect-error - `fullscreenPseudoClass` is missing from `@types/fscreen`.
      fscreen_esm_default.fullscreenPseudoClass
    );
  } catch (error) {
    return false;
  }
}
async function requestFullscreen(host) {
  if (!host || isFullscreen(host))
    return;
  assertFullscreenAPI();
  return fscreen_esm_default.requestFullscreen(host);
}
async function exitFullscreen(host) {
  if (!host || !isFullscreen(host))
    return;
  assertFullscreenAPI();
  return fscreen_esm_default.exitFullscreen();
}
function assertFullscreenAPI() {
  if (canFullscreen())
    return;
  throw Error(
    "[vidstack] no fullscreen API"
  );
}
var mediaContext = maverick_js.createContext();
function useMedia() {
  return maverick_js.useContext(mediaContext);
}

// src/foundation/list/list.ts
init_symbols();
var _a;
var List = class extends std.EventsTarget {
  constructor() {
    super(...arguments);
    this._items = [];
    /* @internal */
    this[_a] = false;
  }
  get length() {
    return this._items.length;
  }
  get readonly() {
    return this[LIST_READONLY];
  }
  /**
   * Transform list to an array.
   */
  toArray() {
    return [...this._items];
  }
  [(_a = LIST_READONLY, Symbol.iterator)]() {
    return this._items.values();
  }
  /* @internal */
  [LIST_ADD](item, trigger) {
    const index = this._items.length;
    if (!("" + index in this)) {
      Object.defineProperty(this, index, {
        get() {
          return this._items[index];
        }
      });
    }
    if (this._items.includes(item))
      return;
    this._items.push(item);
    this.dispatchEvent(new std.DOMEvent("add", { detail: item, trigger }));
  }
  /* @internal */
  [LIST_REMOVE](item, trigger) {
    var _a6;
    const index = this._items.indexOf(item);
    if (index >= 0) {
      (_a6 = this[LIST_ON_REMOVE]) == null ? void 0 : _a6.call(this, item, trigger);
      this._items.splice(index, 1);
      this.dispatchEvent(new std.DOMEvent("remove", { detail: item, trigger }));
    }
  }
  /* @internal */
  [LIST_RESET](trigger) {
    var _a6;
    for (const item of [...this._items])
      this[LIST_REMOVE](item, trigger);
    this._items = [];
    this[LIST_SET_READONLY](false, trigger);
    (_a6 = this[LIST_ON_RESET]) == null ? void 0 : _a6.call(this);
  }
  /* @internal */
  [LIST_SET_READONLY](readonly, trigger) {
    if (this[LIST_READONLY] === readonly)
      return;
    this[LIST_READONLY] = readonly;
    this.dispatchEvent(new std.DOMEvent("readonly-change", { detail: readonly, trigger }));
  }
};

// src/foundation/list/select-list.ts
init_symbols();
var SELECTED = Symbol(0);
var SelectList = class extends List {
  get selected() {
    return this._items.find((item) => item.selected) ?? null;
  }
  get selectedIndex() {
    return this._items.findIndex((item) => item.selected);
  }
  /* @internal */
  [LIST_ON_REMOVE](item, trigger) {
    this[LIST_SELECT](item, false, trigger);
  }
  /* @internal */
  [LIST_ADD](item, trigger) {
    item[SELECTED] = false;
    Object.defineProperty(item, "selected", {
      get() {
        return this[SELECTED];
      },
      set: (selected) => {
        var _a6;
        if (this.readonly)
          return;
        (_a6 = this[LIST_ON_USER_SELECT]) == null ? void 0 : _a6.call(this);
        this[LIST_SELECT](item, selected);
      }
    });
    super[LIST_ADD](item, trigger);
  }
  /* @internal */
  [LIST_SELECT](item, selected, trigger) {
    if (selected === item[SELECTED])
      return;
    const prev = this.selected;
    item[SELECTED] = selected;
    const changed = !selected ? prev === item : prev !== item;
    if (changed) {
      if (prev)
        prev[SELECTED] = false;
      this.dispatchEvent(
        new std.DOMEvent("change", {
          detail: { prev, current: this.selected },
          trigger
        })
      );
    }
  }
};

// src/player/media/quality/video-quality.ts
init_symbols();
init_symbols2();
var VideoQualityList = class extends SelectList {
  constructor() {
    super(...arguments);
    this._auto = false;
    /**
     * Configures quality switching:
     *
     * - `current`: Trigger an immediate quality level switch. This will abort the current fragment
     * request if any, flush the whole buffer, and fetch fragment matching with current position
     * and requested quality level.
     *
     * - `next`: Trigger a quality level switch for next fragment. This could eventually flush
     * already buffered next fragment.
     *
     * - `load`: Set quality level for next loaded fragment.
     *
     * @see {@link https://vidstack.io/docs/player/core-concepts/quality#switch}
     * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#quality-switch-control-api}
     */
    this.switch = "current";
  }
  /**
   * Whether automatic quality selection is enabled.
   */
  get auto() {
    return this._auto || this.readonly;
  }
  /* @internal */
  [(LIST_ON_USER_SELECT)]() {
    this[SET_AUTO_QUALITY](false);
  }
  /* @internal */
  [LIST_ON_RESET](trigger) {
    this[SET_AUTO_QUALITY](false, trigger);
  }
  /**
   * Request automatic quality selection (if supported). This will be a no-op if the list is
   * `readonly` as that already implies auto-selection.
   */
  autoSelect(trigger) {
    if (this.readonly || this._auto || !this[ENABLE_AUTO_QUALITY])
      return;
    this[ENABLE_AUTO_QUALITY]();
    this[SET_AUTO_QUALITY](true, trigger);
  }
  /* @internal */
  [SET_AUTO_QUALITY](auto, trigger) {
    if (this._auto === auto)
      return;
    this._auto = auto;
    this.dispatchEvent(
      new std.DOMEvent("auto-change", {
        detail: auto,
        trigger
      })
    );
  }
};

// src/player/media/remote-control.ts
init_text_track();
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
    var _a6;
    if (this._player)
      return this._player;
    (_a6 = target ?? this._target) == null ? void 0 : _a6.dispatchEvent(
      new std.DOMEvent("find-media-player", {
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
    const request = new std.DOMEvent(type, {
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
function getRange(fnName, valueIndex, ranges, rangeIndex) {
  return ranges[rangeIndex][valueIndex] || Infinity;
}
function buildTimeRanges(ranges) {
  if (std.isUndefined(ranges) || ranges.length === 0) {
    return { length: 0, start: emptyTimeRange, end: emptyTimeRange };
  }
  return {
    length: ranges.length,
    start: getRange.bind(null, "start", 0, ranges),
    end: getRange.bind(null, "end", 1, ranges)
  };
}
function createTimeRanges(start, end) {
  if (std.isArray(start)) {
    return buildTimeRanges(start);
  } else if (std.isUndefined(start) || std.isUndefined(end)) {
    return buildTimeRanges();
  }
  return buildTimeRanges([[start, end]]);
}
function getTimeRangesStart(ranges) {
  if (!ranges.length)
    return null;
  let min = ranges.start(0);
  for (let i = 1; i < ranges.length; i++) {
    const value = ranges.start(i);
    if (value < min)
      min = value;
  }
  return min;
}
function getTimeRangesEnd(ranges) {
  if (!ranges.length)
    return null;
  let max = ranges.end(0);
  for (let i = 1; i < ranges.length; i++) {
    const value = ranges.end(i);
    if (value > max)
      max = value;
  }
  return max;
}
function emptyTimeRange() {
  throw new Error("empty");
}

// src/player/media/store.ts
var mediaStore = maverick_js.createStore({
  audioTracks: [],
  audioTrack: null,
  autoplay: false,
  autoplayError: void 0,
  buffered: createTimeRanges(),
  duration: 0,
  canLoad: false,
  canFullscreen: false,
  canPictureInPicture: false,
  canPlay: false,
  controls: false,
  crossorigin: null,
  poster: "",
  currentTime: 0,
  ended: false,
  error: void 0,
  fullscreen: false,
  loop: false,
  logLevel: "silent",
  mediaType: "unknown",
  muted: false,
  paused: true,
  played: createTimeRanges(),
  playing: false,
  playsinline: false,
  pictureInPicture: false,
  preload: "metadata",
  playbackRate: 1,
  qualities: [],
  quality: null,
  autoQuality: false,
  canSetQuality: true,
  seekable: createTimeRanges(),
  seeking: false,
  source: { src: "", type: "" },
  sources: [],
  started: false,
  textTracks: [],
  textTrack: null,
  volume: 1,
  waiting: false,
  get viewType() {
    return this.providedViewType !== "unknown" ? this.providedViewType : this.mediaType;
  },
  get streamType() {
    return this.providedStreamType !== "unknown" ? this.providedStreamType : this.inferredStreamType;
  },
  get currentSrc() {
    return this.source;
  },
  get bufferedStart() {
    return getTimeRangesStart(this.buffered) ?? 0;
  },
  get bufferedEnd() {
    return getTimeRangesEnd(this.buffered) ?? 0;
  },
  get seekableStart() {
    return getTimeRangesStart(this.seekable) ?? 0;
  },
  get seekableEnd() {
    return this.canPlay ? getTimeRangesEnd(this.seekable) ?? Infinity : 0;
  },
  get seekableWindow() {
    return Math.max(0, this.seekableEnd - this.seekableStart);
  },
  // ~~ user props ~~
  userIdle: false,
  userBehindLiveEdge: false,
  // ~~ live props ~~
  liveEdgeTolerance: 10,
  minLiveDVRWindow: 60,
  get canSeek() {
    return /unknown|on-demand|:dvr/.test(this.streamType) && Number.isFinite(this.seekableWindow) && (!this.live || /:dvr/.test(this.streamType) && this.seekableWindow >= this.minLiveDVRWindow);
  },
  get live() {
    return this.streamType.includes("live") || !Number.isFinite(this.duration);
  },
  get liveEdgeStart() {
    return this.live && Number.isFinite(this.seekableEnd) ? Math.max(0, (this.liveSyncPosition ?? this.seekableEnd) - this.liveEdgeTolerance) : 0;
  },
  get liveEdge() {
    return this.live && (!this.canSeek || !this.userBehindLiveEdge && this.currentTime >= this.liveEdgeStart);
  },
  get liveEdgeWindow() {
    return this.live && Number.isFinite(this.seekableEnd) ? this.seekableEnd - this.liveEdgeStart : 0;
  },
  // ~~ internal props ~~
  attemptingAutoplay: false,
  canLoadPoster: null,
  providedViewType: "unknown",
  providedStreamType: "unknown",
  inferredStreamType: "unknown",
  liveSyncPosition: null
});

// src/player/media/tracks/audio-tracks.ts
var AudioTrackList = class extends SelectList {
  getById(id) {
    if (id === "")
      return null;
    return this._items.find((track) => track.id === id) ?? null;
  }
};

// src/player/media/tracks/text/render/text-renderer.ts
init_symbols3();
init_text_track();

// src/player/media/tracks/text/render/native-text-renderer.ts
init_symbols3();
var NativeTextRenderer = class {
  constructor() {
    this.priority = 0;
    this._display = true;
    this._video = null;
    this._track = null;
    this._tracks = /* @__PURE__ */ new Set();
  }
  canRender() {
    return true;
  }
  attach(video) {
    this._video = video;
    if (!video.crossOrigin)
      video.crossOrigin = "anonymous";
    video.textTracks.onchange = this._onChange.bind(this);
  }
  addTrack(track) {
    this._tracks.add(track);
    this._attachTrack(track);
  }
  removeTrack(track) {
    var _a6, _b2;
    (_b2 = (_a6 = track[TEXT_TRACK_NATIVE]) == null ? void 0 : _a6.remove) == null ? void 0 : _b2.call(_a6);
    track[TEXT_TRACK_NATIVE] = null;
    this._tracks.delete(track);
  }
  changeTrack(track) {
    var _a6;
    const prev = (_a6 = this._track) == null ? void 0 : _a6[TEXT_TRACK_NATIVE], current = track == null ? void 0 : track[TEXT_TRACK_NATIVE];
    if (prev && this._track !== track)
      prev.track.mode = "disabled";
    if (current)
      current.track.mode = "showing";
    this._track = track;
  }
  setDisplay(display) {
    this._display = display;
  }
  detach() {
    if (this._video)
      this._video.textTracks.onchange = null;
    for (const track of this._tracks)
      this.removeTrack(track);
    this._tracks.clear();
    this._video = null;
    this._track = null;
  }
  _attachTrack(track) {
    if (!this._video)
      return;
    const el = track[TEXT_TRACK_NATIVE] ??= this._createTrackElement(track);
    if (el instanceof HTMLElement)
      this._video.append(el);
  }
  _createTrackElement(track) {
    const el = document.createElement("track");
    el.src = "https://cdn.jsdelivr.net/npm/vidstack/empty.vtt";
    el.id = track.id;
    el.label = track.label;
    el.kind = track.kind;
    el.default = track.default;
    track.language && (el.srclang = track.language);
    return el;
  }
  _copyCues(track, native) {
    var _a6;
    if ((_a6 = native.cues) == null ? void 0 : _a6.length)
      return;
    for (const cue of track.cues)
      native.addCue(cue);
  }
  _onChange(event) {
    var _a6;
    for (const track of this._tracks) {
      const nativeTrack = (_a6 = track[TEXT_TRACK_NATIVE]) == null ? void 0 : _a6.track;
      if (!nativeTrack)
        continue;
      if (!this._display) {
        nativeTrack.mode = "disabled";
        continue;
      }
      if (nativeTrack.mode === "showing") {
        this._copyCues(track, nativeTrack);
        track.setMode("showing", event);
      } else if (track.mode === "showing") {
        track.setMode("disabled", event);
      }
    }
  }
};

// src/player/media/tracks/text/render/text-renderer.ts
var TextRenderers = class {
  constructor({ $store, $iosControls, textTracks }) {
    this._video = null;
    this._renderers = [];
    this._nativeDisplay = false;
    this._nativeRenderer = null;
    this._customRenderer = null;
    this._textTracks = textTracks;
    maverick_js.effect(() => {
      this._nativeDisplay = $store.controls || $iosControls();
      this._update();
    });
    maverick_js.onDispose(this._detach.bind(this));
    std.listenEvent(textTracks, "add", (event) => this._addNativeTrack(event.detail));
    std.listenEvent(textTracks, "remove", (event) => this._removeNativeTrack(event.detail));
    std.listenEvent(textTracks, "mode-change", this._update.bind(this));
  }
  add(renderer) {
    this._renderers.push(renderer);
    this._update();
  }
  remove(renderer) {
    this._renderers.splice(this._renderers.indexOf(renderer), 1);
    this._update();
  }
  /* @internal */
  [ATTACH_VIDEO](video) {
    requestAnimationFrame(() => {
      this._video = video;
      if (video) {
        this._nativeRenderer = new NativeTextRenderer();
        this._nativeRenderer.attach(video);
        for (const track of this._textTracks)
          this._addNativeTrack(track);
      }
      this._update();
    });
  }
  _addNativeTrack(track) {
    var _a6;
    if (!isTrackCaptionKind(track))
      return;
    (_a6 = this._nativeRenderer) == null ? void 0 : _a6.addTrack(track);
  }
  _removeNativeTrack(track) {
    var _a6;
    if (!isTrackCaptionKind(track))
      return;
    (_a6 = this._nativeRenderer) == null ? void 0 : _a6.removeTrack(track);
  }
  _update() {
    var _a6, _b2, _c2;
    if (!this._video) {
      this._detach();
      return;
    }
    const currentTrack = this._textTracks.selected;
    if (this._nativeDisplay || (currentTrack == null ? void 0 : currentTrack[TEXT_TRACK_NATIVE_HLS])) {
      (_a6 = this._customRenderer) == null ? void 0 : _a6.changeTrack(null);
      this._nativeRenderer.setDisplay(true);
      this._nativeRenderer.changeTrack(currentTrack);
      return;
    }
    this._nativeRenderer.setDisplay(false);
    this._nativeRenderer.changeTrack(null);
    if (!currentTrack) {
      (_b2 = this._customRenderer) == null ? void 0 : _b2.changeTrack(null);
      return;
    }
    const customRenderer = this._renderers.sort((a, b) => a.priority - b.priority).find((loader) => loader.canRender(currentTrack));
    if (this._customRenderer !== customRenderer) {
      (_c2 = this._customRenderer) == null ? void 0 : _c2.detach();
      customRenderer == null ? void 0 : customRenderer.attach(this._video);
      this._customRenderer = customRenderer ?? null;
    }
    customRenderer == null ? void 0 : customRenderer.changeTrack(currentTrack);
  }
  _detach() {
    var _a6, _b2;
    (_a6 = this._nativeRenderer) == null ? void 0 : _a6.detach();
    this._nativeRenderer = null;
    (_b2 = this._customRenderer) == null ? void 0 : _b2.detach();
    this._customRenderer = null;
  }
};

// src/player/media/controller/create-controller.ts
init_symbols3();
init_symbols();
init_symbols3();
init_text_track();
var TextTrackList = class extends List {
  constructor() {
    super(...arguments);
    this._canLoad = false;
    this._default = null;
    this._handleTrackModeChange = this._onTrackModeChange.bind(this);
  }
  get default() {
    return this._default;
  }
  get selected() {
    const track = this._items.find((t) => t.mode === "showing" && isTrackCaptionKind(t));
    return track ?? null;
  }
  add(init, trigger) {
    const isTrack = init instanceof TextTrack, track = isTrack ? init : new TextTrack(init);
    if (this._default && init.default)
      delete init.default;
    track.addEventListener("mode-change", this._handleTrackModeChange);
    this[LIST_ADD](track, trigger);
    if (this._canLoad)
      track[TEXT_TRACK_CAN_LOAD]();
    if (init.default) {
      this._default = track;
      track.mode = "showing";
    }
    return this;
  }
  remove(track, trigger) {
    if (!this._items.includes(track))
      return;
    if (track === this._default)
      this._default = null;
    track.mode = "disabled";
    track[TEXT_TRACK_ON_MODE_CHANGE] = null;
    track.removeEventListener("mode-change", this._handleTrackModeChange);
    this[LIST_REMOVE](track, trigger);
    return this;
  }
  clear(trigger) {
    for (const track of this._items)
      this.remove(track, trigger);
    return this;
  }
  getById(id) {
    return this._items.find((track) => track.id === id) ?? null;
  }
  getByKind(kind) {
    const kinds = Array.isArray(kind) ? kind : [kind];
    return this._items.filter((track) => kinds.includes(track.kind));
  }
  /* @internal */
  [TEXT_TRACK_CAN_LOAD]() {
    if (this._canLoad)
      return;
    for (const track of this._items)
      track[TEXT_TRACK_CAN_LOAD]();
    this._canLoad = true;
  }
  _onTrackModeChange(event) {
    const track = event.detail;
    if (track.mode === "showing") {
      const kinds = isTrackCaptionKind(track) ? ["captions", "subtitles"] : [track.kind];
      for (const t of this._items) {
        if (t.mode === "showing" && t != track && kinds.includes(t.kind)) {
          t.mode = "disabled";
        }
      }
    }
    this.dispatchEvent(
      new std.DOMEvent("mode-change", {
        detail: event.detail,
        trigger: event
      })
    );
  }
};

// src/player/media/controller/can-load.ts
function useMediaCanLoad($controller, $load, callback) {
  return;
}
function createMediaControllerDelegate({ $player, $store, logger }, handle) {
  {
    return {
      dispatch: std.noop,
      ready: std.noop
    };
  }
}
var RequestQueue = class {
  constructor() {
    this._serving = false;
    this._pending = std.deferredPromise();
    this._queue = /* @__PURE__ */ new Map();
  }
  /**
   * The number of callbacks that are currently in queue.
   */
  get _size() {
    return this._queue.size;
  }
  /**
   * Whether items in the queue are being served immediately, otherwise they're queued to
   * be processed later.
   */
  get _isServing() {
    return this._serving;
  }
  /**
   * Waits for the queue to be flushed (ie: start serving).
   */
  async _waitForFlush() {
    if (this._serving)
      return;
    await this._pending.promise;
  }
  /**
   * Queue the given `callback` to be invoked at a later time by either calling the `serve()` or
   * `start()` methods. If the queue has started serving (i.e., `start()` was already called),
   * then the callback will be invoked immediately.
   *
   * @param key - Uniquely identifies this callback so duplicates are ignored.
   * @param callback - The function to call when this item in the queue is being served.
   */
  _enqueue(key2, callback) {
    if (this._serving) {
      callback();
      return;
    }
    this._queue.delete(key2);
    this._queue.set(key2, callback);
  }
  /**
   * Invokes the callback with the given `key` in the queue (if it exists).
   */
  _serve(key2) {
    var _a6;
    (_a6 = this._queue.get(key2)) == null ? void 0 : _a6();
    this._queue.delete(key2);
  }
  /**
   * Flush all queued items and start serving future requests immediately until `stop()` is called.
   */
  _start() {
    this._flush();
    this._serving = true;
    if (this._queue.size > 0)
      this._flush();
  }
  /**
   * Stop serving requests, they'll be queued until you begin processing again by calling `start()`.
   */
  _stop() {
    this._serving = false;
  }
  /**
   * Stop serving requests, empty the request queue, and release any promises waiting for the
   * queue to flush.
   */
  _reset() {
    this._stop();
    this._queue.clear();
    this._release();
  }
  _flush() {
    for (const key2 of this._queue.keys())
      this._serve(key2);
    this._release();
  }
  _release() {
    this._pending.resolve();
    this._pending = std.deferredPromise();
  }
};

// src/player/media/controller/provider-delegate.ts
init_number();
function useMediaProviderDelegate({ $provider, $store: $media }, requestManager, {
  $paused,
  $volume,
  $muted,
  $currentTime,
  $playsinline,
  $playbackRate
}) {
  const canPlayQueue = new RequestQueue();
  maverick_js.effect(() => {
    if ($media.canPlay && $provider())
      canPlayQueue._start();
    else
      canPlayQueue._stop();
  });
  maverick_js.effect(() => setMuted($muted()));
  maverick_js.effect(() => setPaused($paused()));
  maverick_js.effect(() => setVolume($volume()));
  maverick_js.effect(() => setCurrentTime($currentTime()));
  maverick_js.effect(() => setPlaysinline($playsinline()));
  maverick_js.effect(() => setPlaybackRate($playbackRate()));
  function setPaused(paused) {
    if (paused)
      canPlayQueue._enqueue("paused", requestManager._pause);
    else
      canPlayQueue._enqueue("paused", requestManager._play);
  }
  function setVolume(volume) {
    const newVolume = clampNumber(0, volume, 1);
    canPlayQueue._enqueue("volume", () => $provider().volume = newVolume);
  }
  function setMuted(muted) {
    canPlayQueue._enqueue("muted", () => $provider().muted = muted);
  }
  function setCurrentTime(currentTime) {
    canPlayQueue._enqueue("currentTime", () => {
      const adapter = $provider();
      if (currentTime !== adapter.currentTime) {
        maverick_js.peek(() => {
          const boundTime = Math.min(
            Math.max($media.seekableStart + 0.1, currentTime),
            $media.seekableEnd - 0.1
          );
          if (Number.isFinite(boundTime))
            adapter.currentTime = boundTime;
        });
      }
    });
  }
  function setPlaysinline(playsinline) {
    canPlayQueue._enqueue("playsinline", () => $provider().playsinline = playsinline);
  }
  function setPlaybackRate(rate) {
    canPlayQueue._enqueue("rate", () => $provider().playbackRate = rate);
  }
  const delegate = {};
  const setters = {
    paused: setPaused,
    muted: setMuted,
    volume: setVolume,
    currentTime: setCurrentTime,
    playsinline: setPlaysinline,
    playbackRate: setPlaybackRate
  };
  for (const prop of Object.keys(setters)) {
    Object.defineProperty(delegate, prop, {
      get: () => $media[prop],
      set: setters[prop]
    });
  }
  return delegate;
}

// src/foundation/orientation/screen-orientation.ts
init_support();
var CAN_ORIENT_SCREEN = canOrientScreen();
function createScreenOrientationAdapter($target) {
  const $orientation = maverick_js.signal(getScreenOrientation()), $locked = maverick_js.signal(false);
  async function lock(lockType) {
    if (maverick_js.peek($locked))
      return;
    await screen.orientation.lock(lockType);
    $locked.set(true);
  }
  async function unlock() {
    if (!maverick_js.peek($locked))
      return;
    await screen.orientation.unlock();
    $locked.set(false);
  }
  return {
    get orientation() {
      return $orientation();
    },
    get locked() {
      return $locked();
    },
    get supported() {
      return CAN_ORIENT_SCREEN;
    },
    lock,
    unlock
  };
}
function getScreenOrientation() {
  return void 0 ;
}

// src/foundation/queue/queue.ts
var Queue = class {
  constructor() {
    this._queue = /* @__PURE__ */ new Map();
  }
  /**
   * Queue the given `item` under the given `key` to be processed at a later time by calling
   * `serve(key)`.
   */
  _enqueue(key2, item) {
    if (!this._queue.has(key2))
      this._queue.set(key2, /* @__PURE__ */ new Set());
    this._queue.get(key2).add(item);
  }
  /**
   * Process all items in queue for the given `key`.
   */
  _serve(key2, callback) {
    const items = this._queue.get(key2);
    if (items)
      for (const item of items)
        callback(item);
    this._queue.delete(key2);
  }
  /**
   * Removes all queued items under the given `key`.
   */
  _delete(key2) {
    this._queue.delete(key2);
  }
  /**
   * The number of items currently queued under the given `key`.
   */
  _size(key2) {
    var _a6;
    return ((_a6 = this._queue.get(key2)) == null ? void 0 : _a6.size) ?? 0;
  }
  /**
   * Clear all items in the queue.
   */
  _reset() {
    this._queue.clear();
  }
};

// src/player/media/controller/request-manager.ts
init_error();
var STOP_IDLE_EVENTS = ["pointerup", "pointermove", "focus", "keydown", "playing"];
function createMediaUser($controller, $media) {
  let idleTimeout, delay = 2e3, trigger, $idle = maverick_js.signal(false), $userPaused = maverick_js.signal(false), $paused = maverick_js.computed(() => $userPaused() || $media.paused);
  maverick_js.effect(() => {
    const target = $controller();
    if (!target)
      return;
    maverick_js.effect(() => {
      if ($paused())
        return;
      for (const eventType of STOP_IDLE_EVENTS) {
        std.listenEvent(target, eventType, stopIdling);
      }
    });
    maverick_js.effect(() => {
      window.clearTimeout(idleTimeout);
      const idle = $idle() && !$paused();
      $media.userIdle = idle;
      std.dispatchEvent(target, "user-idle-change", { detail: idle, trigger });
      trigger = void 0;
    });
    return () => $idle.set(false);
  });
  function stopIdling(event) {
    if ($idle())
      trigger = event;
    $idle.set(false);
    window.clearTimeout(idleTimeout);
    idleTimeout = window.setTimeout(() => $idle.set(!maverick_js.peek($paused)), delay);
  }
  return {
    idle: {
      get idling() {
        return $idle();
      },
      get paused() {
        return $userPaused();
      },
      set paused(paused) {
        $userPaused.set(paused);
      },
      get delay() {
        return delay;
      },
      set delay(newDelay) {
        delay = newDelay;
      }
    }
  };
}

// src/player/media/controller/request-manager.ts
function createMediaRequestManager({ $player, $store: $media, $provider, logger, qualities, audioTracks, textTracks }, handler, requests, $props) {
  const user = createMediaUser($player, $media), orientation = createScreenOrientationAdapter(); createFullscreenAdapter($player);
  {
    return {
      _user: user,
      _orientation: orientation,
      _play: std.noop,
      _pause: std.noop,
      _seekToLiveEdge: std.noop,
      _enterFullscreen: std.noop,
      _exitFullscreen: std.noop,
      _enterPictureInPicture: std.noop,
      _exitPictureInPicture: std.noop
    };
  }
}
var MediaRequestContext = class {
  constructor() {
    this._queue = new Queue();
    this._$isSeeking = maverick_js.signal(false);
    this._$isLooping = maverick_js.signal(false);
    this._$isReplay = maverick_js.signal(false);
  }
};

// src/player/media/controller/state-manager.ts
init_symbols();
init_symbols3();
function createMediaStateManager({
  $player,
  $loader,
  $provider,
  $store: $media,
  qualities,
  audioTracks,
  textTracks,
  logger
}, requests) {
  return { handle: std.noop };
}

// src/player/media/controller/create-controller.ts
function createMediaController(props) {
  const context = {
    $player: maverick_js.signal(null),
    $loader: maverick_js.signal(null),
    $provider: maverick_js.signal(null),
    $store: mediaStore.create(),
    qualities: new VideoQualityList(),
    audioTracks: new AudioTrackList(),
    $$props: {
      $src: props.$src,
      $textTracks: props.$textTracks,
      $preferNativeHLS: props.$preferNativeHLS
    }
  };
  maverick_js.provideContext(mediaContext, context);
  context.remote = new MediaRemoteControl(void 0);
  const $store = context.$store;
  context.$iosControls = maverick_js.computed(
    () => !canFullscreen() && $store.mediaType === "video" && ($store.controls && !props.$playsinline() || $store.fullscreen)
  );
  context.textTracks = new TextTrackList();
  context.textRenderers = new TextRenderers(context);
  const stop = maverick_js.effect(() => {
    if (!context.$store.canLoad)
      return;
    context.textTracks[TEXT_TRACK_CAN_LOAD]();
    stop();
  });
  new MediaRequestContext(); const stateManager = createMediaStateManager(context), requestManager = createMediaRequestManager(context), delegate = createMediaControllerDelegate(context, stateManager.handle), providerDelegate = useMediaProviderDelegate(context, requestManager, props);
  context.delegate = delegate;
  const providedProps = {
    viewType: "providedViewType",
    streamType: "providedStreamType"
  };
  for (const prop of Object.keys(props)) {
    const propName = prop.slice(1);
    if (propName in $store)
      $store[providedProps[propName] ?? propName] = props[prop]();
  }
  maverick_js.effect(() => {
    $store.providedViewType = props.$viewType();
    $store.providedStreamType = props.$streamType();
  });
  $store.muted = props.$muted() || props.$volume() === 0;
  useMediaCanLoad(context.$player, props.$load);
  function startLoadingMedia() {
    delegate.dispatch("can-load");
  }
  return {
    _context: context,
    _start: startLoadingMedia,
    _request: requestManager,
    _provider: providerDelegate
  };
}

// src/player/element/element.ts
init_text_track();
function isHTMLVideoElement(element) {
  return false;
}
function isHTMLMediaElement(element) {
  return isHTMLVideoElement();
}

// src/player/element/keyboard.ts
var MEDIA_KEY_SHORTCUTS = {
  togglePaused: "k Space",
  toggleMuted: "m",
  toggleFullscreen: "f",
  togglePictureInPicture: "i",
  toggleCaptions: "c",
  seekBackward: "ArrowLeft",
  seekForward: "ArrowRight",
  volumeUp: "ArrowUp",
  volumeDown: "ArrowDown"
};
var MODIFIER_KEYS = /* @__PURE__ */ new Set(["Shift", "Alt", "Meta", "Control"]);
var BUTTON_SELECTORS = 'button, [role="button"]';
var IGNORE_SELECTORS = 'input, textarea, select, [contenteditable], [role^="menuitem"]';
function useKeyboard({ $player, $store: $media, ariaKeys, remote }, { $keyShortcuts, $keyDisabled, $keyTarget }) {
  maverick_js.effect(() => {
    const player = $player();
    if (!player || $keyDisabled())
      return;
    const target = $keyTarget() === "player" ? player : document, $active = maverick_js.signal(false);
    if (target === player) {
      std.listenEvent(player, "focusin", () => $active.set(true));
      std.listenEvent(player, "focusout", (event) => {
        if (!player.contains(event.target))
          $active.set(false);
      });
    } else {
      if (!maverick_js.peek($active)) {
        $active.set(document.querySelector("media-player") === player);
      }
      std.listenEvent(document, "focusin", (event) => {
        const activePlayer = event.composedPath().find((el) => el instanceof Element && el.localName === "media-player");
        if (activePlayer !== void 0)
          $active.set(player === activePlayer);
      });
    }
    function onPreventVideoKeys(event) {
      if (isHTMLMediaElement(event.target) ) ;
    }
    maverick_js.effect(() => {
      if (!$active())
        return;
      std.listenEvent(target, "keyup", onKeyUp);
      std.listenEvent(target, "keydown", onKeyDown);
      std.listenEvent(target, "keydown", onPreventVideoKeys, { capture: true });
    });
    let seekTotal;
    function calcSeekAmount(event, type) {
      const seekBy = event.shiftKey ? 10 : 5;
      return seekTotal = Math.max(
        0,
        Math.min(
          (seekTotal ?? $media.currentTime) + (type === "seekForward" ? +seekBy : -seekBy),
          $media.duration
        )
      );
    }
    let timeSlider = null;
    function forwardTimeKeyEvent(event) {
      timeSlider == null ? void 0 : timeSlider.dispatchEvent(new std.DOMEvent(event.type, { trigger: event }));
    }
    function seeking(event, type) {
      if (!$media.canSeek)
        return;
      if (!timeSlider)
        timeSlider = player.querySelector("media-time-slider");
      if (timeSlider) {
        forwardTimeKeyEvent(event);
      } else {
        remote.seeking(calcSeekAmount(event, type), event);
      }
    }
    function onKeyUp(event) {
      const focused = document.activeElement, sliderFocused = focused == null ? void 0 : focused.hasAttribute("data-media-slider");
      if (!event.key || !$media.canSeek || sliderFocused || (focused == null ? void 0 : focused.matches(IGNORE_SELECTORS))) {
        return;
      }
      const method = getMatchingMethod(event);
      if (method == null ? void 0 : method.startsWith("seek")) {
        event.preventDefault();
        event.stopPropagation();
        if (timeSlider) {
          forwardTimeKeyEvent(event);
          timeSlider = null;
        } else {
          remote.seek(seekTotal, event);
          seekTotal = null;
        }
      }
      if (method == null ? void 0 : method.startsWith("volume")) {
        const volumeSlider = player.querySelector("media-volume-slider");
        volumeSlider == null ? void 0 : volumeSlider.dispatchEvent(new std.DOMEvent("keyup", { trigger: event }));
      }
    }
    function onKeyDown(event) {
      var _a6;
      if (!event.key || MODIFIER_KEYS.has(event.key))
        return;
      const focused = document.activeElement;
      if ((focused == null ? void 0 : focused.matches(IGNORE_SELECTORS)) || std.isKeyboardClick(event) && (focused == null ? void 0 : focused.matches(BUTTON_SELECTORS))) {
        return;
      }
      const sliderFocused = focused == null ? void 0 : focused.hasAttribute("data-media-slider"), method = getMatchingMethod(event);
      if (!method && /[0-9]/.test(event.key) && !sliderFocused) {
        event.preventDefault();
        event.stopPropagation();
        remote.seek($media.duration / 10 * Number(event.key), event);
        return;
      }
      if (!method || /volume|seek/.test(method) && sliderFocused)
        return;
      event.preventDefault();
      event.stopPropagation();
      switch (method) {
        case "seekForward":
        case "seekBackward":
          seeking(event, method);
          break;
        case "volumeUp":
        case "volumeDown":
          const volumeSlider = player.querySelector("media-volume-slider");
          if (volumeSlider) {
            volumeSlider.dispatchEvent(new std.DOMEvent("keydown", { trigger: event }));
          } else {
            const value = event.shiftKey ? 0.1 : 0.05;
            remote.changeVolume($media.volume + (method === "volumeUp" ? +value : -value), event);
          }
          break;
        case "toggleFullscreen":
          remote.toggleFullscreen("prefer-media", event);
          break;
        default:
          (_a6 = remote[method]) == null ? void 0 : _a6.call(remote, event);
      }
    }
    function getMatchingMethod(event) {
      const keyShortcuts = { ...$keyShortcuts(), ...ariaKeys };
      return Object.keys(keyShortcuts).find(
        (method) => keyShortcuts[method].split(" ").some(
          (keys) => replaceSymbolKeys(keys).replace(/Control/g, "Ctrl").split("+").every(
            (key2) => MODIFIER_KEYS.has(key2) ? event[key2.toLowerCase() + "Key"] : event.key === key2.replace("Space", " ")
          )
        )
      );
    }
  });
}
var SYMBOL_KEY_MAP = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
function replaceSymbolKeys(key2) {
  return key2.replace(/Shift\+(\d)/g, (_, num) => SYMBOL_KEY_MAP[num - 1]);
}
var mediaPlayerProps = {
  autoplay: { initial: false },
  aspectRatio: {
    initial: null,
    type: {
      from(value) {
        if (!value)
          return null;
        const [width, height] = value.split("/").map(Number);
        return +(width / height).toFixed(4);
      }
    }
  },
  controls: { initial: false },
  currentTime: { initial: 0 },
  crossorigin: {
    initial: null,
    // Needs to be fixed in Maverick.
    type: element.STRING
  },
  fullscreenOrientation: {},
  load: { initial: "visible" },
  logLevel: { initial: "silent" },
  loop: { initial: false },
  muted: { initial: false },
  paused: { initial: true },
  playsinline: { initial: false },
  playbackRate: { initial: 1 },
  poster: { initial: "" },
  preload: { initial: "metadata" },
  preferNativeHLS: {
    initial: false,
    attribute: "prefer-native-hls"
  },
  src: { initial: "" },
  userIdleDelay: { initial: 2e3 },
  viewType: { initial: "unknown" },
  streamType: { initial: "unknown" },
  volume: { initial: 1 },
  liveEdgeTolerance: { initial: 10 },
  minLiveDVRWindow: { initial: 60 },
  keyDisabled: { initial: false },
  keyTarget: { initial: "player" },
  keyShortcuts: { initial: MEDIA_KEY_SHORTCUTS },
  textTracks: { initial: [] }
};

// src/player/element/element.ts
var MEDIA_ATTRIBUTES = [
  "autoplay",
  "autoplayError",
  "canFullscreen",
  "canPictureInPicture",
  "canLoad",
  "canPlay",
  "canSeek",
  "ended",
  "error",
  "fullscreen",
  "loop",
  "live",
  "liveEdge",
  "mediaType",
  "muted",
  "paused",
  "pictureInPicture",
  "playing",
  "playsinline",
  "seeking",
  "started",
  "streamType",
  "userIdle",
  "viewType",
  "waiting"
];
var PlayerDefinition = element.defineCustomElement({
  tagName: "media-player",
  props: mediaPlayerProps,
  setup({ host, props, accessors }) {
    const scope = maverick_js.getScope(), controller = createMediaController(props), context = controller._context, $media = context.$store;
    element.onAttach(() => {
      host.el.setAttribute("tabindex", "0");
      if (!host.el.hasAttribute("aria-label")) {
        host.el.setAttribute("aria-label", "Media Player");
      }
      context.$player.set(host.el);
      context.remote.setTarget(host.el);
      context.remote.setPlayer(host.el);
      std.listenEvent(host.el, "find-media-player", ({ detail }) => detail(host.el));
    });
    element.onConnect(() => {
      std.dispatchEvent(host.el, "media-player-connect", {
        detail: host.el,
        bubbles: true,
        composed: true
      });
      window.requestAnimationFrame(() => {
        if (std.isNull($media.canLoadPoster))
          $media.canLoadPoster = true;
      });
    });
    context.ariaKeys = {};
    context.$keyShortcuts = props.$keyShortcuts;
    useKeyboard(context, props);
    useFocusVisible(host.$el);
    const $attrs = {
      "aspect-ratio": props.$aspectRatio,
      "data-captions": () => !!$media.textTrack && isTrackCaptionKind($media.textTrack),
      "data-ios-controls": context.$iosControls
    };
    const mediaAttrName = {
      canPictureInPicture: "can-pip",
      pictureInPicture: "pip"
    };
    for (const prop of MEDIA_ATTRIBUTES) {
      $attrs["data-" + (mediaAttrName[prop] ?? std.camelToKebabCase(prop))] = () => $media[prop];
    }
    host.setAttributes($attrs);
    host.setCSSVars({
      "--media-aspect-ratio": () => {
        const ratio = props.$aspectRatio();
        return ratio ? +ratio.toFixed(4) : null;
      },
      "--media-buffered": () => +$media.bufferedEnd.toFixed(3),
      "--media-current-time": () => +$media.currentTime.toFixed(3),
      "--media-duration": () => Number.isFinite($media.duration) ? +$media.duration.toFixed(3) : 0
    });
    maverick_js.onDispose(() => {
      std.dispatchEvent(host.el, "destroy");
    });
    return std.mergeProperties(
      accessors(),
      {
        get user() {
          return controller._request._user;
        },
        get orientation() {
          return controller._request._orientation;
        },
        get provider() {
          return context.$provider();
        },
        get qualities() {
          return context.qualities;
        },
        get audioTracks() {
          return context.audioTracks;
        },
        get textTracks() {
          return context.textTracks;
        },
        get textRenderers() {
          return context.textRenderers;
        },
        get $store() {
          return $media;
        },
        state: new Proxy($media, {
          // @ts-expect-error
          set: std.noop
        }),
        subscribe: (callback) => maverick_js.scoped(() => maverick_js.effect(() => callback($media)), scope),
        startLoading: controller._start,
        play: controller._request._play,
        pause: controller._request._pause,
        seekToLiveEdge: controller._request._seekToLiveEdge,
        enterFullscreen: controller._request._enterFullscreen,
        exitFullscreen: controller._request._exitFullscreen,
        enterPictureInPicture: controller._request._enterPictureInPicture,
        exitPictureInPicture: controller._request._exitPictureInPicture
      },
      controller._provider
    );
  }
});

// src/player/media/outlet/sources.ts
init_network();

// src/player/media/providers/audio/loader.tsx
init_mime();
var $$_templ = ["<!$><audio", "", "", "", "", ' preload="none"></audio>'];
var AudioProviderLoader = class {
  canPlay({ src, type }) {
    return std.isString(src) ? AUDIO_EXTENSIONS.test(src) || AUDIO_TYPES.has(type) || src.startsWith("blob:") && type === "audio/object" : type === "audio/object";
  }
  mediaType() {
    return "audio";
  }
  async load() {
    return new (await Promise.resolve().then(() => (init_provider2(), provider_exports))).AudioProvider(this._audio);
  }
  render($store) {
    {
      const src = $store.source.src;
      return ssr.$$_ssr(
        $$_templ,
        ssr.$$_attr("src", std.isString(src) ? src : null),
        ssr.$$_attr("muted", $store.muted),
        ssr.$$_attr("controls", $store.controls),
        ssr.$$_attr("crossorigin", $store.crossorigin),
        ssr.$$_attr("playsinline", $store.playsinline)
      );
    }
  }
};

// src/player/media/providers/hls/loader.tsx
init_mime();
init_network();
init_support();

// src/player/media/providers/video/loader.tsx
init_mime();
var $$_templ2 = ["<!$><video", "", "", "", "", "", ' preload="none"></video>'];
var VideoProviderLoader = class {
  canPlay(src) {
    return std.isString(src.src) ? VIDEO_EXTENSIONS.test(src.src) || VIDEO_TYPES.has(src.type) || src.src.startsWith("blob:") && src.type === "video/object" || isHLSSrc(src) && true : src.type === "video/object";
  }
  mediaType() {
    return "video";
  }
  async load(context) {
    return new (await Promise.resolve().then(() => (init_provider3(), provider_exports2))).VideoProvider(this._video, context);
  }
  render($store) {
    {
      const src = $store.source.src;
      return ssr.$$_ssr(
        $$_templ2,
        ssr.$$_attr("src", std.isString(src) ? src : null),
        ssr.$$_attr("poster", $store.poster),
        ssr.$$_attr("muted", $store.muted),
        ssr.$$_attr("controls", $store.controls),
        ssr.$$_attr("crossorigin", $store.crossorigin),
        ssr.$$_attr("playsinline", $store.playsinline)
      );
    }
  }
};

// src/player/media/providers/hls/loader.tsx
var _HLSProviderLoader = class extends VideoProviderLoader {
  preconnect() {
  }
  canPlay({ src, type }) {
    return _HLSProviderLoader.supported && std.isString(src) && (HLS_VIDEO_EXTENSIONS.test(src) || HLS_VIDEO_TYPES.has(type));
  }
  async load(context) {
    return new (await Promise.resolve().then(() => (init_provider4(), provider_exports3))).HLSProvider(this._video, context);
  }
};
var HLSProviderLoader = _HLSProviderLoader;
HLSProviderLoader.supported = isHLSSupported();

// src/player/media/outlet/sources.ts
function useSourceSelection($domSources, $rendered, context) {
  const { $loader, $store: $media, $provider, delegate, $$props } = context;
  const { $src, $preferNativeHLS } = $$props;
  const HLS_LOADER = new HLSProviderLoader(), VIDEO_LOADER = new VideoProviderLoader(), AUDIO_LOADER = new AudioProviderLoader();
  const $loaders = maverick_js.computed(() => {
    return $preferNativeHLS() ? [VIDEO_LOADER, AUDIO_LOADER, HLS_LOADER] : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER];
  });
  {
    $media.sources = normalizeSrc($src());
    for (const src of $media.sources) {
      const loader = $loaders().find((loader2) => loader2.canPlay(src));
      if (loader) {
        $media.source = src;
        $media.mediaType = loader.mediaType(src);
        $loader.set(loader);
      }
    }
    return;
  }
}
function normalizeSrc(src) {
  return (std.isArray(src) ? src : [!std.isString(src) && "src" in src ? src : { src }]).map(
    ({ src: src2, type }) => ({
      src: src2,
      type: type ?? (!std.isString(src2) || src2.startsWith("blob:") ? "video/object" : "?")
    })
  );
}

// src/player/media/outlet/tracks.ts
init_text_track();
function useTextTracks($domTracks, { textTracks, $$props }) {
  const { $textTracks } = $$props;
  let prevTextTracks = [];
  maverick_js.effect(() => {
    const newTracks = [...$textTracks(), ...$domTracks()];
    for (const newTrack of newTracks) {
      const id = newTrack.id || TextTrack.createId(newTrack);
      if (!textTracks.getById(id)) {
        newTrack.id = id;
        textTracks.add(newTrack);
      }
    }
    for (const oldTrack of prevTextTracks) {
      if (!newTracks.some((t) => t.id === oldTrack.id)) {
        const track = oldTrack.id && textTracks.getById(oldTrack.id);
        if (track)
          textTracks.remove(track);
      }
    }
    prevTextTracks = newTracks;
  });
}

// src/player/media/outlet/element.ts
var OutletDefinition = element.defineCustomElement({
  tagName: "media-outlet",
  setup({ host }) {
    const context = useMedia(), $rendered = maverick_js.signal(false), $domSources = maverick_js.signal([]), $domTracks = maverick_js.signal([]);
    element.onAttach(() => {
      host.el.keepAlive = true;
    });
    element.onConnect(() => {
      function onMutation() {
        const sources = [], tracks = [], children = host.el.children;
        for (const el of children) {
          if (el instanceof HTMLSourceElement) {
            sources.push({
              src: el.src,
              type: el.type
            });
          } else if (el instanceof HTMLTrackElement) {
            tracks.push({
              id: el.id,
              src: el.src,
              kind: el.track.kind,
              language: el.srclang,
              label: el.label,
              default: el.default,
              type: el.getAttribute("data-type")
            });
          }
        }
        $domSources.set(sources);
        $domTracks.set(tracks);
      }
      onMutation();
      const observer = new MutationObserver(onMutation);
      observer.observe(host.el, { childList: true });
      return () => observer.disconnect();
    });
    useSourceSelection($domSources, $rendered, context);
    useTextTracks($domTracks, context);
    return () => () => {
      const loader = context.$loader();
      if (!loader) {
        $rendered.set(false);
        return;
      }
      $rendered.set(true);
      return loader.render(context.$store);
    };
  }
});

// src/define/media-player.ts
element.registerLiteCustomElement(PlayerDefinition);
element.registerLiteCustomElement(OutletDefinition);
