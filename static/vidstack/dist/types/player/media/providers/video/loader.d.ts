import type { MediaContext } from '../../context';
import type { MediaStore } from '../../store';
import type { MediaSrc, MediaType } from '../../types';
import type { MediaProviderLoader } from '../types';
import type { VideoProvider } from './provider';
export declare class VideoProviderLoader implements MediaProviderLoader<VideoProvider> {
    _video: HTMLVideoElement;
    canPlay(src: MediaSrc): boolean;
    mediaType(): MediaType;
    load(context: MediaContext): Promise<VideoProvider>;
    render($store: MediaStore): import("maverick.js").JSX.Element;
}