import type { MediaSetupContext } from '../types';
import type { HLSConstructor, HLSLibrary } from './types';
export declare function loadHLSLibrary(lib: HLSLibrary, { player, delegate, logger }: MediaSetupContext): Promise<HLSConstructor | null>;
