export { SliderVideoDefinition } from './chunks/chunk-B4PURFCG.js';
export { SliderDefinition } from './chunks/chunk-QIA4F6YO.js';
export { TimeSliderDefinition } from './chunks/chunk-3HQC2NXZ.js';
export { TimeDefinition } from './chunks/chunk-CIYYWSJD.js';
export { ToggleButtonDefinition } from './chunks/chunk-PLMNATOD.js';
export { VolumeSliderDefinition } from './chunks/chunk-J3YL4PYP.js';
import './chunks/chunk-AD6J2PGY.js';
export { PIPButtonDefinition } from './chunks/chunk-KWCIC44R.js';
export { PlayButtonDefinition } from './chunks/chunk-LSKYH46J.js';
export { AudioTrackList, List, OutletDefinition, PlayerDefinition, TextRenderers, TextTrackList, VideoQualityList, createTimeRanges, getTimeRangesEnd, getTimeRangesStart, mediaStore, softResetMediaStore } from './chunks/chunk-3BSXTOEP.js';
import './chunks/chunk-JELAJF2G.js';
export { PosterDefinition } from './chunks/chunk-QMDPC5DK.js';
export { MediaRemoteControl } from './chunks/chunk-YGKQUFHH.js';
export { SeekButtonDefinition } from './chunks/chunk-DWMLKJMI.js';
export { SliderThumbnailDefinition } from './chunks/chunk-BBWCMNMJ.js';
export { SliderValueDefinition } from './chunks/chunk-JFKOUPUH.js';
import './chunks/chunk-E6EPK3UH.js';
import './chunks/chunk-TW2KE7QB.js';
export { sliderStore, sliderStoreContext, useSliderStore } from './chunks/chunk-J5ZUXZE6.js';
export { CaptionButtonDefinition } from './chunks/chunk-W6OKVDGJ.js';
export { CaptionsDefinition } from './chunks/chunk-ZXCCWSZM.js';
export { FullscreenButtonDefinition } from './chunks/chunk-4QP372ND.js';
export { MediaIconDefinition } from './chunks/chunk-GB67J7MB.js';
export { LiveIndicatorDefinition } from './chunks/chunk-O64PWQBX.js';
export { MuteButtonDefinition } from './chunks/chunk-MTDXYYUU.js';
import './chunks/chunk-SA4WUWXW.js';
export { MEDIA_KEY_SHORTCUTS, isAudioProvider, isHLSProvider, isHTMLAudioElement, isHTMLMediaElement, isHTMLVideoElement, isVideoProvider } from './chunks/chunk-5K2RNKKZ.js';
import './chunks/chunk-5KMKZTEJ.js';
import './chunks/chunk-UHOBWX4X.js';
import './chunks/chunk-W6G2QAAZ.js';
import './chunks/chunk-OR3KK4Y6.js';
import './chunks/chunk-KKTONNDY.js';
import './chunks/chunk-TOHOCF6L.js';
import { TEXT_TRACK_READY_STATE } from './chunks/chunk-CW3ZGA4K.js';
export { TextTrack, isTrackCaptionKind } from './chunks/chunk-CW3ZGA4K.js';
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
    this.L = null;
    this.g = null;
    this.Y = /(ssa|ass)$/;
  }
  canRender(track) {
    return !!track.src && (isString(track.type) && this.Y.test(track.type) || this.Y.test(track.src));
  }
  attach(video) {
    this.loader().then(async (mod) => {
      this.L = new mod.default({
        ...this.config,
        video,
        subUrl: this.g?.src || "",
        onReady: () => {
          const canvas = video.parentElement.querySelector(
            ".libassjs-canvas-parent"
          );
          if (canvas)
            canvas.style.pointerEvents = "none";
          this.config?.onReady?.();
        },
        onError: (error) => {
          if (this.g) {
            this.g[TEXT_TRACK_READY_STATE] = 3;
            this.g.dispatchEvent(new DOMEvent("error", { detail: error }));
          }
          this.config?.onError?.(error);
        }
      });
    });
  }
  changeTrack(track) {
    if (!track || track.readyState === 3) {
      this.Z();
    } else if (this.g !== track) {
      this.L?.setTrackByUrl(track.src);
      this.g = track;
    }
  }
  detach() {
    this.Z();
  }
  Z() {
    this.L?.freeTrack();
    this.g = null;
  }
};

export { LibASSTextRenderer };
