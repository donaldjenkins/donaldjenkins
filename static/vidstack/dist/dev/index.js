export { SliderVideoDefinition } from './chunks/chunk-B4PURFCG.js';
export { SliderDefinition } from './chunks/chunk-QIA4F6YO.js';
export { TimeSliderDefinition } from './chunks/chunk-3HQC2NXZ.js';
export { TimeDefinition } from './chunks/chunk-CIYYWSJD.js';
export { ToggleButtonDefinition } from './chunks/chunk-PLMNATOD.js';
export { VolumeSliderDefinition } from './chunks/chunk-J3YL4PYP.js';
import './chunks/chunk-AD6J2PGY.js';
export { PIPButtonDefinition } from './chunks/chunk-V4QDJPZY.js';
export { PlayButtonDefinition } from './chunks/chunk-SGJLRBY3.js';
export { AudioTrackList, List, OutletDefinition, PlayerDefinition, TextRenderers, TextTrackList, VideoQualityList, createTimeRanges, getTimeRangesEnd, getTimeRangesStart, mediaStore, softResetMediaStore } from './chunks/chunk-RXRF33ZE.js';
import './chunks/chunk-JELAJF2G.js';
export { PosterDefinition } from './chunks/chunk-MIQIH4K4.js';
export { MediaRemoteControl } from './chunks/chunk-KHIZ6FLG.js';
export { SeekButtonDefinition } from './chunks/chunk-DWMLKJMI.js';
export { SliderThumbnailDefinition } from './chunks/chunk-BBWCMNMJ.js';
export { SliderValueDefinition } from './chunks/chunk-JFKOUPUH.js';
import './chunks/chunk-E6EPK3UH.js';
import './chunks/chunk-TW2KE7QB.js';
export { sliderStore, sliderStoreContext, useSliderStore } from './chunks/chunk-J5ZUXZE6.js';
export { CaptionButtonDefinition } from './chunks/chunk-AVTYF2Y6.js';
export { CaptionsDefinition } from './chunks/chunk-6NGXVHSW.js';
export { FullscreenButtonDefinition } from './chunks/chunk-3OZWQL7H.js';
export { MediaIconDefinition } from './chunks/chunk-GB67J7MB.js';
export { LiveIndicatorDefinition } from './chunks/chunk-O64PWQBX.js';
export { MuteButtonDefinition } from './chunks/chunk-ZRS2FLW2.js';
import './chunks/chunk-SA4WUWXW.js';
export { MEDIA_KEY_SHORTCUTS, isAudioProvider, isHLSProvider, isHTMLAudioElement, isHTMLMediaElement, isHTMLVideoElement, isVideoProvider } from './chunks/chunk-PRKJFLQC.js';
import './chunks/chunk-25M6M5V2.js';
import './chunks/chunk-QTJNSLXI.js';
import './chunks/chunk-2Q5ZIQUV.js';
import './chunks/chunk-UC3VDTOL.js';
import './chunks/chunk-KKTONNDY.js';
import './chunks/chunk-TOHOCF6L.js';
import { TEXT_TRACK_READY_STATE } from './chunks/chunk-INGY2UVM.js';
export { TextTrack, isTrackCaptionKind } from './chunks/chunk-INGY2UVM.js';
import './chunks/chunk-GLI6O3AL.js';
import './chunks/chunk-CVLY5S52.js';
import './chunks/chunk-25YO7G2G.js';
import './chunks/chunk-YQSJJLRL.js';
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
      this._instance = new mod.default({
        ...this.config,
        video,
        subUrl: this._track?.src || "",
        onReady: () => {
          const canvas = video.parentElement.querySelector(
            ".libassjs-canvas-parent"
          );
          if (canvas)
            canvas.style.pointerEvents = "none";
          this.config?.onReady?.();
        },
        onError: (error) => {
          if (this._track) {
            this._track[TEXT_TRACK_READY_STATE] = 3;
            this._track.dispatchEvent(new DOMEvent("error", { detail: error }));
          }
          this.config?.onError?.(error);
        }
      });
    });
  }
  changeTrack(track) {
    if (!track || track.readyState === 3) {
      this._freeTrack();
    } else if (this._track !== track) {
      this._instance?.setTrackByUrl(track.src);
      this._track = track;
    }
  }
  detach() {
    this._freeTrack();
  }
  _freeTrack() {
    this._instance?.freeTrack();
    this._track = null;
  }
};

// src/index.ts
{
  console.warn("[vidstack] dev mode!");
}

export { LibASSTextRenderer };
