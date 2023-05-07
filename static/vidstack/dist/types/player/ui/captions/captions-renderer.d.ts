import type { CaptionsRenderer } from 'media-captions';
import type { TextRenderer } from '../../media/tracks/text/render/text-renderer';
import type { TextTrack } from '../../media/tracks/text/text-track';
export declare class CaptionsTextRenderer implements TextRenderer {
    private _renderer;
    readonly priority = 10;
    private _track;
    private _disposal;
    constructor(_renderer: CaptionsRenderer);
    attach(): void;
    canRender(): boolean;
    detach(): void;
    changeTrack(track: TextTrack | null): void;
    private _changeTrack;
}
