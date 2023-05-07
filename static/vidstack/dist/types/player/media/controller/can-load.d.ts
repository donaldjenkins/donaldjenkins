import { type ReadSignal } from 'maverick.js';
import type { MediaLoadingStrategy } from '../types';
import type { MediaControllerElement } from './types';
/**
 * This hook is responsible for determining when media can begin loading.
 */
export declare function useMediaCanLoad($controller: ReadSignal<MediaControllerElement | null>, $load: ReadSignal<MediaLoadingStrategy>, callback: () => void): void;
