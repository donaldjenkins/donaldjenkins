import type { MediaStore } from '../../store';
import type { MediaSrc, MediaType } from '../../types';
import type { MediaProviderLoader } from '../types';
import type { AudioProvider } from './provider';
export declare class AudioProviderLoader implements MediaProviderLoader<AudioProvider> {
    _audio: HTMLAudioElement;
    canPlay({ src, type }: MediaSrc): boolean;
    mediaType(): MediaType;
    load(): Promise<AudioProvider>;
    render($store: MediaStore): import("maverick.js").JSX.Element;
}