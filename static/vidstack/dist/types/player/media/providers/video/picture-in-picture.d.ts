import type { MediaContext } from '../../context';
import type { MediaPictureInPictureAdapter } from '../types';
declare global {
    interface GlobalEventHandlersEventMap {
        enterpictureinpicture: Event;
        leavepictureinpicture: Event;
    }
}
export declare class VideoPictureInPicture implements MediaPictureInPictureAdapter {
    protected _video: HTMLVideoElement;
    constructor(_video: HTMLVideoElement, { delegate }: MediaContext);
    get active(): boolean;
    get supported(): boolean;
    enter(): Promise<PictureInPictureWindow>;
    exit(): Promise<void>;
}
