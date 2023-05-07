import './chunk-JELAJF2G.js';
import { MediaRemoteControl } from './chunk-HFEWFZN4.js';
import { useKeyboard, MEDIA_KEY_SHORTCUTS } from './chunk-FPSFPUBI.js';
import { SET_AUTO_QUALITY, ENABLE_AUTO_QUALITY } from './chunk-4W57WRRP.js';
import { LIST_READONLY, LIST_ADD, LIST_REMOVE, LIST_ON_REMOVE, LIST_RESET, LIST_SET_READONLY, LIST_ON_RESET, LIST_ON_USER_SELECT, LIST_SELECT, AUDIO_EXTENSIONS, AUDIO_TYPES, VIDEO_EXTENSIONS, VIDEO_TYPES, isHLSSrc, HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES } from './chunk-LYPKAAFP.js';
import { isHLSSupported, canOrientScreen } from './chunk-L5JIQHZZ.js';
import { preconnect } from './chunk-HJOTOEX7.js';
import { isTrackCaptionKind, ATTACH_VIDEO, TEXT_TRACK_NATIVE_HLS, TextTrack, TEXT_TRACK_CAN_LOAD, TEXT_TRACK_ON_MODE_CHANGE, TEXT_TRACK_NATIVE } from './chunk-BCHRLKDT.js';
import { clampNumber } from './chunk-N2X5VJTG.js';
import { useFocusVisible } from './chunk-FU2MDXXS.js';
import { useMedia, mediaContext } from './chunk-3ULVZKKX.js';
import { listenEvent, dispatchEvent, isNull, camelToKebabCase, mergeProperties, noop, EventsTarget, DOMEvent, isArray, isUndefined, isString, deferredPromise } from 'maverick.js/std';
import { createStore, signal, getScope, onDispose, scoped, effect, tick, computed, provideContext, peek } from 'maverick.js';
import { defineCustomElement, onAttach, onConnect, STRING } from 'maverick.js/element';
import { $$_ssr, $$_attr } from 'maverick.js/ssr';

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
    var _a2;
    const index = this._items.indexOf(item);
    if (index >= 0) {
      (_a2 = this[LIST_ON_REMOVE]) == null ? void 0 : _a2.call(this, item, trigger);
      this._items.splice(index, 1);
      this.dispatchEvent(new DOMEvent("remove", { detail: item, trigger }));
    }
  }
  /* @internal */
  [LIST_RESET](trigger) {
    var _a2;
    for (const item of [...this._items])
      this[LIST_REMOVE](item, trigger);
    this._items = [];
    this[LIST_SET_READONLY](false, trigger);
    (_a2 = this[LIST_ON_RESET]) == null ? void 0 : _a2.call(this);
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
function emptyTimeRange() {
  throw new Error("empty");
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
    var _a2, _b;
    (_b = (_a2 = track[TEXT_TRACK_NATIVE]) == null ? void 0 : _a2.remove) == null ? void 0 : _b.call(_a2);
    track[TEXT_TRACK_NATIVE] = null;
    this._tracks.delete(track);
  }
  changeTrack(track) {
    var _a2;
    const prev = (_a2 = this._track) == null ? void 0 : _a2[TEXT_TRACK_NATIVE], current = track == null ? void 0 : track[TEXT_TRACK_NATIVE];
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
    var _a2;
    if ((_a2 = native.cues) == null ? void 0 : _a2.length)
      return;
    for (const cue of track.cues)
      native.addCue(cue);
  }
  _onChange(event) {
    var _a2;
    for (const track of this._tracks) {
      const nativeTrack = (_a2 = track[TEXT_TRACK_NATIVE]) == null ? void 0 : _a2.track;
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
    var _a2;
    if (!isTrackCaptionKind(track))
      return;
    (_a2 = this._nativeRenderer) == null ? void 0 : _a2.addTrack(track);
  }
  _removeNativeTrack(track) {
    var _a2;
    if (!isTrackCaptionKind(track))
      return;
    (_a2 = this._nativeRenderer) == null ? void 0 : _a2.removeTrack(track);
  }
  _update() {
    var _a2, _b, _c;
    if (!this._video) {
      this._detach();
      return;
    }
    const currentTrack = this._textTracks.selected;
    if (this._nativeDisplay || (currentTrack == null ? void 0 : currentTrack[TEXT_TRACK_NATIVE_HLS])) {
      (_a2 = this._customRenderer) == null ? void 0 : _a2.changeTrack(null);
      this._nativeRenderer.setDisplay(true);
      this._nativeRenderer.changeTrack(currentTrack);
      return;
    }
    this._nativeRenderer.setDisplay(false);
    this._nativeRenderer.changeTrack(null);
    if (!currentTrack) {
      (_b = this._customRenderer) == null ? void 0 : _b.changeTrack(null);
      return;
    }
    const customRenderer = this._renderers.sort((a, b) => a.priority - b.priority).find((loader) => loader.canRender(currentTrack));
    if (this._customRenderer !== customRenderer) {
      (_c = this._customRenderer) == null ? void 0 : _c.detach();
      customRenderer == null ? void 0 : customRenderer.attach(this._video);
      this._customRenderer = customRenderer ?? null;
    }
    customRenderer == null ? void 0 : customRenderer.changeTrack(currentTrack);
  }
  _detach() {
    var _a2, _b;
    (_a2 = this._nativeRenderer) == null ? void 0 : _a2.detach();
    this._nativeRenderer = null;
    (_b = this._customRenderer) == null ? void 0 : _b.detach();
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
      new DOMEvent("mode-change", {
        detail: event.detail,
        trigger: event
      })
    );
  }
};
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
        var _a2;
        if (this.readonly)
          return;
        (_a2 = this[LIST_ON_USER_SELECT]) == null ? void 0 : _a2.call(this);
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
var $$_templ = ["<!$><audio", "", "", "", "", ' preload="none"></audio>'];
var AudioProviderLoader = class {
  canPlay({ src, type }) {
    return isString(src) ? AUDIO_EXTENSIONS.test(src) || AUDIO_TYPES.has(type) || src.startsWith("blob:") && type === "audio/object" : type === "audio/object";
  }
  mediaType() {
    return "audio";
  }
  async load() {
    return new (await import('./provider-QMMAWJJQ.js')).AudioProvider(this._audio);
  }
  render($store) {
    {
      const src = $store.source.src;
      return $$_ssr(
        $$_templ,
        $$_attr("src", isString(src) ? src : null),
        $$_attr("muted", $store.muted),
        $$_attr("controls", $store.controls),
        $$_attr("crossorigin", $store.crossorigin),
        $$_attr("playsinline", $store.playsinline)
      );
    }
  }
};
var $$_templ2 = ["<!$><video", "", "", "", "", "", ' preload="none"></video>'];
var VideoProviderLoader = class {
  canPlay(src) {
    return isString(src.src) ? VIDEO_EXTENSIONS.test(src.src) || VIDEO_TYPES.has(src.type) || src.src.startsWith("blob:") && src.type === "video/object" || isHLSSrc(src) && true : src.type === "video/object";
  }
  mediaType() {
    return "video";
  }
  async load(context) {
    return new (await import('./provider-NPH4GTTP.js')).VideoProvider(this._video, context);
  }
  render($store) {
    {
      const src = $store.source.src;
      return $$_ssr(
        $$_templ2,
        $$_attr("src", isString(src) ? src : null),
        $$_attr("poster", $store.poster),
        $$_attr("muted", $store.muted),
        $$_attr("controls", $store.controls),
        $$_attr("crossorigin", $store.crossorigin),
        $$_attr("playsinline", $store.playsinline)
      );
    }
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
    return new (await import('./provider-MHELCZCT.js')).HLSProvider(this._video, context);
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
    "[vidstack] no fullscreen API"
  );
}

