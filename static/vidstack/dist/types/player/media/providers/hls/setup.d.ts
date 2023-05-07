import type { MediaSetupContext } from '../types';
import type { HLSProvider } from './provider';
import type { HLSInstanceCallback } from './types';
export declare function setupHLS(provider: HLSProvider, { player, logger, delegate, $store, qualities, audioTracks, textTracks }: MediaSetupContext, callbacks: Set<HLSInstanceCallback>): void;
