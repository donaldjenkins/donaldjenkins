import { DOMEvent } from 'maverick.js/std';
import type { ListReadonlyChangeEvent } from '../../../foundation/list/list';
import { SelectList, type SelectListItem } from '../../../foundation/list/select-list';
import { LIST_ON_RESET, LIST_ON_USER_SELECT } from '../../../foundation/list/symbols';
import { ENABLE_AUTO_QUALITY, SET_AUTO_QUALITY } from './symbols';
/**
 * @see {@link https://vidstack.io/docs/player/core-concepts/quality#quality-list}
 */
export declare class VideoQualityList extends SelectList<VideoQuality, VideoQualityListEvents> {
    private _auto;
    /**
     * Configures quality switching:
     *
     * - `current`: Trigger an immediate quality level switch. This will abort the current fragment
     * request if any, flush the whole buffer, and fetch fragment matching with current position
     * and requested quality level.
     *
     * - `next`: Trigger a quality level switch for next fragment. This could eventually flush
     * already buffered next fragment.
     *
     * - `load`: Set quality level for next loaded fragment.
     *
     * @see {@link https://vidstack.io/docs/player/core-concepts/quality#switch}
     * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#quality-switch-control-api}
     */
    switch: 'current' | 'next' | 'load';
    /**
     * Whether automatic quality selection is enabled.
     */
    get auto(): boolean;
    [ENABLE_AUTO_QUALITY]?: () => void;
    protected [LIST_ON_USER_SELECT](): void;
    protected [LIST_ON_RESET](trigger?: Event): void;
    /**
     * Request automatic quality selection (if supported). This will be a no-op if the list is
     * `readonly` as that already implies auto-selection.
     */
    autoSelect(trigger?: Event): void;
    [SET_AUTO_QUALITY](auto: boolean, trigger?: Event): void;
}
export interface VideoQuality extends SelectListItem {
    readonly width: number;
    readonly height: number;
    readonly bitrate: number;
    readonly codec: string;
}
export interface VideoQualityListEvents {
    add: VideoQualityAddEvent;
    remove: VideoQualityRemoveEvent;
    change: VideoQualityChangeEvent;
    'auto-change': VideoQualityAutoChangeEvent;
    'readonly-change': ListReadonlyChangeEvent;
}
/**
 * Fired when a video quality has been added to the list.
 */
export interface VideoQualityAddEvent extends DOMEvent<VideoQuality> {
}
/**
 * Fired when a video quality has been removed from the list.
 */
export interface VideoQualityRemoveEvent extends DOMEvent<VideoQuality> {
}
/**
 * Fired when the selected video quality has changed.
 */
export interface VideoQualityChangeEvent extends DOMEvent<VideoQualityChangeEventDetail> {
}
export interface VideoQualityChangeEventDetail {
    prev: VideoQuality | null;
    current: VideoQuality;
}
/**
 * Fired when auto quality selection is enabled or disabled.
 */
export interface VideoQualityAutoChangeEvent extends DOMEvent<boolean> {
}
