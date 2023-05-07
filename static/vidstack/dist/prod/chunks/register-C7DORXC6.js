import { SliderVideoDefinition } from './chunk-B4PURFCG.js';
import { SliderDefinition } from './chunk-QIA4F6YO.js';
import { TimeSliderDefinition } from './chunk-3HQC2NXZ.js';
import { TimeDefinition } from './chunk-CIYYWSJD.js';
import { ToggleButtonDefinition } from './chunk-PLMNATOD.js';
import { VolumeSliderDefinition } from './chunk-J3YL4PYP.js';
import './chunk-AD6J2PGY.js';
import { PIPButtonDefinition } from './chunk-KWCIC44R.js';
import { PlayButtonDefinition } from './chunk-LSKYH46J.js';
import { PlayerDefinition, OutletDefinition } from './chunk-3BSXTOEP.js';
import './chunk-JELAJF2G.js';
import { PosterDefinition } from './chunk-QMDPC5DK.js';
import './chunk-YGKQUFHH.js';
import { SeekButtonDefinition } from './chunk-DWMLKJMI.js';
import { SliderThumbnailDefinition } from './chunk-BBWCMNMJ.js';
import { SliderValueDefinition } from './chunk-JFKOUPUH.js';
import './chunk-E6EPK3UH.js';
import './chunk-TW2KE7QB.js';
import './chunk-J5ZUXZE6.js';
import { CaptionButtonDefinition } from './chunk-W6OKVDGJ.js';
import { CaptionsDefinition } from './chunk-ZXCCWSZM.js';
import { FullscreenButtonDefinition } from './chunk-4QP372ND.js';
import { MediaIconDefinition } from './chunk-GB67J7MB.js';
import { LiveIndicatorDefinition } from './chunk-O64PWQBX.js';
import { MuteButtonDefinition } from './chunk-MTDXYYUU.js';
import './chunk-SA4WUWXW.js';
import './chunk-5K2RNKKZ.js';
import './chunk-5KMKZTEJ.js';
import './chunk-UHOBWX4X.js';
import './chunk-W6G2QAAZ.js';
import './chunk-OR3KK4Y6.js';
import './chunk-KKTONNDY.js';
import './chunk-TOHOCF6L.js';
import './chunk-CW3ZGA4K.js';
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
