'use strict';

var element = require('maverick.js/element');
var maverick_js = require('maverick.js');
var std = require('maverick.js/std');
var mediaCaptions = require('media-captions');

// src/define/media-captions.ts
var mediaContext = maverick_js.createContext();
function useMedia() {
  return maverick_js.useContext(mediaContext);
}
var CaptionsTextRenderer = class {
  constructor(_renderer) {
    this._renderer = _renderer;
    this.priority = 10;
    this._track = null;
    this._disposal = std.createDisposalBin();
  }
  attach() {
  }
  canRender() {
    return true;
  }
  detach() {
    this._disposal.empty();
    this._renderer.reset();
    this._track = null;
  }
  changeTrack(track) {
    if (!track || this._track === track)
      return;
    this._disposal.empty();
    if (track.readyState < 2) {
      this._renderer.reset();
      this._disposal.add(
        std.listenEvent(track, "load", () => this._changeTrack(track), { once: true })
      );
    } else {
      this._changeTrack(track);
    }
    this._disposal.add(
      std.listenEvent(track, "add-cue", (event) => {
        this._renderer.addCue(event.detail);
      }),
      std.listenEvent(track, "remove-cue", (event) => {
        this._renderer.removeCue(event.detail);
      })
    );
    this._track = track;
  }
  _changeTrack(track) {
    this._renderer.changeTrack({
      cues: [...track.cues],
      regions: [...track.regions]
    });
  }
};

// src/player/ui/captions/element.tsx
var CaptionsDefinition = element.defineCustomElement({
  tagName: "media-captions",
  props: { textDir: { initial: "ltr" } },
  setup({ host, props }) {
    element.onConnect(() => {
      const { $store: $media, textRenderers } = useMedia();
      const renderer = new mediaCaptions.CaptionsRenderer(host.el), textRenderer = new CaptionsTextRenderer(renderer);
      maverick_js.effect(() => {
        std.setAttribute(host.el, "data-hidden", !$media.textTrack);
      });
      function setupAudio() {
        maverick_js.effect(() => {
          if (!$media.textTrack)
            return;
          std.listenEvent($media.textTrack, "cue-change", () => {
            host.el.textContent = "";
            const currentTime = maverick_js.peek(() => $media.currentTime);
            for (const cue of $media.textTrack.activeCues) {
              const el = document.createElement("div");
              el.setAttribute("part", "cue");
              el.innerHTML = mediaCaptions.renderVTTCueString(cue, currentTime);
              host.el.append(el);
            }
          });
          maverick_js.effect(() => {
            mediaCaptions.updateTimedVTTCueNodes(host.el, $media.currentTime);
          });
        });
        return () => {
          host.el.textContent = "";
        };
      }
      function setupVideo() {
        maverick_js.effect(() => {
          renderer.dir = props.$textDir();
        });
        maverick_js.effect(() => {
          if (!$media.textTrack)
            return;
          renderer.currentTime = $media.currentTime;
        });
        textRenderers.add(textRenderer);
        return () => {
          textRenderer.detach();
          textRenderers.remove(textRenderer);
        };
      }
      maverick_js.effect(() => {
        if ($media.viewType === "audio") {
          return setupAudio();
        } else {
          return setupVideo();
        }
      });
      return () => {
        textRenderer.detach();
        textRenderers.remove(textRenderer);
        renderer.destroy();
      };
    });
  }
});

// src/define/media-captions.ts
element.registerLiteCustomElement(CaptionsDefinition);
