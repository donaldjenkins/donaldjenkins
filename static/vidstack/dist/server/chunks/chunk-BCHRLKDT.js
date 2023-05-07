import { EventsTarget, DOMEvent } from 'maverick.js/std';

// src/player/media/tracks/text/symbols.ts
var ATTACH_VIDEO = Symbol(0);
var TEXT_TRACK_READY_STATE = Symbol(0);
var TEXT_TRACK_UPDATE_ACTIVE_CUES = Symbol(0);
var TEXT_TRACK_CAN_LOAD = Symbol(0);
var TEXT_TRACK_ON_MODE_CHANGE = Symbol(0);
var TEXT_TRACK_NATIVE = Symbol(0);
var TEXT_TRACK_NATIVE_HLS = Symbol(0);
var _a, _b, _c;
var TextTrack = class extends EventsTarget {
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
    this[_a] = 0;
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
    var _a2;
    let i = 0, length = this._cues.length;
    for (i = 0; i < length; i++)
      if (cue.endTime <= this._cues[i].startTime)
        break;
    if (i === length)
      this._cues.push(cue);
    else
      this._cues.splice(i, 0, cue);
    if ((trigger == null ? void 0 : trigger.type) !== "cuechange") {
      (_a2 = this[TEXT_TRACK_NATIVE]) == null ? void 0 : _a2.track.addCue(cue);
    }
    this.dispatchEvent(new DOMEvent("add-cue", { detail: cue, trigger }));
    if (cue.startTime >= this._currentTime && cue.endTime <= this._currentTime) {
      this[TEXT_TRACK_UPDATE_ACTIVE_CUES](this._currentTime, trigger);
    }
  }
  removeCue(cue, trigger) {
    var _a2;
    const index = this._cues.indexOf(cue);
    if (index >= 0) {
      const isActive = this._activeCues.includes(cue);
      this._cues.splice(index, 1);
      (_a2 = this[TEXT_TRACK_NATIVE]) == null ? void 0 : _a2.track.removeCue(cue);
      this.dispatchEvent(new DOMEvent("remove-cue", { detail: cue, trigger }));
      if (isActive) {
        this[TEXT_TRACK_UPDATE_ACTIVE_CUES](this._currentTime, trigger);
      }
    }
  }
  setMode(mode, trigger) {
    var _a2;
    if (this._mode === mode)
      return;
    this._mode = mode;
    if (mode === "disabled") {
      this._activeCues = [];
      this._activeCuesChanged();
    } else {
      this._load();
    }
    this.dispatchEvent(new DOMEvent("mode-change", { detail: this, trigger }));
    (_a2 = this[TEXT_TRACK_ON_MODE_CHANGE]) == null ? void 0 : _a2.call(this);
  }
  /* @internal */
  [(_a = TEXT_TRACK_READY_STATE, _b = TEXT_TRACK_ON_MODE_CHANGE, _c = TEXT_TRACK_NATIVE, TEXT_TRACK_UPDATE_ACTIVE_CUES)](currentTime, trigger) {
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
    var _a2, _b2;
    if (!this._canLoad || !this.src || this[TEXT_TRACK_READY_STATE] > 0)
      return;
    this[TEXT_TRACK_READY_STATE] = 1;
    this.dispatchEvent(new DOMEvent("load-start"));
    try {
      const { parseResponse } = await import('media-captions');
      const { errors, metadata, regions, cues } = await parseResponse(fetch(this.src), {
        type: this.type,
        encoding: this.encoding
      });
      if (((_a2 = errors[0]) == null ? void 0 : _a2.code) === 0) {
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
        this.dispatchEvent(new DOMEvent("load"));
      }
    } catch (error) {
      this[TEXT_TRACK_READY_STATE] = 3;
      this.dispatchEvent(new DOMEvent("error", { detail: error }));
    }
  }
  _activeCuesChanged(trigger) {
    this.dispatchEvent(new DOMEvent("cue-change", { trigger }));
  }
};
var captionRE = /captions|subtitles/;
function isTrackCaptionKind(track) {
  return captionRE.test(track.kind);
}

export { ATTACH_VIDEO, TEXT_TRACK_CAN_LOAD, TEXT_TRACK_NATIVE, TEXT_TRACK_NATIVE_HLS, TEXT_TRACK_ON_MODE_CHANGE, TEXT_TRACK_READY_STATE, TEXT_TRACK_UPDATE_ACTIVE_CUES, TextTrack, isTrackCaptionKind };