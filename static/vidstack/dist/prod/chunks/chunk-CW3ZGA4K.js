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
    this.p = false;
    this.s = 0;
    this.i = "disabled";
    this.Q = {};
    this.R = [];
    this.j = [];
    this.q = [];
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
    return this.Q;
  }
  get regions() {
    return this.R;
  }
  get cues() {
    return this.j;
  }
  get activeCues() {
    return this.q;
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
    return this.i;
  }
  set mode(mode) {
    this.setMode(mode);
  }
  addCue(cue, trigger) {
    let i = 0, length = this.j.length;
    for (i = 0; i < length; i++)
      if (cue.endTime <= this.j[i].startTime)
        break;
    if (i === length)
      this.j.push(cue);
    else
      this.j.splice(i, 0, cue);
    if (trigger?.type !== "cuechange") {
      this[TEXT_TRACK_NATIVE]?.track.addCue(cue);
    }
    this.dispatchEvent(new DOMEvent("add-cue", { detail: cue, trigger }));
    if (cue.startTime >= this.s && cue.endTime <= this.s) {
      this[TEXT_TRACK_UPDATE_ACTIVE_CUES](this.s, trigger);
    }
  }
  removeCue(cue, trigger) {
    const index = this.j.indexOf(cue);
    if (index >= 0) {
      const isActive = this.q.includes(cue);
      this.j.splice(index, 1);
      this[TEXT_TRACK_NATIVE]?.track.removeCue(cue);
      this.dispatchEvent(new DOMEvent("remove-cue", { detail: cue, trigger }));
      if (isActive) {
        this[TEXT_TRACK_UPDATE_ACTIVE_CUES](this.s, trigger);
      }
    }
  }
  setMode(mode, trigger) {
    if (this.i === mode)
      return;
    this.i = mode;
    if (mode === "disabled") {
      this.q = [];
      this.S();
    } else {
      this.T();
    }
    this.dispatchEvent(new DOMEvent("mode-change", { detail: this, trigger }));
    this[TEXT_TRACK_ON_MODE_CHANGE]?.();
  }
  /* @internal */
  [(_a = TEXT_TRACK_READY_STATE, _b = TEXT_TRACK_ON_MODE_CHANGE, _c = TEXT_TRACK_NATIVE, TEXT_TRACK_UPDATE_ACTIVE_CUES)](currentTime, trigger) {
    this.s = currentTime;
    if (this.mode === "disabled" || !this.j.length)
      return;
    const activeCues = [];
    for (let i = 0, length = this.j.length; i < length; i++) {
      const cue = this.j[i];
      if (currentTime >= cue.startTime && currentTime <= cue.endTime) {
        activeCues.push(cue);
      }
    }
    let changed = activeCues.length !== this.q.length;
    if (!changed) {
      for (let i = 0; i < activeCues.length; i++) {
        if (!this.q.includes(activeCues[i])) {
          changed = true;
          break;
        }
      }
    }
    this.q = activeCues;
    if (changed)
      this.S(trigger);
  }
  /* @internal */
  [TEXT_TRACK_CAN_LOAD]() {
    this.p = true;
    if (this.i !== "disabled")
      this.T();
  }
  async T() {
    if (!this.p || !this.src || this[TEXT_TRACK_READY_STATE] > 0)
      return;
    this[TEXT_TRACK_READY_STATE] = 1;
    this.dispatchEvent(new DOMEvent("load-start"));
    try {
      const { parseResponse } = await import('media-captions');
      const { errors, metadata, regions, cues } = await parseResponse(fetch(this.src), {
        type: this.type,
        encoding: this.encoding
      });
      if (errors[0]?.code === 0) {
        throw errors[0];
      } else {
        this.Q = metadata;
        this.R = regions;
        this.j = cues;
        this[TEXT_TRACK_READY_STATE] = 2;
        const nativeTrack = this[TEXT_TRACK_NATIVE]?.track;
        if (nativeTrack)
          for (const cue of this.j)
            nativeTrack.addCue(cue);
        this.dispatchEvent(new DOMEvent("load"));
      }
    } catch (error) {
      this[TEXT_TRACK_READY_STATE] = 3;
      this.dispatchEvent(new DOMEvent("error", { detail: error }));
    }
  }
  S(trigger) {
    this.dispatchEvent(new DOMEvent("cue-change", { trigger }));
  }
};
var captionRE = /captions|subtitles/;
function isTrackCaptionKind(track) {
  return captionRE.test(track.kind);
}

export { ATTACH_VIDEO, TEXT_TRACK_CAN_LOAD, TEXT_TRACK_NATIVE, TEXT_TRACK_NATIVE_HLS, TEXT_TRACK_ON_MODE_CHANGE, TEXT_TRACK_READY_STATE, TEXT_TRACK_UPDATE_ACTIVE_CUES, TextTrack, isTrackCaptionKind };
