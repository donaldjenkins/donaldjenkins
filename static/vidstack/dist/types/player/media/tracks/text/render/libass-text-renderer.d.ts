import type { TextTrack } from '../text-track';
import type { TextRenderer } from './text-renderer';
export declare class LibASSTextRenderer implements TextRenderer {
    readonly loader: LibASSModuleLoader;
    config?: LibASSConfig | undefined;
    readonly priority = 1;
    private _instance;
    private _track;
    private _typeRE;
    constructor(loader: LibASSModuleLoader, config?: LibASSConfig | undefined);
    canRender(track: TextTrack): boolean;
    attach(video: HTMLVideoElement): void;
    changeTrack(track: TextTrack | null): void;
    detach(): void;
    private _freeTrack;
}
export interface LibASSModuleLoader {
    (): Promise<{
        default: LibASSConstructor;
    }>;
}
export interface LibASSConstructor {
    new (config?: {
        canvas?: HTMLCanvasElement;
        subUrl?: string;
        video: HTMLVideoElement;
    } & LibASSConfig): LibASSInstance;
}
export interface LibASSInstance {
    setTrackByUrl(url: string): void;
    setCurrentTime(time: number): void;
    freeTrack(): void;
    dispose(): void;
}
/**
 * @see {@link https://github.com/libass/JavascriptSubtitlesOctopus#options}
 */
export interface LibASSConfig {
    /**
     * Whether performance info is printed in the console.
     *
     * @defaultValue false
     */
    debug?: boolean;
    /**
     * An array of links to the fonts used in the subtitle.
     *
     * @defaultValue []
     */
    fonts?: string[];
    /**
     * The URL of the worker.
     */
    workerUrl?: string;
    /**
     * Link to non-WebAssembly worker.
     */
    legacyWorkerUrl?: string;
    /**
     * Object with all available fonts - key is font name in lower case, value is link.
     *
     * @defaultValue {}
     * @example
     * ```ts
     * { "arial": "/font1.tff" }
     * ```
     */
    availableFonts?: Record<string, string>;
    /**
     * URL to override fallback font, for example, with a CJK one.
     *
     * @defaultValue Liberation Sans
     */
    fallbackFont?: string;
    /**
     * A boolean, whether to load files in a lazy way via [`FS.createLazyFile()`](https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.createLazyFile).
     * Requires Access-Control-Expose-Headers for Accept-Ranges, Content-Length, and Content-Encoding.
     * If encoding is compressed or length is not set, file will be fully fetched instead of just a
     * HEAD request.
     */
    lazyFileLoading?: boolean;
    /**
     * Rendering mode.
     *
     * @defaultValue lossyRender
     * @see {@link https://github.com/libass/JavascriptSubtitlesOctopus#rendering-modes}
     */
    renderMode?: 'js-blend' | 'wasm-blend' | 'lossy';
    /**
     * Target frames per second.
     *
     * @defaultValue 24
     */
    targetFps?: number;
    /**
     * libass bitmap cache memory limit in MiB (approximate).
     *
     * @defaultValue 0 - no limit
     */
    libassMemoryLimit?: number;
    /**
     * libass glyph cache memory limit in MiB (approximate)
     *
     * @defaultValue 0 - no limit
     */
    libassGlyphLimit?: number;
    /**
     * Scale down (< 1.0) the subtitles canvas to improve performance at the expense of quality,
     * or scale it up (> 1.0).
     *
     * @defaultValue 1.0 - no scaling; must be a number > 0
     */
    prescaleFactor?: number;
    /**
     * The height beyond which the subtitles canvas won't be pre-scaled.
     *
     * @defaultValue 1080
     */
    prescaleHeightLimit?: number;
    /**
     * The maximum rendering height of the subtitles canvas. Beyond this subtitles will be up-scaled
     * by the browser.
     *
     * @defaultValue 0 - no limit
     */
    maxRenderHeight?: number;
    /**
     * If set to true, attempt to discard all animated tags. Enabling this may severely mangle
     * complex subtitles and should only be considered as an last ditch effort of uncertain success
     * for hardware otherwise incapable of displaying anything. Will not reliably work with
     * manually edited or allocated events.
     *
     * @defaultValue false - do nothing
     */
    dropAllAnimations?: boolean;
    /**
     * Function that's called when SubtitlesOctopus is ready.
     */
    onReady?(): void;
    /**
     * Function called in case of critical error meaning the subtitles wouldn't be shown and you
     * should use an alternative method (for instance it occurs if browser doesn't support web
     * workers).
     */
    onError?(error: Error): void;
}
