import { HTMLMediaProvider } from './chunk-OR3KK4Y6.js';
import { canUseVideoPresentation, canUsePictureInPicture, canPlayHLSNatively } from './chunk-KKTONNDY.js';
import { ATTACH_VIDEO, TextTrack, TEXT_TRACK_NATIVE, TEXT_TRACK_READY_STATE, TEXT_TRACK_NATIVE_HLS } from './chunk-CW3ZGA4K.js';
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
    video.textTracks.onaddtrack = null;
    for (const track of context.textTracks) {
      const nativeTrack = track[TEXT_TRACK_NATIVE]?.track;
      if (nativeTrack?.oncuechange)
        nativeTrack.oncuechange = null;
    }
  });
}
function findTextTrackElement(video, track) {
  return Array.from(video.children).find((el) => el.track === track);
}
var VideoPictureInPicture = class {
  constructor(_video, { delegate }) {
    this.c = _video;
    const onChange = (active, event) => {
      delegate.dispatch("picture-in-picture-change", {
        detail: active,
        trigger: event
      });
    };
    listenEvent(this.c, "enterpictureinpicture", (event) => onChange(true, event));
    listenEvent(this.c, "leavepictureinpicture", (event) => onChange(false, event));
  }
  get active() {
    return document.pictureInPictureElement === this.c;
  }
  get supported() {
    return canUsePictureInPicture(this.c);
  }
  async enter() {
    return this.c.requestPictureInPicture();
  }
  exit() {
    return document.exitPictureInPicture();
  }
};
var VideoPresentation = class {
  constructor(_video, { $player, logger, delegate }) {
    this.c = _video;
    this.i = "inline";
    listenEvent(this.c, "webkitpresentationmodechanged", (event) => {
      const prevMode = this.i;
      this.i = this.c.webkitPresentationMode;
      dispatchEvent($player(), "video-presentation-change", {
        detail: this.i,
        trigger: event
      });
      ["fullscreen", "picture-in-picture"].forEach((type) => {
        if (this.i === type || prevMode === type) {
          delegate.dispatch(`${type}-change`, {
            detail: this.i === type,
            trigger: event
          });
        }
      });
    });
  }
  get $() {
    return canUseVideoPresentation(this.c);
  }
  async G(mode) {
    if (this.i === mode)
      return;
    this.c.webkitSetPresentationMode(mode);
  }
};
var FullscreenPresentationAdapter = class {
  constructor(_presentation) {
    this.l = _presentation;
  }
  get active() {
    return this.l.i === "fullscreen";
  }
  get supported() {
    return this.l.$;
  }
  async enter() {
    this.l.G("fullscreen");
  }
  async exit() {
    this.l.G("inline");
  }
};
var PIPPresentationAdapter = class {
  constructor(_presentation) {
    this.l = _presentation;
  }
  get active() {
    return this.l.i === "picture-in-picture";
  }
  get supported() {
    return this.l.$;
  }
  async enter() {
    this.l.G("picture-in-picture");
  }
  async exit() {
    this.l.G("inline");
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
    return this.f;
  }
};
_a = VIDEO_PROVIDER;

export { VIDEO_PROVIDER, VideoProvider };
