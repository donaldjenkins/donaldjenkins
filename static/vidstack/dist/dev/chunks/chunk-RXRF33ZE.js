import { functionThrottle } from './chunk-JELAJF2G.js';
import { MediaRemoteControl } from './chunk-KHIZ6FLG.js';
import { useKeyboard, MEDIA_KEY_SHORTCUTS } from './chunk-PRKJFLQC.js';
import { SET_AUTO_QUALITY, ENABLE_AUTO_QUALITY, coerceToError } from './chunk-25M6M5V2.js';
import { LIST_READONLY, LIST_ADD, LIST_REMOVE, LIST_ON_REMOVE, LIST_RESET, LIST_SET_READONLY, LIST_ON_RESET, LIST_ON_USER_SELECT, LIST_SELECT, AUDIO_EXTENSIONS, AUDIO_TYPES, VIDEO_EXTENSIONS, VIDEO_TYPES, isHLSSrc, HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES } from './chunk-UC3VDTOL.js';
import { isHLSSupported, canOrientScreen, canPlayHLSNatively } from './chunk-KKTONNDY.js';
import { preconnect } from './chunk-TOHOCF6L.js';
import { isTrackCaptionKind, ATTACH_VIDEO, TEXT_TRACK_NATIVE_HLS, TextTrack, TEXT_TRACK_CAN_LOAD, TEXT_TRACK_ON_MODE_CHANGE, TEXT_TRACK_NATIVE, TEXT_TRACK_UPDATE_ACTIVE_CUES } from './chunk-INGY2UVM.js';
import { clampNumber, round } from './chunk-CVLY5S52.js';
import { useFocusVisible } from './chunk-YQSJJLRL.js';
import { useMedia, mediaContext } from './chunk-3ULVZKKX.js';
import { listenEvent, dispatchEvent, isNull, camelToKebabCase, mergeProperties, noop, EventsTarget, DOMEvent, isArray, isUndefined, isString, isObject, keysOf, useDisposalBin, appendTriggerEvent, createEvent, isNumber, deferredPromise } from 'maverick.js/std';
import { createStore, signal, getScope, effect, onDispose, scoped, tick, computed, peek, provideContext, root } from 'maverick.js';
import { defineCustomElement, onAttach, onConnect, STRING } from 'maverick.js/element';
import { $$_create_walker, $$_effect, $$_attr, $$_ref, $$_create_template } from 'maverick.js/dom';

var _a;
var List = class extends EventsTarget {
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
    this.dispatchEvent(new DOMEvent("add", { detail: item, trigger }));
  }
  /* @internal */
  [LIST_REMOVE](item, trigger) {
    const index = this._items.indexOf(item);
    if (index >= 0) {
      this[LIST_ON_REMOVE]?.(item, trigger);
      this._items.splice(index, 1);
      this.dispatchEvent(new DOMEvent("remove", { detail: item, trigger }));
    }
  }
  /* @internal */
  [LIST_RESET](trigger) {
    for (const item of [...this._items])
      this[LIST_REMOVE](item, trigger);
    this._items = [];
    this[LIST_SET_READONLY](false, trigger);
    this[LIST_ON_RESET]?.();
  }
  /* @internal */
  [LIST_SET_READONLY](readonly, trigger) {
    if (this[LIST_READONLY] === readonly)
      return;
    this[LIST_READONLY] = readonly;
    this.dispatchEvent(new DOMEvent("readonly-change", { detail: readonly, trigger }));
  }
};
function getRange(fnName, valueIndex, ranges, rangeIndex) {
  throwIfOutOfRange(fnName, rangeIndex, ranges.length - 1);
  return ranges[rangeIndex][valueIndex] || Infinity;
}
function buildTimeRanges(ranges) {
  if (isUndefined(ranges) || ranges.length === 0) {
    return { length: 0, start: emptyTimeRange, end: emptyTimeRange };
  }
  return {
    length: ranges.length,
    start: getRange.bind(null, "start", 0, ranges),
    end: getRange.bind(null, "end", 1, ranges)
  };
}
function createTimeRanges(start, end) {
  if (isArray(start)) {
    return buildTimeRanges(start);
  } else if (isUndefined(start) || isUndefined(end)) {
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
function throwIfOutOfRange(fnName, index, end) {
  if (!isNumber(index) || index < 0 || index > end) {
    throw new Error(
      `Failed to execute '${fnName}' on 'TimeRanges': The index provided (${index}) is non-numeric or out of bounds (0-${end}).`
    );
  }
}
function emptyTimeRange() {
  throw new Error("`TimeRanges` object is empty." );
}
var mediaStore = createStore({
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
  logLevel: "warn" ,
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
var DO_NOT_RESET_ON_SRC_CHANGE = /* @__PURE__ */ new Set([
  "autoplay",
  "canFullscreen",
  "canPictureInPicture",
  "canLoad",
  "controls",
  "fullscreen",
  "loop",
  "logLevel",
  "muted",
  "playsinline",
  "pictureInPicture",
  "preload",
  "poster",
  "source",
  "sources",
  "textTracks",
  "textTrack",
  "volume",
  "canLoadPoster",
  "providedStreamType",
  "providedViewType"
]);
function softResetMediaStore($media) {
  mediaStore.reset($media, (prop) => !DO_NOT_RESET_ON_SRC_CHANGE.has(prop));
  tick();
}

// src/player/media/tracks/text/render/native-text-renderer.ts
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
    track[TEXT_TRACK_NATIVE]?.remove?.();
    track[TEXT_TRACK_NATIVE] = null;
    this._tracks.delete(track);
  }
  changeTrack(track) {
    const prev = this._track?.[TEXT_TRACK_NATIVE], current = track?.[TEXT_TRACK_NATIVE];
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
    if (native.cues?.length)
      return;
    for (const cue of track.cues)
      native.addCue(cue);
  }
  _onChange(event) {
    for (const track of this._tracks) {
      const nativeTrack = track[TEXT_TRACK_NATIVE]?.track;
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
    effect(() => {
      this._nativeDisplay = $store.controls || $iosControls();
      this._update();
    });
    onDispose(this._detach.bind(this));
    listenEvent(textTracks, "add", (event) => this._addNativeTrack(event.detail));
    listenEvent(textTracks, "remove", (event) => this._removeNativeTrack(event.detail));
    listenEvent(textTracks, "mode-change", this._update.bind(this));
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
    if (!isTrackCaptionKind(track))
      return;
    this._nativeRenderer?.addTrack(track);
  }
  _removeNativeTrack(track) {
    if (!isTrackCaptionKind(track))
      return;
    this._nativeRenderer?.removeTrack(track);
  }
  _update() {
    if (!this._video) {
      this._detach();
      return;
    }
    const currentTrack = this._textTracks.selected;
    if (this._nativeDisplay || currentTrack?.[TEXT_TRACK_NATIVE_HLS]) {
      this._customRenderer?.changeTrack(null);
      this._nativeRenderer.setDisplay(true);
      this._nativeRenderer.changeTrack(currentTrack);
      return;
    }
    this._nativeRenderer.setDisplay(false);
    this._nativeRenderer.changeTrack(null);
    if (!currentTrack) {
      this._customRenderer?.changeTrack(null);
      return;
    }
    const customRenderer = this._renderers.sort((a, b) => a.priority - b.priority).find((loader) => loader.canRender(currentTrack));
    if (this._customRenderer !== customRenderer) {
      this._customRenderer?.detach();
      customRenderer?.attach(this._video);
      this._customRenderer = customRenderer ?? null;
    }
    customRenderer?.changeTrack(currentTrack);
  }
  _detach() {
    this._nativeRenderer?.detach();
    this._nativeRenderer = null;
    this._customRenderer?.detach();
    this._customRenderer = null;
  }
};
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
  add(init2, trigger) {
    const isTrack = init2 instanceof TextTrack, track = isTrack ? init2 : new TextTrack(init2);
    if (this._default && init2.default)
      delete init2.default;
    track.addEventListener("mode-change", this._handleTrackModeChange);
    this[LIST_ADD](track, trigger);
    if (this._canLoad)
      track[TEXT_TRACK_CAN_LOAD]();
    if (init2.default) {
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
      new DOMEvent("mode-change", {
        detail: event.detail,
        trigger: event
      })
    );
  }
};
var SELECTED = Symbol("SELECTED" );
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
        if (this.readonly)
          return;
        this[LIST_ON_USER_SELECT]?.();
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
        new DOMEvent("change", {
          detail: { prev, current: this.selected },
          trigger
        })
      );
    }
  }
};

