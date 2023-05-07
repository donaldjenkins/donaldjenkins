import { HTMLMediaProvider } from './chunk-LYPKAAFP.js';
import { canUseVideoPresentation, canUsePictureInPicture, canPlayHLSNatively } from './chunk-L5JIQHZZ.js';
import { ATTACH_VIDEO, TextTrack, TEXT_TRACK_NATIVE, TEXT_TRACK_READY_STATE, TEXT_TRACK_NATIVE_HLS } from './chunk-BCHRLKDT.js';
import { onDispose } from 'maverick.js';
import { listenEvent, dispatchEvent } from 'maverick.js/std';

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
  onDispose(() => {
    var _a2;
    video.textTracks.onaddtrack = null;
    for (const track of context.textTracks) {
      const nativeTrack = (_a2 = track[TEXT_TRACK_NATIVE]) == null ? void 0 : _a2.track;
      if (nativeTrack == null ? void 0 : nativeTrack.oncuechange)
        nativeTrack.oncuechange = null;
    }
  });
}
function findTextTrackElement(video, track) {
  return Array.from(video.children).find((el) => el.track === track);
}
var VideoPictureInPicture = class {
  constructor(_video, { delegate }) {
    this._video = _video;
    const onChange = (active, event) => {
      delegate.dispatch("picture-in-picture-change", {
        detail: active,
        trigger: event
      });
    };
    listenEvent(this._video, "enterpictureinpicture", (event) => onChange(true, event));
    listenEvent(this._video, "leavepictureinpicture", (event) => onChange(false, event));
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
var VideoPresentation = class {
  constructor(_video, { $player, logger, delegate }) {
    this._video = _video;
    this._mode = "inline";
    listenEvent(this._video, "webkitpresentationmodechanged", (event) => {
      const prevMode = this._mode;
      this._mode = this._video.webkitPresentationMode;
      dispatchEvent($player(), "video-presentation-change", {
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
var FullscreenPresentationAdapter = class {
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
var PIPPresentationAdapter = class {
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

// src/player/media/providers/video/provider.ts
var VIDEO_PROVIDER = Symbol(0);
var _a;
var VideoProvider = class extends HTMLMediaProvider {
  constructor(video, context) {
    super(video);
    this[_a] = true;
    if (canUseVideoPresentation(video)) {
      const presentation = new VideoPresentation(video, context);
      this.fullscreen = new FullscreenPresentationAdapter(presentation);
      this.pictureInPicture = new PIPPresentationAdapter(presentation);
    } else if (canUsePictureInPicture(video)) {
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
    onDispose(() => {
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
_a = VIDEO_PROVIDER;

export { VIDEO_PROVIDER, VideoProvider };
