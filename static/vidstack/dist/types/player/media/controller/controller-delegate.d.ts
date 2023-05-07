import { type InferEventDetail, type InferEventInit } from 'maverick.js/std';
import type { MediaContext } from '../context';
import type { MediaEvents } from '../events';
export interface MediaControllerDelegate {
    dispatch<Type extends keyof MediaEvents>(type: Type, ...init: InferEventDetail<MediaEvents[Type]> extends void | undefined | never ? [init?: Partial<InferEventInit<MediaEvents[Type]>>] : [init: InferEventInit<MediaEvents[Type]>]): void;
    ready(info: {
        duration: number;
        seekable: TimeRanges;
    }, trigger?: Event): Promise<void>;
}
export declare function createMediaControllerDelegate({ $player, $store, logger }: MediaContext, handle: (event: Event) => void): MediaControllerDelegate;
