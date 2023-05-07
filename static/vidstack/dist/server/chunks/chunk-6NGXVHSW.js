import { useMedia } from './chunk-3ULVZKKX.js';
import { effect, peek } from 'maverick.js';
import { defineCustomElement, onConnect } from 'maverick.js/element';
import { setAttribute, createDisposalBin, listenEvent } from 'maverick.js/std';
import { CaptionsRenderer, renderVTTCueString, updateTimedVTTCueNodes } from 'media-captions';

var CaptionsTextRenderer = class {
  constructor(_renderer) {
    this._renderer = _renderer;
    this.priority = 10;
    this._track = null;
    this._disposal = createDisposalBin();
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
        listenEvent(track, "load", () => this._changeTrack(track), { once: true })
      );
    } else {
      this._changeTrack(track);
    }
    this._disposal.add(
      listenEvent(track, "add-cue", (event) => {
        this._renderer.addCue(event.detail);
      }),
      listenEvent(track, "remove-cue", (event) => {
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
var CaptionsDefinition = defineCustomElement({
  tagName: "media-captions",
  props: { textDir: { initial: "ltr" } },
  setup({ host, props }) {
    onConnect(() => {
      const { $store: $media, textRenderers } = useMedia();
      const renderer = new CaptionsRenderer(host.el), textRenderer = new CaptionsTextRenderer(renderer);
      effect(() => {
        setAttribute(host.el, "data-hidden", !$media.textTrack);
      });
      function setupAudio() {
        effect(() => {
          if (!$media.textTrack)
            return;
          listenEvent($media.textTrack, "cue-change", () => {
            host.el.textContent = "";
            const currentTime = peek(() => $media.currentTime);
            for (const cue of $media.textTrack.activeCues) {
              const el = document.createElement("div");
              el.setAttribute("part", "cue");
              el.innerHTML = renderVTTCueString(cue, currentTime);
              host.el.append(el);
            }
          });
          effect(() => {
            updateTimedVTTCueNodes(host.el, $media.currentTime);
          });
        });
        return () => {
          host.el.textContent = "";
        };
      }
      function setupVideo() {
        effect(() => {
          renderer.dir = props.$textDir();
        });
        effect(() => {
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
      effect(() => {
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

export { CaptionsDefinition };
