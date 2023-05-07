import type { MediaSrc } from '../../types';
import type { MediaProviderLoader } from '../types';
import { VideoProviderLoader } from '../video/loader';
import type { HLSProvider } from './provider';
export declare class HLSProviderLoader extends VideoProviderLoader implements MediaProviderLoader<HLSProvider> {
    static supported: boolean;
    preconnect(): void;
    canPlay({ src, type }: MediaSrc): boolean;
    load(context: any): Promise<HLSProvider>;
}