// src/player/media/tracks/audio-tracks.ts
var AudioTrackList = class extends SelectList {
  getById(id) {
    if (id === "")
      return null;
    return this._items.find((track) => track.id === id) ?? null;
  }
};
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
      new DOMEvent("auto-change", {
        detail: auto,
        trigger
      })
    );
  }
};
var $$_templ = /* @__PURE__ */ $$_create_template(`<!$><audio preload="none"></audio>`);
var $$_templ_2 = $$_templ;
var AudioProviderLoader = class {
  canPlay({ src, type }) {
    return isString(src) ? AUDIO_EXTENSIONS.test(src) || AUDIO_TYPES.has(type) || src.startsWith("blob:") && type === "audio/object" : type === "audio/object";
  }
  mediaType() {
    return "audio";
  }
  async load() {
    if (!this._audio) {
      throw Error(
        "[vidstack] `<audio>` element was not found - did you forget to include `<media-outlet>`?"
      );
    }
    return new (await import('./provider-TKY2K65Z.js')).AudioProvider(this._audio);
  }
  render($store) {
    const $crossorigin = () => $store.crossorigin, $controls = () => $store.controls;
    return (() => {
      const [$$_root, $$_walker] = $$_create_walker($$_templ_2);
      $$_effect(() => $$_attr($$_root, "controls", $controls()));
      $$_effect(() => $$_attr($$_root, "crossorigin", $crossorigin()));
      $$_ref($$_root, (el) => void (this._audio = el));
      return $$_root;
    })();
  }
};
var $$_templ2 = /* @__PURE__ */ $$_create_template(`<!$><video preload="none"></video>`);
var $$_templ_22 = $$_templ2;
var VideoProviderLoader = class {
  canPlay(src) {
    return isString(src.src) ? VIDEO_EXTENSIONS.test(src.src) || VIDEO_TYPES.has(src.type) || src.src.startsWith("blob:") && src.type === "video/object" || isHLSSrc(src) && canPlayHLSNatively() : src.type === "video/object";
  }
  mediaType() {
    return "video";
  }
  async load(context) {
    if (!this._video) {
      throw Error(
        "[vidstack] `<video>` element was not found - did you forget to include `<media-outlet>`?"
      );
    }
    return new (await import('./provider-BJSGZCPE.js')).VideoProvider(this._video, context);
  }
  render($store) {
    const $controls = () => $store.controls, $crossorigin = () => $store.crossorigin, $poster = () => $store.poster && $store.canLoadPoster === true ? $store.poster : null;
    return (() => {
      const [$$_root, $$_walker] = $$_create_walker($$_templ_22);
      $$_effect(() => $$_attr($$_root, "controls", $controls()));
      $$_effect(() => $$_attr($$_root, "crossorigin", $crossorigin()));
      $$_effect(() => $$_attr($$_root, "poster", $poster()));
      $$_ref($$_root, (el) => void (this._video = el));
      return $$_root;
    })();
  }
};

// src/player/media/providers/hls/loader.tsx
var _HLSProviderLoader = class extends VideoProviderLoader {
  preconnect() {
    preconnect("https://cdn.jsdelivr.net", "preconnect");
  }
  canPlay({ src, type }) {
    return _HLSProviderLoader.supported && isString(src) && (HLS_VIDEO_EXTENSIONS.test(src) || HLS_VIDEO_TYPES.has(type));
  }
  async load(context) {
    if (!this._video) {
      throw Error(
        "[vidstack] `<video>` element was not found - did you forget to include `<media-outlet>`?"
      );
    }
    return new (await import('./provider-R545HMMY.js')).HLSProvider(this._video, context);
  }
};
var HLSProviderLoader = _HLSProviderLoader;
HLSProviderLoader.supported = isHLSSupported();

