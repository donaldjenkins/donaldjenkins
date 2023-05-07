import { SliderVideoDefinition } from './chunk-UCJZRMIA.js';
import { SliderDefinition } from './chunk-MVXCC4Y5.js';
import { TimeSliderDefinition } from './chunk-FSXWJGDT.js';
import { TimeDefinition } from './chunk-KTPJTFSN.js';
import { ToggleButtonDefinition } from './chunk-G4HEK3DX.js';
import { VolumeSliderDefinition } from './chunk-TRXMCZNO.js';
import './chunk-L4CLTNDQ.js';
import { PIPButtonDefinition } from './chunk-D7LKHHDW.js';
import { PlayButtonDefinition } from './chunk-N35NRCYC.js';
import { PlayerDefinition, OutletDefinition } from './chunk-AZ22X7MY.js';
import './chunk-JELAJF2G.js';
import { PosterDefinition } from './chunk-ZD7YDOJF.js';
import './chunk-HFEWFZN4.js';
import { SeekButtonDefinition } from './chunk-DTFSCEI7.js';
import { SliderThumbnailDefinition } from './chunk-N5HPQHHS.js';
import { SliderValueDefinition } from './chunk-CA53UNZI.js';
import './chunk-E6EPK3UH.js';
import './chunk-TW2KE7QB.js';
import './chunk-J5ZUXZE6.js';
import { CaptionButtonDefinition } from './chunk-3GEV7DLQ.js';
import { CaptionsDefinition } from './chunk-6NGXVHSW.js';
import { FullscreenButtonDefinition } from './chunk-FDBKHEGE.js';
import { MediaIconDefinition } from './chunk-CD65GM7M.js';
import { LiveIndicatorDefinition } from './chunk-WXCRUBAT.js';
import { MuteButtonDefinition } from './chunk-B3GZ32UQ.js';
import './chunk-F77P4SG6.js';
import './chunk-FPSFPUBI.js';
import './chunk-4W57WRRP.js';
import './chunk-2GEHKEZA.js';
import './chunk-4CA2OYTC.js';
import './chunk-LYPKAAFP.js';
import './chunk-L5JIQHZZ.js';
import './chunk-HJOTOEX7.js';
import './chunk-BCHRLKDT.js';
import './chunk-IWORFIII.js';
import './chunk-N2X5VJTG.js';
import './chunk-EWIZ7YX3.js';
import './chunk-FU2MDXXS.js';
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