// src/player/media/controller/can-load.ts
function useMediaCanLoad($controller, $load, callback) {
  return;
}
function createMediaControllerDelegate({ $player, $store, logger }, handle) {
  {
    return {
      dispatch: noop,
      ready: noop
    };
  }
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
    var _a2;
    (_a2 = this._queue.get(key2)) == null ? void 0 : _a2();
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
    "[vidstack] no orientation API"
  );
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
    var _a2;
    return ((_a2 = this._queue.get(key2)) == null ? void 0 : _a2.size) ?? 0;
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
  const user = createMediaUser($player, $media), orientation = createScreenOrientationAdapter($player); createFullscreenAdapter($player);
  {
    return {
      _user: user,
      _orientation: orientation,
      _play: noop,
      _pause: noop,
      _seekToLiveEdge: noop,
      _enterFullscreen: noop,
      _exitFullscreen: noop,
      _enterPictureInPicture: noop,
      _exitPictureInPicture: noop
    };
  }
}
var MediaRequestContext = class {
  constructor() {
    this._queue = new Queue();
    this._$isSeeking = signal(false);
    this._$isLooping = signal(false);
    this._$isReplay = signal(false);
  }
};
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
  return { handle: noop };
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
  context.remote = new MediaRemoteControl(void 0);
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
  effect(() => {
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