// src/player/media/outlet/sources.ts
function useSourceSelection($domSources, $rendered, context) {
  const { $loader, $store: $media, $provider, delegate, $$props } = context;
  const { $src, $preferNativeHLS } = $$props;
  const HLS_LOADER = new HLSProviderLoader(), VIDEO_LOADER = new VideoProviderLoader(), AUDIO_LOADER = new AudioProviderLoader();
  const $loaders = computed(() => {
    return $preferNativeHLS() ? [VIDEO_LOADER, AUDIO_LOADER, HLS_LOADER] : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER];
  });
  effect(() => {
    delegate.dispatch("sources-change", {
      detail: [...normalizeSrc($src()), ...$domSources()]
    });
  });
  effect(() => {
    const sources = $media.sources, currentSource = peek(() => $media.source);
    let newSource = { src: "", type: "" }, newLoader = null;
    for (const src of sources) {
      const loader = peek($loaders).find((loader2) => loader2.canPlay(src));
      if (loader) {
        newSource = src;
        newLoader = loader;
      }
    }
    if (newSource.src !== currentSource.src || newSource.type !== currentSource.type) {
      delegate.dispatch("source-change", { detail: newSource });
      delegate.dispatch("media-type-change", {
        detail: newLoader?.mediaType(newSource) || "unknown"
      });
    }
    if (newLoader !== peek($loader)) {
      delegate.dispatch("provider-change", { detail: null });
      newLoader && peek(() => newLoader.preconnect?.(context));
      delegate.dispatch("provider-loader-change", { detail: newLoader });
    }
    tick();
  });
  effect(() => {
    const loader = $loader();
    if (!$rendered() || !loader)
      return;
    peek(() => {
      loader.load(context).then((provider) => {
        if (!peek($rendered))
          return;
        if (peek($loader) === loader) {
          context.delegate.dispatch("provider-change", {
            detail: provider
          });
        }
      });
    });
  });
  effect(() => {
    const provider = $provider();
    if (!provider)
      return;
    if ($media.canLoad) {
      peek(() => provider.setup({ ...context, player: context.$player() }));
      return;
    }
    peek(() => provider.preconnect?.(context));
  });
  effect(() => {
    const provider = $provider(), source = $media.source;
    if ($media.canLoad) {
      peek(
        () => provider?.loadSource(
          source,
          peek(() => $media.preload)
        )
      );
      return;
    }
    try {
      isString(source.src) && preconnect(new URL(source.src).origin, "preconnect");
    } catch (e) {
      {
        context.logger?.infoGroup(`Failed to preconnect to source: ${source.src}`).labelledLog("Error", e).dispatch();
      }
    }
  });
}
function normalizeSrc(src) {
  return (isArray(src) ? src : [!isString(src) && "src" in src ? src : { src }]).map(
    ({ src: src2, type }) => ({
      src: src2,
      type: type ?? (!isString(src2) || src2.startsWith("blob:") ? "video/object" : "?")
    })
  );
}
function useTextTracks($domTracks, { textTracks, $$props }) {
  const { $textTracks } = $$props;
  let prevTextTracks = [];
  effect(() => {
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
var OutletDefinition = defineCustomElement({
  tagName: "media-outlet",
  setup({ host }) {
    const context = useMedia(), $rendered = signal(false), $domSources = signal([]), $domTracks = signal([]);
    onAttach(() => {
      host.el.keepAlive = true;
    });
    onConnect(() => {
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

// src/foundation/logger/colors.ts
var LOCAL_STORAGE_KEY = "@vidstack/log-colors";
var savedColors = init();
function getLogColor(key2) {
  return savedColors.get(key2);
}
function saveLogColor(key2, { color = generateColor(), overwrite = false } = {}) {
  if (!savedColors.has(key2) || overwrite) {
    savedColors.set(key2, color);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Object.entries(savedColors)));
  }
}
function generateColor() {
  return `hsl(${Math.random() * 360}, 55%, 70%)`;
}
function init() {
  let colors;
  try {
    colors = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  } catch {
  }
  return new Map(Object.entries(colors ?? {}));
}
var GROUPED_LOG = Symbol("GROUPED_LOG");
function isGroupedLog(data) {
  return isObject(data) && data[GROUPED_LOG];
}
function createGroupedLog(title, parent) {
  const logs = [];
  const group = {
    [GROUPED_LOG]: true,
    title,
    logs,
    log(...data) {
      logs.push({ data });
      return group;
    },
    labelledLog(label, ...data) {
      logs.push({ label, data });
      return group;
    },
    groupStart(title2) {
      return createGroupedLog(title2, group);
    },
    groupEnd() {
      parent?.logs.push(group);
      return parent ?? group;
    }
  };
  return group;
}

// src/foundation/logger/log-level.ts
var LogLevelValue = Object.freeze({
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
});
var LogLevelColor = Object.freeze({
  silent: "white",
  error: "hsl(6, 58%, 50%)",
  warn: "hsl(51, 58%, 50%)",
  info: "hsl(219, 58%, 50%)",
  debug: "hsl(280, 58%, 50%)"
});

// src/foundation/logger/ms.ts
var s = 1e3;
var m = s * 60;
var h = m * 60;
var d = h * 24;
function ms(val) {
  const msAbs = Math.abs(val);
  if (msAbs >= d) {
    return Math.round(val / d) + "d";
  }
  if (msAbs >= h) {
    return Math.round(val / h) + "h";
  }
  if (msAbs >= m) {
    return Math.round(val / m) + "m";
  }
  if (msAbs >= s) {
    return Math.round(val / s) + "s";
  }
  return round(val, 2) + "ms";
}

// src/foundation/logger/log-printer.ts
function createLogPrinter($target) {
  let logLevel = "warn", lastLogTimestamp = void 0;
  effect(() => {
    const target = $target();
    if (!target)
      return;
    listenEvent(target, "vds-log", (event) => {
      event.stopPropagation();
      const eventTargetName = (event.path?.[0] ?? event.target).tagName.toLowerCase();
      const { level = "warn", data } = event.detail ?? {};
      if (LogLevelValue[logLevel] < LogLevelValue[level]) {
        return;
      }
      saveLogColor(eventTargetName);
      const hint = data?.length === 1 && isGroupedLog(data[0]) ? data[0].title : isString(data?.[0]) ? data[0] : "";
      console.groupCollapsed(
        `%c${level.toUpperCase()}%c ${eventTargetName}%c ${hint.slice(0, 50)}${hint.length > 50 ? "..." : ""}`,
        `background: ${LogLevelColor[level]}; color: white; padding: 1.5px 2.2px; border-radius: 2px; font-size: 11px;`,
        `color: ${getLogColor(eventTargetName)}; padding: 4px 0px; font-size: 11px;`,
        "color: gray; font-size: 11px; padding-left: 4px;"
      );
      if (data?.length === 1 && isGroupedLog(data[0])) {
        printGroup(level, data[0]);
      } else if (data) {
        print(level, ...data);
      }
      printTimeDiff();
      printStackTrace();
      console.groupEnd();
    });
    return () => {
      lastLogTimestamp = void 0;
    };
  });
  const calcLastLogTimeDiff = () => {
    const time = performance.now();
    const diff = time - (lastLogTimestamp ?? (lastLogTimestamp = performance.now()));
    lastLogTimestamp = time;
    return ms(diff);
  };
  const printTimeDiff = () => {
    labelledPrint("Time since last log", calcLastLogTimeDiff());
  };
  return {
    get logLevel() {
      return logLevel;
    },
    set logLevel(level) {
      logLevel = level;
    }
  };
}
function print(level, ...data) {
  console[level](...data);
}
function labelledPrint(label, ...data) {
  console.log(`%c${label}:`, "color: gray", ...data);
}
function printStackTrace() {
  console.groupCollapsed("%cStack Trace", "color: gray");
  console.trace();
  console.groupEnd();
}
function printGroup(level, groupedLog) {
  console.groupCollapsed(groupedLog.title);
  for (const log of groupedLog.logs) {
    if (isGroupedLog(log)) {
      printGroup(level, log);
    } else if ("label" in log && !isUndefined(log.label)) {
      labelledPrint(log.label, ...log.data);
    } else {
      print(level, ...log.data);
    }
  }
  console.groupEnd();
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
var ms2 = [
  "msFullscreenEnabled",
  "msFullscreenElement",
  "msRequestFullscreen",
  "msExitFullscreen",
  "MSFullscreenChange",
  "MSFullscreenError",
  "-ms-fullscreen"
];
var document2 = typeof window !== "undefined" && typeof window.document !== "undefined" ? window.document : {};
var vendor = "fullscreenEnabled" in document2 && Object.keys(key) || webkit[0] in document2 && webkit || moz[0] in document2 && moz || ms2[0] in document2 && ms2 || [];
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
  const $active = signal(false), exit = () => exitFullscreen(peek($target));
  let listening = false;
  effect(() => {
    const target = $target();
    if (target) {
      listenEvent(fscreen_esm_default, "fullscreenchange", async (trigger) => {
        const active = isFullscreen(target);
        if (active === $active())
          return;
        if (!active)
          listening = false;
        $active.set(active);
        dispatchEvent(target, "fullscreen-change", { detail: active, trigger });
      });
      listenEvent(fscreen_esm_default, "fullscreenerror", (trigger) => {
        if (!listening)
          return;
        dispatchEvent(target, "fullscreen-error", { detail: null, trigger });
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
        return await requestFullscreen(peek($target));
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
    "[vidstack] fullscreen API is not enabled or supported in this environment" 
  );
}
function dispatchLogEvent(target, level, ...data) {
  return dispatchEvent(target, "vds-log", {
    bubbles: true,
    composed: true,
    detail: { level, data }
  });
}

// src/foundation/logger/create-logger.ts
function createLogger() {
  let target = null;
  const createGroupedLogger = (level, title, rootGroup, parentGroup) => {
    const group = createGroupedLog(title, parentGroup);
    group.dispatch = () => dispatchLogEvent(target, level, rootGroup ?? group);
    return {
      ...group,
      groupStart: (title2) => createGroupedLogger(level, title2, rootGroup ?? group, group)
    };
  };
  return {
    error: (...data) => dispatchLogEvent(target, "error", ...data),
    warn: (...data) => dispatchLogEvent(target, "warn", ...data),
    info: (...data) => dispatchLogEvent(target, "info", ...data),
    debug: (...data) => dispatchLogEvent(target, "debug", ...data),
    errorGroup: (title) => createGroupedLogger("error", title),
    warnGroup: (title) => createGroupedLogger("warn", title),
    infoGroup: (title) => createGroupedLogger("info", title),
    debugGroup: (title) => createGroupedLogger("debug", title),
    setTarget: (newTarget) => {
      target = newTarget;
    }
  };
}

// src/foundation/logger/logger.ts
var loggers = /* @__PURE__ */ new WeakMap();
function useLogger($target) {
  const logger = loggers.get($target) ?? createLogger();
  if (!loggers.has($target)) {
    effect(() => logger.setTarget($target()));
    loggers.set($target, logger);
  }
  return logger;
}
function createIntersectionObserverAdapter($target, init2 = {}) {
  const $intersecting = signal(false), { skipInitial, callback, ...observerInit } = init2;
  let disconnect;
  effect(() => {
    const target = $target();
    if (!target) {
      $intersecting.set(false);
      return;
    }
    let first = true;
    const observer = new IntersectionObserver((entries) => {
      if (first && skipInitial) {
        first = false;
        return;
      }
      callback?.(entries, observer);
      $intersecting.set(entries[0].isIntersecting);
    }, observerInit);
    observer.observe(target);
    return disconnect = () => {
      observer.disconnect();
      disconnect = void 0;
    };
  });
  return {
    get intersecting() {
      return $intersecting();
    },
    disconnect() {
      disconnect?.();
    }
  };
}

// src/player/media/controller/can-load.ts
function useMediaCanLoad($controller, $load, callback) {
  onConnect(async () => {
    const load = $load();
    if (load === "eager") {
      requestAnimationFrame(callback);
    } else if (load === "idle") {
      const { waitIdlePeriod } = await import('maverick.js/std');
      waitIdlePeriod(callback);
    } else if (load === "visible") {
      root(async (dispose) => {
        const io = createIntersectionObserverAdapter($controller);
        effect(() => {
          if (io.intersecting) {
            callback();
            dispose();
          }
        });
      });
    }
  });
}
function createMediaControllerDelegate({ $player, $store, logger }, handle) {
  const dispatch = (type, ...init2) => {
    handle(new DOMEvent(type, init2?.[0]));
  };
  async function ready(info, trigger) {
    if (peek(() => $store.canPlay))
      return;
    dispatch("can-play", { detail: info, trigger });
    tick();
    {
      logger?.infoGroup("-~-~-~-~-~-~-~-~- \u2705 MEDIA READY -~-~-~-~-~-~-~-~-").labelledLog("Media Store", { ...$store }).labelledLog("Trigger Event", trigger).dispatch();
    }
    if ($store.canPlay && $store.autoplay && !$store.started) {
      await attemptAutoplay();
    }
  }
  async function attemptAutoplay() {
    $store.attemptingAutoplay = true;
    try {
      await $player().play();
      dispatch("autoplay", { detail: { muted: $store.muted } });
    } catch (error) {
      dispatch("autoplay-fail", {
        detail: {
          muted: $store.muted,
          error
        }
      });
    } finally {
      $store.attemptingAutoplay = false;
    }
  }
  return {
    dispatch,
    ready
  };
}
var mediaEvents = [
  "abort",
  "can-play",
  "can-play-through",
  "duration-change",
  "emptied",
  "ended",
  "error",
  "fullscreen-change",
  "loaded-data",
  "loaded-metadata",
  "load-start",
  "media-type-change",
  "pause",
  "play",
  "playing",
  "progress",
  "seeked",
  "seeking",
  "source-change",
  "sources-change",
  "stalled",
  "started",
  "suspend",
  "stream-type-change",
  "replay",
  // 'time-update',
  "view-type-change",
  "volume-change",
  "waiting"
] ;
function useMediaEventsLogger({ $player, $store }, logger) {
  effect(() => {
    const player = $player();
    if (player) {
      for (const eventType of mediaEvents) {
        listenEvent(player, eventType, (event) => {
          logger?.infoGroup(`\u{1F4E1} dispatching \`${eventType}\``).labelledLog("Media Store", { ...$store }).labelledLog("Event", event).dispatch();
        });
      }
    }
  });
}
function useMediaPropChange({ $player, $store }, {
  $autoplay,
  $poster,
  $loop,
  $controls,
  $crossorigin,
  $playsinline,
  $logLevel,
  $liveEdgeTolerance,
  $minLiveDVRWindow
}) {
  effect(() => {
    const player = $player();
    if (!player)
      return;
    {
      effect(() => {
        $store.logLevel = $logLevel();
      });
    }
    effect(() => {
      const autoplay = $autoplay();
      $store.autoplay = autoplay;
      dispatchEvent(player, "autoplay-change", { detail: autoplay });
    });
    effect(() => {
      const poster = $poster();
      $store.poster = poster;
      dispatchEvent(player, "poster-change", { detail: poster });
    });
    effect(() => {
      const loop = $loop();
      $store.loop = loop;
      dispatchEvent(player, "loop-change", { detail: loop });
    });
    effect(() => {
      const controls = $controls();
      $store.controls = controls;
      dispatchEvent(player, "controls-change", { detail: controls });
    });
    effect(() => {
      $store.crossorigin = $crossorigin();
    });
    effect(() => {
      const playsinline = $playsinline();
      $store.playsinline = playsinline;
      dispatchEvent(player, "playsinline-change", { detail: playsinline });
    });
    effect(() => {
      $store.liveEdgeTolerance = $liveEdgeTolerance();
      $store.minLiveDVRWindow = $minLiveDVRWindow();
    });
    effect(() => {
      dispatchEvent(player, "live-change", { detail: $store.live });
    });
    effect(() => {
      dispatchEvent(player, "live-edge-change", { detail: $store.liveEdge });
    });
  });
}
var RequestQueue = class {
  constructor() {
    this._serving = false;
    this._pending = deferredPromise();
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
    this._queue.get(key2)?.();
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
    this._pending = deferredPromise();
  }
};

// src/player/media/controller/provider-delegate.ts
function useMediaProviderDelegate({ $provider, $store: $media }, requestManager, {
  $paused,
  $volume,
  $muted,
  $currentTime,
  $playsinline,
  $playbackRate
}) {
  const canPlayQueue = new RequestQueue();
  effect(() => {
    if ($media.canPlay && $provider())
      canPlayQueue._start();
    else
      canPlayQueue._stop();
  });
  effect(() => setMuted($muted()));
  effect(() => setPaused($paused()));
  effect(() => setVolume($volume()));
  effect(() => setCurrentTime($currentTime()));
  effect(() => setPlaysinline($playsinline()));
  effect(() => setPlaybackRate($playbackRate()));
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
        peek(() => {
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
var CAN_ORIENT_SCREEN = canOrientScreen();
function createScreenOrientationAdapter($target) {
  const $orientation = signal(getScreenOrientation()), $locked = signal(false);
  let currentLock;
  if (CAN_ORIENT_SCREEN) {
    effect(() => {
      const target = $target();
      if (!target)
        return;
      listenEvent(screen.orientation, "change", (trigger) => {
        const orientation = getScreenOrientation();
        $orientation.set(orientation);
        dispatchEvent(target, "orientation-change", {
          detail: { orientation, lock: currentLock },
          trigger
        });
      });
      return async () => {
        if (CAN_ORIENT_SCREEN && $locked())
          await unlock();
      };
    });
  }
  async function lock(lockType) {
    if (peek($locked))
      return;
    assertScreenOrientationAPI();
    await screen.orientation.lock(lockType);
    $locked.set(true);
    currentLock = lockType;
  }
  async function unlock() {
    if (!peek($locked))
      return;
    assertScreenOrientationAPI();
    currentLock = void 0;
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
function assertScreenOrientationAPI() {
  if (!CAN_ORIENT_SCREEN)
    return;
  throw Error(
    "[vidstack] screen orientation API is not available" 
  );
}
function getScreenOrientation() {
  return window.screen?.orientation?.type;
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
    return this._queue.get(key2)?.size ?? 0;
  }
  /**
   * Clear all items in the queue.
   */
  _reset() {
    this._queue.clear();
  }
};
var STOP_IDLE_EVENTS = ["pointerup", "pointermove", "focus", "keydown", "playing"];
function createMediaUser($controller, $media) {
  let idleTimeout, delay = 2e3, trigger, $idle = signal(false), $userPaused = signal(false), $paused = computed(() => $userPaused() || $media.paused);
  effect(() => {
    const target = $controller();
    if (!target)
      return;
    effect(() => {
      if ($paused())
        return;
      for (const eventType of STOP_IDLE_EVENTS) {
        listenEvent(target, eventType, stopIdling);
      }
    });
    effect(() => {
      window.clearTimeout(idleTimeout);
      const idle = $idle() && !$paused();
      $media.userIdle = idle;
      dispatchEvent(target, "user-idle-change", { detail: idle, trigger });
      trigger = void 0;
    });
    return () => $idle.set(false);
  });
  function stopIdling(event) {
    if ($idle())
      trigger = event;
    $idle.set(false);
    window.clearTimeout(idleTimeout);
    idleTimeout = window.setTimeout(() => $idle.set(!peek($paused)), delay);
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
  const user = createMediaUser($player, $media), orientation = createScreenOrientationAdapter($player), fullscreen = createFullscreenAdapter($player);
  effect(() => {
    user.idle.delay = $props.$userIdleDelay();
  });
  effect(() => {
    const supported = fullscreen.supported || $provider()?.fullscreen?.supported || false;
    if ($media.canLoad && peek(() => $media.canFullscreen) === supported)
      return;
    $media.canFullscreen = supported;
  });
  effect(() => {
    const supported = $provider()?.pictureInPicture?.supported || false;
    if ($media.canLoad && peek(() => $media.canPictureInPicture) === supported)
      return;
    $media.canPictureInPicture = supported;
  });
  function logRequest(event) {
    {
      logger?.infoGroup(`\u{1F4EC} received \`${event.type}\``).labelledLog("Request", event).dispatch();
    }
  }
  const eventHandlers = {
    "media-audio-track-change-request": onAudioTrackChangeRequest,
    "media-enter-fullscreen-request": onEnterFullscreenRequest,
    "media-exit-fullscreen-request": onExitFullscreenRequest,
    "media-enter-pip-request": onEnterPictureInPictureRequest,
    "media-exit-pip-request": onExitPictureInPictureRequest,
    "media-hide-poster-request": onHidePosterRequest,
    "media-live-edge-request": onSeekToLiveEdgeRequest,
    "media-loop-request": onLoopRequest,
    "media-mute-request": onMuteRequest,
    "media-pause-request": onPauseRequest,
    "media-pause-user-idle-request": onPauseIdlingRequest,
    "media-play-request": onPlayRequest,
    "media-rate-change-request": onRateChangeRequest,
    "media-quality-change-request": onQualityChangeRequest,
    "media-resume-user-idle-request": onResumeIdlingRequest,
    "media-seek-request": onSeekRequest,
    "media-seeking-request": onSeekingRequest,
    "media-show-poster-request": onShowPosterRequest,
    "media-start-loading": onStartLoading,
    "media-text-track-change-request": onTextTrackChangeRequest,
    "media-unmute-request": onUnmuteRequest,
    "media-volume-change-request": onVolumeChangeRequest
  };
  effect(() => {
    const target = $player();
    if (!target)
      return;
    for (const eventType of keysOf(eventHandlers)) {
      const handler2 = eventHandlers[eventType];
      listenEvent(target, eventType, (event) => {
        event.stopPropagation();
        logRequest(event);
        if (peek($provider))
          handler2(event);
      });
    }
  });
  function onStartLoading(event) {
    if ($media.canLoad)
      return;
    requests._queue._enqueue("load", event);
    handler.handle(createEvent($player, "can-load"));
  }
  function onMuteRequest(event) {
    if ($media.muted)
      return;
    requests._queue._enqueue("volume", event);
    $provider().muted = true;
  }
  function onUnmuteRequest(event) {
    if (!$media.muted)
      return;
    requests._queue._enqueue("volume", event);
    $provider().muted = false;
    if ($media.volume === 0) {
      requests._queue._enqueue("volume", event);
      $provider().volume = 0.25;
    }
  }
  function onRateChangeRequest(event) {
    if ($media.playbackRate === event.detail)
      return;
    requests._queue._enqueue("rate", event);
    $provider().playbackRate = event.detail;
  }
  function onTextTrackChangeRequest(event) {
    const { index, mode } = event.detail, track = textTracks[index];
    if (track) {
      requests._queue._enqueue("textTrack", event);
      track.setMode(mode, event);
    } else {
      logger?.warnGroup("[vidstack] failed text track change request (invalid index)").labelledLog("Text Tracks", textTracks.toArray()).labelledLog("Index", index).labelledLog("Event", event).dispatch();
    }
  }
  function onAudioTrackChangeRequest(event) {
    if (audioTracks.readonly) {
      {
        logger?.warnGroup(`[vidstack] attempted to change audio track but it is currently read-only`).labelledLog("Event", event).dispatch();
      }
      return;
    }
    const index = event.detail, track = audioTracks[index];
    if (track) {
      requests._queue._enqueue("audioTrack", event);
      track.selected = true;
    } else {
      logger?.warnGroup("[vidstack] failed audio track change request (invalid index)").labelledLog("Audio Tracks", audioTracks.toArray()).labelledLog("Index", index).labelledLog("Event", event).dispatch();
    }
  }
  function onQualityChangeRequest(event) {
    if (qualities.readonly) {
      {
        logger?.warnGroup(`[vidstack] attempted to change video quality but it is currently read-only`).labelledLog("Event", event).dispatch();
      }
      return;
    }
    requests._queue._enqueue("quality", event);
    const index = event.detail;
    if (index < 0) {
      qualities.autoSelect(event);
    } else {
      const quality = qualities[index];
      if (quality) {
        quality.selected = true;
      } else {
        logger?.warnGroup("[vidstack] failed quality change request (invalid index)").labelledLog("Qualities", qualities.toArray()).labelledLog("Index", index).labelledLog("Event", event).dispatch();
      }
    }
  }
  async function onPlayRequest(event) {
    if (!$media.paused)
      return;
    try {
      requests._queue._enqueue("play", event);
      await $provider().play();
    } catch (e) {
      const errorEvent = createEvent($player, "play-fail", { detail: coerceToError(e) });
      handler.handle(errorEvent);
    }
  }
  async function onPauseRequest(event) {
    if ($media.paused)
      return;
    try {
      requests._queue._enqueue("pause", event);
      await $provider().pause();
    } catch (e) {
      requests._queue._delete("pause");
      logger?.error("pause-fail", e);
    }
  }
  function onSeekingRequest(event) {
    requests._queue._enqueue("seeking", event);
    $media.seeking = true;
    requests._$isSeeking.set(true);
  }
  function onSeekRequest(event) {
    if ($media.ended)
      requests._$isReplay.set(true);
    requests._$isSeeking.set(false);
    requests._queue._delete("seeking");
    const boundTime = Math.min(
      Math.max($media.seekableStart + 0.1, event.detail),
      $media.seekableEnd - 0.1
    );
    if (!Number.isFinite(boundTime) || !$media.canSeek)
      return;
    requests._queue._enqueue("seeked", event);
    $provider().currentTime = boundTime;
    if ($media.live && event.isOriginTrusted && Math.abs($media.seekableEnd - boundTime) >= 2) {
      $media.userBehindLiveEdge = true;
    }
  }
  function onSeekToLiveEdgeRequest(event) {
    if (!$media.live || $media.liveEdge || !$media.canSeek)
      return;
    requests._queue._enqueue("seeked", event);
    try {
      seekToLiveEdge();
    } catch (e) {
      logger?.error("seek to live edge fail", e);
    }
  }
  function onVolumeChangeRequest(event) {
    const volume = event.detail;
    if ($media.volume === volume)
      return;
    requests._queue._enqueue("volume", event);
    $provider().volume = volume;
    if (volume > 0 && $media.muted) {
      requests._queue._enqueue("volume", event);
      $provider().muted = false;
    }
  }
  async function onEnterFullscreenRequest(event) {
    try {
      requests._queue._enqueue("fullscreen", event);
      await enterFullscreen(event.detail);
    } catch (error) {
      onFullscreenError(error);
    }
  }
  async function onExitFullscreenRequest(event) {
    try {
      requests._queue._enqueue("fullscreen", event);
      await exitFullscreen2(event.detail);
    } catch (error) {
      onFullscreenError(error);
    }
  }
  function onFullscreenError(error) {
    handler.handle(createEvent($player, "fullscreen-error", { detail: coerceToError(error) }));
  }
  async function onEnterPictureInPictureRequest(event) {
    try {
      requests._queue._enqueue("pip", event);
      await enterPictureInPicture();
    } catch (error) {
      onPictureInPictureError(error);
    }
  }
  async function onExitPictureInPictureRequest(event) {
    try {
      requests._queue._enqueue("pip", event);
      await exitPictureInPicture();
    } catch (error) {
      onPictureInPictureError(error);
    }
  }
  function onPictureInPictureError(error) {
    handler.handle(
      createEvent($player, "picture-in-picture-error", {
        detail: coerceToError(error)
      })
    );
  }
  function onResumeIdlingRequest(event) {
    requests._queue._enqueue("userIdle", event);
    user.idle.paused = false;
  }
  function onPauseIdlingRequest(event) {
    requests._queue._enqueue("userIdle", event);
    user.idle.paused = true;
  }
  function onShowPosterRequest(event) {
    $media.canLoadPoster = true;
  }
  function onHidePosterRequest(event) {
    $media.canLoadPoster = false;
  }
  function onLoopRequest(event) {
    window.requestAnimationFrame(async () => {
      try {
        requests._$isLooping.set(true);
        requests._$isReplay.set(true);
        await play();
      } catch (e) {
        requests._$isLooping.set(false);
        requests._$isReplay.set(false);
      }
    });
  }
  function throwIfFullscreenNotSupported(target, fullscreen2) {
    if (fullscreen2?.supported)
      return;
    throw Error(
      `[vidstack] fullscreen is not currently available on target \`${target}\`` 
    );
  }
  async function play() {
    if (!$media.paused)
      return;
    try {
      const provider = peek($provider);
      throwIfNotReadyForPlayback(provider, $player);
      if (peek(() => $media.ended))
        provider.currentTime = $media.seekableStart + 0.1;
      return provider.play();
    } catch (error) {
      const errorEvent = createEvent($player, "play-fail", { detail: coerceToError(error) });
      errorEvent.autoplay = $media.attemptingAutoplay;
      handler.handle(errorEvent);
      throw error;
    }
  }
  async function pause() {
    if ($media.paused)
      return;
    const provider = peek($provider);
    throwIfNotReadyForPlayback(provider, $player);
    return provider.pause();
  }
  let wasPictureInPictureActive = false;
  async function enterFullscreen(target = "prefer-media") {
    const provider = peek($provider), adapter = target === "prefer-media" && fullscreen.supported || target === "media" ? fullscreen : provider?.fullscreen;
    throwIfFullscreenNotSupported(target, adapter);
    if (adapter.active)
      return;
    if ($media.pictureInPicture) {
      wasPictureInPictureActive = true;
      await exitPictureInPicture();
    }
    const lockType = peek($props.$fullscreenOrientation);
    if (orientation.supported && !isUndefined(lockType))
      await orientation.lock(lockType);
    return adapter.enter();
  }
  async function exitFullscreen2(target = "prefer-media") {
    const provider = peek($provider), adapter = target === "prefer-media" && fullscreen.supported || target === "media" ? fullscreen : provider?.fullscreen;
    throwIfFullscreenNotSupported(target, adapter);
    if (!adapter.active)
      return;
    if (orientation.locked)
      await orientation.unlock();
    try {
      const result = await adapter.exit();
      if (wasPictureInPictureActive && $media.canPictureInPicture) {
        await enterPictureInPicture();
      }
      return result;
    } finally {
      wasPictureInPictureActive = false;
    }
  }
  function throwIfPictureInPictureNotSupported() {
    if ($media.canPictureInPicture)
      return;
    throw Error(
      `[vidstack] picture-in-picture is not currently available` 
    );
  }
  async function enterPictureInPicture() {
    throwIfPictureInPictureNotSupported();
    if ($media.pictureInPicture)
      return;
    return await $provider().pictureInPicture.enter();
  }
  async function exitPictureInPicture() {
    throwIfPictureInPictureNotSupported();
    if (!$media.pictureInPicture)
      return;
    return await $provider().pictureInPicture.exit();
  }
  function seekToLiveEdge() {
    $media.userBehindLiveEdge = false;
    if (peek(() => !$media.live || $media.liveEdge || !$media.canSeek))
      return;
    const provider = peek($provider);
    throwIfNotReadyForPlayback(provider, $player);
    provider.currentTime = $media.liveSyncPosition ?? $media.seekableEnd - 2;
  }
  return {
    _user: user,
    _orientation: orientation,
    _play: play,
    _pause: pause,
    _enterFullscreen: enterFullscreen,
    _exitFullscreen: exitFullscreen2,
    _enterPictureInPicture: enterPictureInPicture,
    _exitPictureInPicture: exitPictureInPicture,
    _seekToLiveEdge: seekToLiveEdge
  };
}
function throwIfNotReadyForPlayback(provider, $player) {
  if (provider && peek(() => $player()?.state.canPlay))
    return;
  throw Error(
    `[vidstack] media is not ready - wait for \`can-play\` event.` 
  );
}
var MediaRequestContext = class {
  constructor() {
    this._queue = new Queue();
    this._$isSeeking = signal(false);
    this._$isLooping = signal(false);
    this._$isReplay = signal(false);
  }
};

// ../../node_modules/.pnpm/just-debounce-it@3.2.0/node_modules/just-debounce-it/index.mjs
var functionDebounce = debounce;
function debounce(fn, wait, callFirst) {
  var timeout = null;
  var debouncedFn = null;
  var clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      debouncedFn = null;
      timeout = null;
    }
  };
  var flush = function() {
    var call = debouncedFn;
    clear();
    if (call) {
      call();
    }
  };
  var debounceWrapper = function() {
    if (!wait) {
      return fn.apply(this, arguments);
    }
    var context = this;
    var args = arguments;
    var callNow = callFirst && !timeout;
    clear();
    debouncedFn = function() {
      fn.apply(context, args);
    };
    timeout = setTimeout(function() {
      timeout = null;
      if (!callNow) {
        var call = debouncedFn;
        debouncedFn = null;
        return call();
      }
    }, wait);
    if (callNow) {
      return debouncedFn();
    }
  };
  debounceWrapper.cancel = clear;
  debounceWrapper.flush = flush;
  return debounceWrapper;
}
var trackedEventType = /* @__PURE__ */ new Set([
  "autoplay",
  "autoplay-fail",
  "can-load",
  "sources-change",
  "source-change",
  "load-start",
  "abort",
  "error",
  "loaded-metadata",
  "loaded-data",
  "can-play",
  "play",
  "play-fail",
  "pause",
  "playing",
  "seeking",
  "seeked",
  "waiting"
]);
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
  useDisposalBin(); const trackedEvents = /* @__PURE__ */ new Map();
  let skipInitialSrcChange = true, fireWaitingEvent, firingWaiting = false, waitingTriggerEvent;
  onAttach(() => {
    $player()?.setAttribute("aria-busy", "true");
  });
  effect(() => {
    const target = $player();
    if (!target)
      return;
    addTextTrackListeners();
    addQualityListeners();
    addAudioTrackListeners();
    listenEvent(target, "fullscreen-change", onFullscreenChange);
    listenEvent(target, "fullscreen-error", onFullscreenError);
  });
  function addTextTrackListeners() {
    onTextTracksChange();
    onTextTrackChange();
    listenEvent(textTracks, "add", onTextTracksChange);
    listenEvent(textTracks, "remove", onTextTracksChange);
    listenEvent(textTracks, "mode-change", onTextTrackChange);
  }
  function addAudioTrackListeners() {
    listenEvent(audioTracks, "add", onAudioTracksChange);
    listenEvent(audioTracks, "remove", onAudioTracksChange);
    listenEvent(audioTracks, "change", onAudioTrackChange);
  }
  function addQualityListeners() {
    listenEvent(qualities, "add", onQualitiesChange);
    listenEvent(qualities, "remove", onQualitiesChange);
    listenEvent(qualities, "change", onQualityChange);
    listenEvent(qualities, "auto-change", onAutoQualityChange);
    listenEvent(qualities, "readonly-change", onCanSetQualityChange);
  }
  const eventHandlers = {
    "provider-loader-change": onProviderLoaderChange,
    "provider-change": onProviderChange,
    autoplay: onAutoplay,
    "autoplay-fail": onAutoplayFail,
    "can-load": onCanLoad,
    "can-play-through": onCanPlayThrough,
    "can-play": onCanPlay,
    "duration-change": onDurationChange,
    "load-start": onLoadStart,
    "loaded-data": onLoadedData,
    "loaded-metadata": onLoadedMetadata,
    "media-type-change": onMediaTypeChange,
    "stream-type-change": onStreamTypeChange,
    "play-fail": onPlayFail,
    "rate-change": onRateChange,
    "source-change": onSourceChange,
    "sources-change": onSourcesChange,
    "time-update": onTimeUpdate,
    "volume-change": onVolumeChange,
    "fullscreen-change": onFullscreenChange,
    "fullscreen-error": onFullscreenError,
    "picture-in-picture-change": onPictureInPictureChange,
    "picture-in-picture-error": onPictureInPictureError,
    abort: onAbort,
    ended: onEnded,
    error: onError,
    pause: onPause,
    play: onPlay,
    playing: onPlaying,
    progress: onProgress,
    seeked: onSeeked,
    seeking: functionThrottle(onSeeking, 150, { leading: true }),
    waiting: onWaiting
  };
  function resetTracking() {
    stopWaiting();
    requests._$isReplay.set(false);
    requests._$isLooping.set(false);
    firingWaiting = false;
    waitingTriggerEvent = void 0;
    trackedEvents.clear();
  }
  function onProviderLoaderChange(event) {
    $loader.set(event.detail);
  }
  function onProviderChange(event) {
    $provider.set(event.detail);
  }
  function onMediaTypeChange(event) {
    appendTriggerEvent(event, trackedEvents.get("source-change"));
    const viewType = $media.viewType;
    $media.mediaType = event.detail;
    if (viewType !== $media.viewType) {
      setTimeout(
        () => $player()?.dispatchEvent(
          createEvent($player, "view-type-change", {
            detail: $media.viewType,
            trigger: event
          })
        ),
        0
      );
    }
  }
  function onStreamTypeChange(event) {
    appendTriggerEvent(event, trackedEvents.get("source-change"));
    $media.inferredStreamType = event.detail;
    event.detail = $media.streamType;
  }
  function onCanLoad(event) {
    $media.canLoad = true;
    trackedEvents.set("can-load", event);
    satisfyMediaRequest("load", event);
  }
  function onRateChange(event) {
    $media.playbackRate = event.detail;
    satisfyMediaRequest("rate", event);
  }
  function onTextTracksChange(event) {
    $media.textTracks = textTracks.toArray();
    dispatchEvent($player(), "text-tracks-change", {
      detail: $media.textTracks,
      trigger: event
    });
  }
  function onTextTrackChange(event) {
    satisfyMediaRequest("textTrack", event);
    const current = textTracks.selected;
    if ($media.textTrack !== current) {
      $media.textTrack = current;
      dispatchEvent($player(), "text-track-change", {
        detail: current,
        trigger: event
      });
    }
  }
  function onAudioTracksChange(event) {
    $media.audioTracks = audioTracks.toArray();
    dispatchEvent($player(), "audio-tracks-change", {
      detail: $media.audioTracks,
      trigger: event
    });
  }
  function onAudioTrackChange(event) {
    $media.audioTrack = audioTracks.selected;
    satisfyMediaRequest("audioTrack", event);
    dispatchEvent($player(), "audio-track-change", {
      detail: $media.audioTrack,
      trigger: event
    });
  }
  function onQualitiesChange(event) {
    $media.qualities = qualities.toArray();
    dispatchEvent($player(), "qualities-change", {
      detail: $media.qualities,
      trigger: event
    });
  }
  function onQualityChange(event) {
    $media.quality = qualities.selected;
    satisfyMediaRequest("quality", event);
    dispatchEvent($player(), "quality-change", {
      detail: $media.quality,
      trigger: event
    });
  }
  function onAutoQualityChange() {
    $media.autoQuality = qualities.auto;
  }
  function onCanSetQualityChange() {
    $media.canSetQuality = !qualities.readonly;
  }
  function onSourcesChange(event) {
    $media.sources = event.detail;
  }
  function onSourceChange(event) {
    appendTriggerEvent(event, trackedEvents.get("sources-change"));
    $media.source = event.detail;
    $player()?.setAttribute("aria-busy", "true");
    {
      logger?.infoGroup("\u{1F4FC} Media source change").labelledLog("Source", event.detail).dispatch();
    }
    if (skipInitialSrcChange) {
      skipInitialSrcChange = false;
      return;
    }
    audioTracks[LIST_RESET](event);
    qualities[LIST_RESET](event);
    resetTracking();
    softResetMediaStore($media);
    trackedEvents.set(event.type, event);
  }
  function onAbort(event) {
    appendTriggerEvent(event, trackedEvents.get("source-change"));
    appendTriggerEvent(event, trackedEvents.get("can-load"));
  }
  function onLoadStart(event) {
    appendTriggerEvent(event, trackedEvents.get("source-change"));
  }
  function onError(event) {
    $media.error = event.detail;
    appendTriggerEvent(event, trackedEvents.get("abort"));
  }
  function onLoadedMetadata(event) {
    appendTriggerEvent(event, trackedEvents.get("load-start"));
  }
  function onLoadedData(event) {
    appendTriggerEvent(event, trackedEvents.get("load-start"));
  }
  function onCanPlay(event) {
    if (event.trigger?.type !== "loadedmetadata") {
      appendTriggerEvent(event, trackedEvents.get("loaded-metadata"));
    }
    onCanPlayDetail(event.detail);
    $player()?.setAttribute("aria-busy", "false");
  }
  function onCanPlayThrough(event) {
    onCanPlayDetail(event.detail);
    appendTriggerEvent(event, trackedEvents.get("can-play"));
  }
  function onCanPlayDetail({ buffered, seekable }) {
    $media.seekable = seekable;
    $media.buffered = buffered;
    $media.duration = $media.seekableEnd;
    $media.canPlay = true;
  }
  function onDurationChange(event) {
    const duration = event.detail;
    if (!$media.live)
      $media.duration = !Number.isNaN(duration) ? duration : 0;
  }
  function onProgress(event) {
    const { buffered, seekable } = event.detail;
    $media.buffered = buffered;
    $media.seekable = seekable;
    if ($media.live) {
      $media.duration = $media.seekableEnd;
      dispatchEvent($player(), "duration-change", {
        detail: $media.seekableEnd,
        trigger: event
      });
    }
  }
  function onAutoplay(event) {
    appendTriggerEvent(event, trackedEvents.get("play"));
    appendTriggerEvent(event, trackedEvents.get("can-play"));
    $media.autoplayError = void 0;
  }
  function onAutoplayFail(event) {
    appendTriggerEvent(event, trackedEvents.get("play-fail"));
    appendTriggerEvent(event, trackedEvents.get("can-play"));
    $media.autoplayError = event.detail;
    resetTracking();
  }
  function onPlay(event) {
    event.autoplay = $media.attemptingAutoplay;
    if (requests._$isLooping() || !$media.paused) {
      event.stopImmediatePropagation();
      return;
    }
    appendTriggerEvent(event, trackedEvents.get("waiting"));
    satisfyMediaRequest("play", event);
    $media.paused = false;
    $media.autoplayError = void 0;
    if ($media.ended || requests._$isReplay()) {
      requests._$isReplay.set(false);
      $media.ended = false;
      handleMediaEvent(createEvent($player, "replay", { trigger: event }));
    }
  }
  function onPlayFail(event) {
    appendTriggerEvent(event, trackedEvents.get("play"));
    satisfyMediaRequest("play", event);
    $media.paused = true;
    $media.playing = false;
    resetTracking();
  }
  function onPlaying(event) {
    const playEvent = trackedEvents.get("play");
    if (playEvent) {
      appendTriggerEvent(event, trackedEvents.get("waiting"));
      appendTriggerEvent(event, playEvent);
    } else {
      appendTriggerEvent(event, trackedEvents.get("seeked"));
    }
    setTimeout(() => resetTracking(), 0);
    $media.paused = false;
    $media.playing = true;
    $media.seeking = false;
    $media.ended = false;
    if (requests._$isLooping()) {
      event.stopImmediatePropagation();
      requests._$isLooping.set(false);
      return;
    }
    onStarted(event);
  }
  function onStarted(event) {
    if (!$media.started) {
      if ($media.live) {
        const end = $media.liveSyncPosition ?? $media.seekableEnd - 2;
        if (Number.isFinite(end))
          $provider().currentTime = end;
      }
      $media.started = true;
      handleMediaEvent(createEvent($player, "started", { trigger: event }));
    }
  }
  function onPause(event) {
    if (requests._$isLooping()) {
      event.stopImmediatePropagation();
      return;
    }
    appendTriggerEvent(event, trackedEvents.get("seeked"));
    satisfyMediaRequest("pause", event);
    $media.paused = true;
    $media.playing = false;
    $media.seeking = false;
    resetTracking();
  }
  function onTimeUpdate(event) {
    const { currentTime, played } = event.detail;
    $media.currentTime = currentTime;
    $media.played = played;
    $media.waiting = false;
    for (const track of textTracks) {
      if (track.mode === "disabled")
        continue;
      track[TEXT_TRACK_UPDATE_ACTIVE_CUES](currentTime, event);
    }
  }
  function onVolumeChange(event) {
    $media.volume = event.detail.volume;
    $media.muted = event.detail.muted || event.detail.volume === 0;
    satisfyMediaRequest("volume", event);
  }
  function onSeeking(event) {
    $media.seeking = true;
    $media.currentTime = event.detail;
    satisfyMediaRequest("seeking", event);
    if ($media.paused) {
      waitingTriggerEvent = event;
      fireWaitingEvent();
    }
  }
  function onSeeked(event) {
    if (requests._$isSeeking()) {
      $media.seeking = true;
      event.stopImmediatePropagation();
    } else if ($media.seeking) {
      const waitingEvent = trackedEvents.get("waiting");
      appendTriggerEvent(event, waitingEvent);
      if (waitingEvent?.trigger?.type !== "seeking") {
        appendTriggerEvent(event, trackedEvents.get("seeking"));
      }
      if ($media.paused)
        stopWaiting();
      $media.seeking = false;
      if (event.detail !== $media.duration)
        $media.ended = false;
      $media.currentTime = event.detail;
      satisfyMediaRequest("seeked", event);
      const origin = event.originEvent;
      if (origin && origin.isTrusted && !/seek/.test(origin.type)) {
        onStarted(event);
      }
    }
  }
  fireWaitingEvent = functionDebounce(() => {
    if (!waitingTriggerEvent)
      return;
    firingWaiting = true;
    $media.waiting = true;
    $media.playing = false;
    const event = createEvent($player, "waiting", {
      trigger: waitingTriggerEvent
    });
    trackedEvents.set("waiting", event);
    $player()?.dispatchEvent(event);
    waitingTriggerEvent = void 0;
    firingWaiting = false;
  }, 300);
  function onWaiting(event) {
    if (firingWaiting || requests._$isSeeking())
      return;
    event.stopImmediatePropagation();
    waitingTriggerEvent = event;
    fireWaitingEvent();
  }
  function onEnded(event) {
    if (requests._$isLooping()) {
      event.stopImmediatePropagation();
      return;
    }
    $media.paused = true;
    $media.playing = false;
    $media.seeking = false;
    $media.ended = true;
    resetTracking();
  }
  function stopWaiting() {
    fireWaitingEvent?.cancel();
    $media.waiting = false;
  }
  function onFullscreenChange(event) {
    $media.fullscreen = event.detail;
    satisfyMediaRequest("fullscreen", event);
  }
  function onFullscreenError(event) {
    satisfyMediaRequest("fullscreen", event);
  }
  function onPictureInPictureChange(event) {
    $media.pictureInPicture = event.detail;
    satisfyMediaRequest("pip", event);
  }
  function onPictureInPictureError(event) {
    satisfyMediaRequest("pip", event);
  }
  function satisfyMediaRequest(request, event) {
    requests._queue._serve(request, (requestEvent) => {
      event.request = requestEvent;
      appendTriggerEvent(event, requestEvent);
    });
  }
  function handleMediaEvent(event) {
    eventHandlers[event.type]?.(event);
    if (trackedEventType.has(event.type)) {
      trackedEvents.set(event.type, event);
    }
    $player()?.dispatchEvent(event);
  }
  return { handle: handleMediaEvent };
}

// src/player/media/controller/create-controller.ts
function createMediaController(props) {
  const context = {
    $player: signal(null),
    $loader: signal(null),
    $provider: signal(null),
    $store: mediaStore.create(),
    qualities: new VideoQualityList(),
    audioTracks: new AudioTrackList(),
    $$props: {
      $src: props.$src,
      $textTracks: props.$textTracks,
      $preferNativeHLS: props.$preferNativeHLS
    }
  };
  provideContext(mediaContext, context);
  context.logger = useLogger(context.$player);
  context.remote = new MediaRemoteControl(context.logger );
  const $store = context.$store;
  context.$iosControls = computed(
    () => !canFullscreen() && $store.mediaType === "video" && ($store.controls && !props.$playsinline() || $store.fullscreen)
  );
  context.textTracks = new TextTrackList();
  context.textRenderers = new TextRenderers(context);
  const stop = effect(() => {
    if (!context.$store.canLoad)
      return;
    context.textTracks[TEXT_TRACK_CAN_LOAD]();
    stop();
  });
  const requests = new MediaRequestContext(), stateManager = createMediaStateManager(context, requests), requestManager = createMediaRequestManager(context, stateManager, requests, props), delegate = createMediaControllerDelegate(context, stateManager.handle), providerDelegate = useMediaProviderDelegate(context, requestManager, props);
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
  effect(() => {
    $store.providedViewType = props.$viewType();
    $store.providedStreamType = props.$streamType();
  });
  $store.muted = props.$muted() || props.$volume() === 0;
  useMediaPropChange(context, props);
  useMediaCanLoad(context.$player, props.$load, startLoadingMedia);
  useMediaEventsLogger(context, context.logger);
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
    type: STRING
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
var PlayerDefinition = defineCustomElement({
  tagName: "media-player",
  props: mediaPlayerProps,
  setup({ host, props, accessors }) {
    const scope = getScope(), controller = createMediaController(props), context = controller._context, $media = context.$store;
    {
      const logPrinter = createLogPrinter(host.$el);
      effect(() => void (logPrinter.logLevel = props.$logLevel()));
    }
    onAttach(() => {
      host.el.setAttribute("tabindex", "0");
      if (!host.el.hasAttribute("aria-label")) {
        host.el.setAttribute("aria-label", "Media Player");
      }
      context.$player.set(host.el);
      context.remote.setTarget(host.el);
      context.remote.setPlayer(host.el);
      listenEvent(host.el, "find-media-player", ({ detail }) => detail(host.el));
    });
    onConnect(() => {
      dispatchEvent(host.el, "media-player-connect", {
        detail: host.el,
        bubbles: true,
        composed: true
      });
      window.requestAnimationFrame(() => {
        if (isNull($media.canLoadPoster))
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
      $attrs["data-" + (mediaAttrName[prop] ?? camelToKebabCase(prop))] = () => $media[prop];
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
    onDispose(() => {
      dispatchEvent(host.el, "destroy");
    });
    return mergeProperties(
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
          set: noop
        }),
        subscribe: (callback) => scoped(() => effect(() => callback($media)), scope),
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

export { AudioTrackList, List, OutletDefinition, PlayerDefinition, TextRenderers, TextTrackList, VideoQualityList, createTimeRanges, getTimeRangesEnd, getTimeRangesStart, mediaStore, softResetMediaStore };
