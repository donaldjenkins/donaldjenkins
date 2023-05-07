'use strict';

require('maverick.js/ssr');
require('maverick.js');
var element = require('maverick.js/element');
require('maverick.js/std');
require('media-icons');
require('media-captions');

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var MediaIconDefinition;

// src/player/media/providers/audio/provider.ts
var provider_exports = {};
__export(provider_exports, {
  AUDIO_PROVIDER: () => AUDIO_PROVIDER,
  AudioProvider: () => AudioProvider
});
var AUDIO_PROVIDER, AudioProvider;

// src/player/media/providers/video/provider.ts
var provider_exports2 = {};
__export(provider_exports2, {
  VIDEO_PROVIDER: () => VIDEO_PROVIDER,
  VideoProvider: () => VideoProvider
});
var VIDEO_PROVIDER, VideoProvider;

// src/player/media/providers/hls/provider.ts
var provider_exports3 = {};
__export(provider_exports3, {
  HLSProvider: () => HLSProvider,
  HLS_PROVIDER: () => HLS_PROVIDER
});
var HLS_PROVIDER, HLSProvider;
var PlayerDefinition;
var OutletDefinition;
var CaptionButtonDefinition;
var CaptionsDefinition;
var FullscreenButtonDefinition;
var LiveIndicatorDefinition;
var MuteButtonDefinition;
var PIPButtonDefinition;
var PlayButtonDefinition;
var PosterDefinition;
var SeekButtonDefinition;
var SliderThumbnailDefinition;
var SliderValueDefinition;
var SliderVideoDefinition;
var SliderDefinition;
var TimeSliderDefinition;
var TimeDefinition;
var ToggleButtonDefinition;
var VolumeSliderDefinition;

// src/register.ts
var register_exports = {};
__export(register_exports, {
  default: () => registerAllElements
});
function registerAllElements() {
  [
    PlayerDefinition,
    OutletDefinition,
    PosterDefinition,
    MediaIconDefinition,
    PlayButtonDefinition,
    MuteButtonDefinition,
    PIPButtonDefinition,
    FullscreenButtonDefinition,
    CaptionButtonDefinition,
    SeekButtonDefinition,
    SliderDefinition,
    SliderThumbnailDefinition,
    SliderValueDefinition,
    SliderVideoDefinition,
    TimeDefinition,
    TimeSliderDefinition,
    ToggleButtonDefinition,
    VolumeSliderDefinition,
    LiveIndicatorDefinition,
    CaptionsDefinition
  ].map(element.registerLiteCustomElement);
}

// src/elements.ts
async function defineCustomElements() {
  return;
}

exports.defineCustomElements = defineCustomElements;
