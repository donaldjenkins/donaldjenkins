import type { MediaSrc } from '../../types';
import type { MediaProvider, MediaSetupContext } from '../types';
/**
 * This HTML media provider adapts the underlying media element such as `<audio>` or `<video>` to
 * satisfy the media provider interface.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement}
 */
export declare class HTMLMediaProvider implements MediaProvider {
    protected _media: HTMLMediaElement;
    constructor(_media: HTMLMediaElement);
    setup(context: MediaSetupContext): void;
    get type(): string;
    get media(): HTMLMediaElement;
    get paused(): boolean;
    get muted(): boolean;
    set muted(muted: boolean);
    get volume(): number;
    set volume(volume: number);
    get currentTime(): number;
    set currentTime(time: number);
    get playsinline(): boolean;
    set playsinline(playsinline: boolean);
    get playbackRate(): number;
    set playbackRate(rate: number);
    play(): Promise<void>;
    pause(): Promise<void>;
    loadSource({ src }: MediaSrc, preload: any): Promise<void>;
}