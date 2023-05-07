import { SliderVideoDefinition } from './chunk-B4PURFCG.js';
import { SliderDefinition } from './chunk-QIA4F6YO.js';
import { TimeSliderDefinition } from './chunk-3HQC2NXZ.js';
import { TimeDefinition } from './chunk-CIYYWSJD.js';
import { ToggleButtonDefinition } from './chunk-PLMNATOD.js';
import { VolumeSliderDefinition } from './chunk-J3YL4PYP.js';
import './chunk-AD6J2PGY.js';
import { PIPButtonDefinition } from './chunk-V4QDJPZY.js';
import { PlayButtonDefinition } from './chunk-SGJLRBY3.js';
import { PlayerDefinition, OutletDefinition } from './chunk-RXRF33ZE.js';
import './chunk-JELAJF2G.js';
import { PosterDefinition } from './chunk-MIQIH4K4.js';
import './chunk-KHIZ6FLG.js';
import { SeekButtonDefinition } from './chunk-DWMLKJMI.js';
import { SliderThumbnailDefinition } from './chunk-BBWCMNMJ.js';
import { SliderValueDefinition } from './chunk-JFKOUPUH.js';
import './chunk-E6EPK3UH.js';
import './chunk-TW2KE7QB.js';
import './chunk-J5ZUXZE6.js';
import { CaptionButtonDefinition } from './chunk-AVTYF2Y6.js';
import { CaptionsDefinition } from './chunk-6NGXVHSW.js';
import { FullscreenButtonDefinition } from './chunk-3OZWQL7H.js';
import { MediaIconDefinition } from './chunk-GB67J7MB.js';
import { LiveIndicatorDefinition } from './chunk-O64PWQBX.js';
import { MuteButtonDefinition } from './chunk-ZRS2FLW2.js';
import './chunk-SA4WUWXW.js';
import './chunk-PRKJFLQC.js';
import './chunk-25M6M5V2.js';
import './chunk-QTJNSLXI.js';
import './chunk-2Q5ZIQUV.js';
import './chunk-UC3VDTOL.js';
import './chunk-KKTONNDY.js';
import './chunk-TOHOCF6L.js';
import './chunk-INGY2UVM.js';
import './chunk-GLI6O3AL.js';
import './chunk-CVLY5S52.js';
import './chunk-25YO7G2G.js';
import './chunk-YQSJJLRL.js';
import './chunk-3ULVZKKX.js';
import { registerLiteCustomElement } from 'maverick.js/element';

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
  ].map(registerLiteCustomElement);
}

export { registerAllElements as default };
