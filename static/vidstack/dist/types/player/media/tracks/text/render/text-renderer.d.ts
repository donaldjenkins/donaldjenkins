import type { MediaContext } from '../../../context';
import { ATTACH_VIDEO } from '../symbols';
import { TextTrack } from '../text-track';
export declare class TextRenderers {
    private _video;
    private _textTracks;
    private _renderers;
    private _nativeDisplay;
    private _nativeRenderer;
    private _customRenderer;
    constructor({ $store, $iosControls, textTracks }: MediaContext);
    add(renderer: TextRenderer): void;
    remove(renderer: TextRenderer): void;
    [ATTACH_VIDEO](video: HTMLVideoElement | null): void;
    private _addNativeTrack;
    private _removeNativeTrack;
    private _update;
    private _detach;
}
export interface TextRenderer {
    readonly priority: number;
    canRender(track: TextTrack): boolean;
    attach(video: HTMLVideoElement): any;
    detach(): void;
    changeTrack(track: TextTrack | null): void;
}
