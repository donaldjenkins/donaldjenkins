import { DOMEvent } from 'maverick.js/std';
import { List, type ListReadonlyChangeEvent } from '../../../../foundation/list/list';
import { TEXT_TRACK_CAN_LOAD } from './symbols';
import { TextTrack, type TextTrackInit } from './text-track';
/**
 * @see {@link https://vidstack.io/docs/player/core-concepts/text-tracks}
 */
export declare class TextTrackList extends List<TextTrack, TextTrackListEvents> {
    private _canLoad;
    private _default;
    get default(): TextTrack | null;
    get selected(): TextTrack | null;
    add(init: TextTrackInit | TextTrack, trigger?: Event): this;
    remove(track: TextTrack, trigger?: Event): this | undefined;
    clear(trigger?: Event): this;
    getById(id: string): TextTrack | null;
    getByKind(kind: TextTrackKind | TextTrackKind[]): TextTrack[];
    [TEXT_TRACK_CAN_LOAD](): void;
    private _handleTrackModeChange;
    private _onTrackModeChange;
}
export interface TextTrackListEvents {
    add: TextTrackAddEvent;
    remove: TextTrackRemoveEvent;
    'mode-change': TextTrackListModeChangeEvent;
    'readonly-change': ListReadonlyChangeEvent;
}
/**
 * Fired when a text track has been added to the list.
 */
export interface TextTrackAddEvent extends DOMEvent<TextTrack> {
}
/**
 * Fired when a text track has been removed from the list.
 */
export interface TextTrackRemoveEvent extends DOMEvent<TextTrack> {
}
/**
 * Fired when the mode of any text track in the list has changed.
 */
export interface TextTrackListModeChangeEvent extends DOMEvent<TextTrack> {
}