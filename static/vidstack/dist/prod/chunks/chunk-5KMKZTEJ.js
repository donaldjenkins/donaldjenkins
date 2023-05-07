import { VideoProvider } from './chunk-W6G2QAAZ.js';
import { createRAFLoop, LIST_SELECT, LIST_ADD } from './chunk-OR3KK4Y6.js';
import { isHLSSupported, IS_CHROME } from './chunk-KKTONNDY.js';
import { preconnect, loadScript } from './chunk-TOHOCF6L.js';
import { TextTrack, TEXT_TRACK_READY_STATE, TEXT_TRACK_ON_MODE_CHANGE } from './chunk-CW3ZGA4K.js';
import { signal, effect, peek } from 'maverick.js';
import { isString, isUndefined, dispatchEvent, isFunction, DOMEvent, camelToKebabCase } from 'maverick.js/std';

// src/utils/error.ts
function coerceToError(error) {
  return error instanceof Error ? error : Error(JSON.stringify(error));
}

// src/player/media/providers/hls/lib-loader.ts
async function loadHLSLibrary(lib, { player, delegate, logger }) {
  const callbacks = {
    onLoadStart() {
      dispatchEvent(player, "hls-lib-load-start");
    },
    onLoaded(ctor2) {
      dispatchEvent(player, "hls-lib-loaded", { detail: ctor2 });
    },
    onLoadError(e) {
      const error = coerceToError(e);
      dispatchEvent(player, "hls-lib-load-error", { detail: error });
      delegate.dispatch("error", { detail: { message: error.message, code: 4 } });
    }
  };
  let ctor = await loadHLSScript(lib, callbacks);
  if (isUndefined(ctor) && !isString(lib))
    ctor = await importHLS(lib, callbacks);
  if (!ctor)
    return null;
  if (!ctor.isSupported()) {
    const message = "[vidstack]: `hls.js` is not supported in this environment";
    dispatchEvent(player, "hls-unsupported");
    delegate.dispatch("error", { detail: { message, code: 4 } });
    return null;
  }
  return ctor;
}
async function importHLS(loader, callbacks = {}) {
  if (isUndefined(loader))
    return void 0;
  callbacks.onLoadStart?.();
  if (loader.prototype && loader.prototype !== Function) {
    callbacks.onLoaded?.(loader);
    return loader;
  }
  try {
    const ctor = (await loader())?.default;
    if (ctor && !!ctor.isSupported) {
      callbacks.onLoaded?.(ctor);
    } else {
      throw Error(
        false ? "[vidstack] failed importing `hls.js`. Dynamic import returned invalid constructor." : ""
      );
    }
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}
async function loadHLSScript(src, callbacks = {}) {
  if (!isString(src))
    return void 0;
  callbacks.onLoadStart?.();
  try {
    await loadScript(src);
    if (!isFunction(window.Hls)) {
      throw Error(
        false ? "[vidstack] failed loading `hls.js`. Could not find a valid `Hls` constructor on window" : ""
      );
    }
    const ctor = window.Hls;
    callbacks.onLoaded?.(ctor);
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}

// src/player/media/quality/symbols.ts
var SET_AUTO_QUALITY = Symbol(0);
var ENABLE_AUTO_QUALITY = Symbol(0);

// src/player/media/providers/hls/setup.ts
var toDOMEventType = (type) => camelToKebabCase(type);
function setupHLS(provider, { player, logger, delegate, $store, qualities, audioTracks, textTracks }, callbacks) {
  effect(() => {
    const ctor = provider.$ctor();
    if (!ctor)
      return;
    const isLive = peek(() => $store.streamType).includes("live"), isLiveLowLatency = peek(() => $store.streamType).includes("ll-");
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
    dispatchEvent(player, "hls-instance", { detail: instance });
    instance.attachMedia(provider.media);
    instance.on(ctor.Events.AUDIO_TRACK_SWITCHED, onAudioTrackSwitched);
    instance.on(ctor.Events.LEVEL_SWITCHED, onLevelSwitched);
    instance.on(ctor.Events.LEVEL_LOADED, onLevelLoaded);
    instance.on(ctor.Events.NON_NATIVE_TEXT_TRACKS_FOUND, (eventType, data) => {
      const event = new DOMEvent(eventType, { detail: data });
      let currentTrack = -1;
      for (let i = 0; i < data.tracks.length; i++) {
        const nonNativeTrack = data.tracks[i], init = nonNativeTrack.subtitleTrack ?? nonNativeTrack.closedCaptions, track = new TextTrack({
          id: `hls-${nonNativeTrack.kind}${i}`,
          src: init?.url,
          label: nonNativeTrack.label,
          language: init?.lang,
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
      const event = new DOMEvent(eventType, { detail: data });
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
  effect(() => {
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
    player.dispatchEvent(new DOMEvent(toDOMEventType(eventType), { detail }));
  }
  function onAudioTrackSwitched(eventType, data) {
    const track = audioTracks[data.id];
    if (track) {
      audioTracks[LIST_SELECT](track, true, new DOMEvent(eventType, { detail: data }));
    }
  }
  function onLevelSwitched(eventType, data) {
    const quality = qualities[data.level];
    if (quality) {
      qualities[LIST_SELECT](quality, true, new DOMEvent(eventType, { detail: data }));
    }
  }
  function onLevelLoaded(eventType, data) {
    if ($store.canPlay)
      return;
    const { type, live, totalduration: duration } = data.details;
    const event = new DOMEvent(eventType, { detail: data });
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
    media.dispatchEvent(new DOMEvent("canplay", { trigger: event }));
  }
  function onError(eventType, data) {
    if (data.fatal) {
      switch (data.type) {
        case "networkError":
          provider.instance?.startLoad();
          break;
        case "mediaError":
          provider.instance?.recoverMediaError();
          break;
        default:
          provider.instance?.destroy();
          provider.$instance.set(null);
          break;
      }
    }
  }
}

// src/player/media/providers/hls/provider.ts
var HLS_PROVIDER = Symbol(0);
var JS_DELIVR_CDN = "https://cdn.jsdelivr.net";
var _a;
var HLSProvider = class extends VideoProvider {
  constructor() {
    super(...arguments);
    this[_a] = true;
    this.$ctor = signal(null);
    this.$instance = signal(null);
    this.M = /* @__PURE__ */ new Set();
    this.A = `${JS_DELIVR_CDN}/npm/hls.js@^1.0.0/dist/hls${".min.js"}`;
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
    return this.A;
  }
  set library(library) {
    this.A = library;
  }
  preconnect() {
    if (!isString(this.A))
      return;
    preconnect(this.A);
  }
  setup(context) {
    super.setup(context);
    loadHLSLibrary(this.A, context).then((ctor) => this.$ctor.set(() => ctor));
    setupHLS(this, context, this.M);
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
    effect(() => {
      if (!isString(src))
        return;
      const instance = this.$instance();
      instance?.loadSource(src);
    });
  }
  /**
   * The given callback is invoked when a new `hls.js` instance is created and right before it's
   * attached to media.
   */
  onInstance(callback) {
    const instance = peek(this.$instance);
    if (instance)
      callback(instance);
    this.M.add(callback);
    return () => this.M.delete(callback);
  }
};
_a = HLS_PROVIDER;
/**
 * Whether `hls.js` is supported in this environment.
 */
HLSProvider.supported = isHLSSupported();

export { ENABLE_AUTO_QUALITY, HLSProvider, HLS_PROVIDER, SET_AUTO_QUALITY, coerceToError };
