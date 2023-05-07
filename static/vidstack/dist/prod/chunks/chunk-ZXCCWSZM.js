import { useMedia } from './chunk-3ULVZKKX.js';
import { effect, peek } from 'maverick.js';
import { defineCustomElement, onConnect } from 'maverick.js/element';
import { setAttribute, createDisposalBin, listenEvent } from 'maverick.js/std';
import { CaptionsRenderer, renderVTTCueString, updateTimedVTTCueNodes } from 'media-captions';

var CaptionsTextRenderer = class {
  constructor(_renderer) {
    this.B = _renderer;
    this.priority = 10;
    this.g = null;
    this.H = createDisposalBin();
  }
  attach() {
  }
  canRender() {
    return true;
  }
  detach() {
    this.H.empty();
    this.B.reset();
    this.g = null;
  }
  changeTrack(track) {
    if (!track || this.g === track)
      return;
    this.H.empty();
    if (track.readyState < 2) {
      this.B.reset();
      this.H.add(
        listenEvent(track, "load", () => this.aa(track), { once: true })
      );
    } else {
      this.aa(track);
    }
    this.H.add(
      listenEvent(track, "add-cue", (event) => {
        this.B.addCue(event.detail);
      }),
      listenEvent(track, "remove-cue", (event) => {
        this.B.removeCue(event.detail);
      })
    );
    this.g = track;
  }
  aa(track) {
    this.B.changeTrack({
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
