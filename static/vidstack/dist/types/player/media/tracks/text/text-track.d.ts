import { DOMEvent, EventsTarget } from 'maverick.js/std';
import type { CaptionsFileFormat, CaptionsParserFactory, VTTCue, VTTHeaderMetadata, VTTRegion } from 'media-captions';
import { TEXT_TRACK_CAN_LOAD, TEXT_TRACK_NATIVE, TEXT_TRACK_ON_MODE_CHANGE, TEXT_TRACK_READY_STATE, TEXT_TRACK_UPDATE_ACTIVE_CUES } from './symbols';
/**
 * - 0: Not Loading
 * - 1: Loading
 * - 2: Ready
 * - 3: Error
 */
export type TextTrackReadyState = 0 | 1 | 2 | 3;
export declare class TextTrack extends EventsTarget<TextTrackEvents> {
    static createId(track: TextTrack | TextTrackInit): string;
    readonly src?: string;
    readonly type?: CaptionsFileFormat | CaptionsParserFactory;
    readonly encoding?: string;
    readonly id = "";
    readonly label = "";
    readonly language = "";
    readonly kind: TextTrackKind;
    readonly default = false;
    private _canLoad;
    private _currentTime;
    private _mode;
    private _metadata;
    private _regions;
    private _cues;
    private _activeCues;
    [TEXT_TRACK_READY_STATE]: TextTrackReadyState;
    [TEXT_TRACK_ON_MODE_CHANGE]: (() => void) | null;
    [TEXT_TRACK_NATIVE]: {
        default?: boolean;
        track: {
            mode: TextTrackMode;
            addCue(cue: any): void;
            removeCue(cue: any): void;
        };
        remove?(): void;
    } | null;
    get metadata(): Readonly<VTTHeaderMetadata>;
    get regions(): ReadonlyArray<VTTRegion>;
    get cues(): ReadonlyArray<VTTCue>;
    get activeCues(): ReadonlyArray<VTTCue>;
    /**
     * - 0: Not Loading
     * - 1: Loading
     * - 2: Ready
     * - 3: Error
     */
    get readyState(): TextTrackReadyState;
    get mode(): TextTrackMode;
    set mode(mode: TextTrackMode);
    constructor(init: TextTrackInit);
    addCue(cue: VTTCue, trigger?: Event): void;
    removeCue(cue: VTTCue, trigger?: Event): void;
    setMode(mode: TextTrackMode, trigger?: Event): void;
    [TEXT_TRACK_UPDATE_ACTIVE_CUES](currentTime: number, trigger?: Event): void;
    [TEXT_TRACK_CAN_LOAD](): void;
    private _load;
    private _activeCuesChanged;
}
export interface TextTrackInit {
    /**
     * URL of the text track resource. This attribute must be specified and its URL value must have
     * the same origin as the document — unless the <audio> or <video> parent element of the track
     * element has a `crossorigin` attribute.
     */
    src?: string;
    /**
     * The captions file format to be parsed or a custom parser factory (functions that returns a
     * captions parser). Supported types include: 'vtt', 'srt', 'ssa', and 'ass'.
     */
    type?: CaptionsFileFormat | CaptionsParserFactory;
    /**
     * The text encoding type to be used when decoding data bytes to text.
     *
     * @defaultValue utf-8
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings}
     *
     */
    encoding?: string;
    /**
     * Indicates that the track should be enabled unless the user's preferences indicate that
     * another track is more appropriate. This may only be used on one track element per media
     * element.
     */
    default?: boolean;
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/id} */
    id?: string;
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/kind} */
    kind: TextTrackKind;
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/label} */
    label?: string;
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/language} */
    language?: string;
}
export interface TextTrackEvents {
    'load-start': TextTrackLoadStartEvent;
    load: TextTrackLoadEvent;
    error: TextTrackErrorEvent;
    'add-cue': TextTrackAddCueEvent;
    'remove-cue': TextTrackRemoveCueEvent;
    'cue-change': TextTrackCueChangeEvent;
    'mode-change': TextTrackModeChangeEvent;
}
/**
 * Fired when the text track begins the loading/parsing process.
 */
export interface TextTrackLoadStartEvent extends DOMEvent<void> {
}
/**
 * Fired when the text track has finished loading/parsing.
 */
export interface TextTrackLoadEvent extends DOMEvent<void> {
}
/**
 * Fired when loading or parsing the text track fails.
 */
export interface TextTrackErrorEvent extends DOMEvent<Error> {
}
/**
 * Fired when a cue is added to the text track.
 */
export interface TextTrackAddCueEvent extends DOMEvent<VTTCue> {
}
/**
 * Fired when a cue is removed from the text track.
 */
export interface TextTrackRemoveCueEvent extends DOMEvent<VTTCue> {
}
/**
 * Fired when the active cues for the current text track have changed.
 */
export interface TextTrackCueChangeEvent extends DOMEvent<void> {
}
/**
 * Fired when the text track mode (showing/hidden/disabled) has changed.
 */
export interface TextTrackModeChangeEvent extends DOMEvent<TextTrack> {
}
export declare function isTrackCaptionKind(track: TextTrack): boolean;
