import { type Signals } from 'maverick.js';
import { type MediaContext } from '../context';
import type { MediaControllerProps } from './types';
export declare function createMediaController(props: Signals<MediaControllerProps>): {
    _context: MediaContext;
    _start: () => void;
    _request: import("./request-manager").MediaRequestManager;
    _provider: Pick<import("../state").MediaState, "muted" | "volume" | "playsinline" | "currentTime" | "paused" | "playbackRate">;
};
