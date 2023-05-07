import type * as HLS from 'hls.js';
import { type Dispose } from 'maverick.js';
import type { MediaSrc } from '../../types';
import type { MediaProvider, MediaSetupContext } from '../types';
import { VideoProvider } from '../video/provider';
import type { HLSInstanceCallback, HLSLibrary } from './types';
export declare const HLS_PROVIDER: unique symbol;
/**
 * The HLS provider introduces support for HLS streaming via the popular `hls.js`
 * library. HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
 * on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/hls}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md}
 * @example
 * ```html
 * <media-player
 *   src="https://media-files.vidstack.io/hls/index.m3u8"
 *   poster="https://media-files.vidstack.io/poster.png"
 * >
 *   <media-outlet></media-outlet>
 * </media-player>
 * ```
 */
export declare class HLSProvider extends VideoProvider implements MediaProvider {
    [HLS_PROVIDER]: boolean;
    /**
     * Whether `hls.js` is supported in this environment.
     */
    static supported: boolean;
    get type(): string;
    get canLiveSync(): boolean;
    $ctor: import("maverick.js").WriteSignal<typeof import("hls.js").default | null>;
    $instance: import("maverick.js").WriteSignal<import("hls.js").default | null>;
    protected _instanceCallbacks: Set<HLSInstanceCallback>;
    protected _library: HLSLibrary;
    /**
     * The `hls.js` configuration object.
     *
     * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning}
     */
    config: Partial<HLS.HlsConfig>;
    /**
     * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
     *
     * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js`
     */
    get library(): HLSLibrary;
    set library(library: HLSLibrary);
    preconnect(): void;
    setup(context: MediaSetupContext): void;
    /**
     * The `hls.js` constructor.
     */
    get ctor(): typeof import("hls.js").default | null;
    /**
     * The current `hls.js` instance.
     */
    get instance(): import("hls.js").default | null;
    loadSource({ src }: MediaSrc): Promise<void>;
    /**
     * The given callback is invoked when a new `hls.js` instance is created and right before it's
     * attached to media.
     */
    onInstance(callback: HLSInstanceCallback): Dispose;
}
