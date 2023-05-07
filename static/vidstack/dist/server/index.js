export { SliderVideoDefinition } from './chunks/chunk-UCJZRMIA.js';
export { SliderDefinition } from './chunks/chunk-MVXCC4Y5.js';
export { TimeSliderDefinition } from './chunks/chunk-FSXWJGDT.js';
export { TimeDefinition } from './chunks/chunk-KTPJTFSN.js';
export { ToggleButtonDefinition } from './chunks/chunk-G4HEK3DX.js';
export { VolumeSliderDefinition } from './chunks/chunk-TRXMCZNO.js';
import './chunks/chunk-L4CLTNDQ.js';
export { PIPButtonDefinition } from './chunks/chunk-D7LKHHDW.js';
export { PlayButtonDefinition } from './chunks/chunk-N35NRCYC.js';
export { AudioTrackList, List, OutletDefinition, PlayerDefinition, TextRenderers, TextTrackList, VideoQualityList, createTimeRanges, getTimeRangesEnd, getTimeRangesStart, mediaStore, softResetMediaStore } from './chunks/chunk-AZ22X7MY.js';
import './chunks/chunk-JELAJF2G.js';
export { PosterDefinition } from './chunks/chunk-ZD7YDOJF.js';
export { MediaRemoteControl } from './chunks/chunk-HFEWFZN4.js';
export { SeekButtonDefinition } from './chunks/chunk-DTFSCEI7.js';
export { SliderThumbnailDefinition } from './chunks/chunk-N5HPQHHS.js';
export { SliderValueDefinition } from './chunks/chunk-CA53UNZI.js';
import './chunks/chunk-E6EPK3UH.js';
import './chunks/chunk-TW2KE7QB.js';
export { sliderStore, sliderStoreContext, useSliderStore } from './chunks/chunk-J5ZUXZE6.js';
export { CaptionButtonDefinition } from './chunks/chunk-3GEV7DLQ.js';
export { CaptionsDefinition } from './chunks/chunk-6NGXVHSW.js';
export { FullscreenButtonDefinition } from './chunks/chunk-FDBKHEGE.js';
export { MediaIconDefinition } from './chunks/chunk-CD65GM7M.js';
export { LiveIndicatorDefinition } from './chunks/chunk-WXCRUBAT.js';
export { MuteButtonDefinition } from './chunks/chunk-B3GZ32UQ.js';
import './chunks/chunk-F77P4SG6.js';
export { MEDIA_KEY_SHORTCUTS, isAudioProvider, isHLSProvider, isHTMLAudioElement, isHTMLMediaElement, isHTMLVideoElement, isVideoProvider } from './chunks/chunk-FPSFPUBI.js';
import './chunks/chunk-4W57WRRP.js';
import './chunks/chunk-2GEHKEZA.js';
import './chunks/chunk-4CA2OYTC.js';
import './chunks/chunk-LYPKAAFP.js';
import './chunks/chunk-L5JIQHZZ.js';
import './chunks/chunk-HJOTOEX7.js';
import { TEXT_TRACK_READY_STATE } from './chunks/chunk-BCHRLKDT.js';
export { TextTrack, isTrackCaptionKind } from './chunks/chunk-BCHRLKDT.js';
import './chunks/chunk-IWORFIII.js';
import './chunks/chunk-N2X5VJTG.js';
import './chunks/chunk-EWIZ7YX3.js';
import './chunks/chunk-FU2MDXXS.js';
export { mediaContext } from './chunks/chunk-3ULVZKKX.js';
import { isString, DOMEvent } from 'maverick.js/std';
export { appendTriggerEvent, findTriggerEvent, hasTriggerEvent, walkTriggerEventChain } from 'maverick.js/std';

var LibASSTextRenderer = class {
  constructor(loader, config) {
    this.loader = loader;
    this.config = config;
    this.priority = 1;
    this._instance = null;
    this._track = null;
    this._typeRE = /(ssa|ass)$/;
  }
  canRender(track) {
    return !!track.src && (isString(track.type) && this._typeRE.test(track.type) || this._typeRE.test(track.src));
  }
  attach(video) {
    this.loader().then(async (mod) => {
      var _a;
      this._instance = new mod.default({
        ...this.config,
        video,
        subUrl: ((_a = this._track) == null ? void 0 : _a.src) || "",
        onReady: () => {
          var _a2, _b;
          const canvas = video.parentElement.querySelector(
            ".libassjs-canvas-parent"
          );
          if (canvas)
            canvas.style.pointerEvents = "none";
          (_b = (_a2 = this.config) == null ? void 0 : _a2.onReady) == null ? void 0 : _b.call(_a2);
        },
        onError: (error) => {
          var _a2, _b;
          if (this._track) {
            this._track[TEXT_TRACK_READY_STATE] = 3;
            this._track.dispatchEvent(new DOMEvent("error", { detail: error }));
          }
          (_b = (_a2 = this.config) == null ? void 0 : _a2.onError) == null ? void 0 : _b.call(_a2, error);
        }
      });
    });
  }
  changeTrack(track) {
    var _a;
    if (!track || track.readyState === 3) {
      this._freeTrack();
    } else if (this._track !== track) {
      (_a = this._instance) == null ? void 0 : _a.setTrackByUrl(track.src);
      this._track = track;
    }
  }
  detach() {
    this._freeTrack();
  }
  _freeTrack() {
    var _a;
    (_a = this._instance) == null ? void 0 : _a.freeTrack();
    this._track = null;
  }
};

export { LibASSTextRenderer };
