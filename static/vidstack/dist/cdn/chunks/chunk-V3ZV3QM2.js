import { HTMLMediaProvider } from './chunk-XUPMJMXW.js';

// src/player/media/providers/audio/provider.ts
var AUDIO_PROVIDER = Symbol("AUDIO_PROVIDER" );
var _a;
var AudioProvider = class extends HTMLMediaProvider {
  constructor() {
    super(...arguments);
    this[_a] = true;
  }
  get type() {
    return "audio";
  }
  setup(context) {
    super.setup(context);
    if (this.type === "audio")
      context.delegate.dispatch("provider-setup", { detail: this });
  }
  /**
   * The native HTML `<audio>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
   */
  get audio() {
    return this._media;
  }
};
_a = AUDIO_PROVIDER;

export { AUDIO_PROVIDER, AudioProvider };
