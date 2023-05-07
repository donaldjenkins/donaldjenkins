import { type ReadSignal } from 'maverick.js';
import type { MediaContext } from '../context';
import type { MediaSrc } from '../types';
export declare function useSourceSelection($domSources: ReadSignal<MediaSrc[]>, $rendered: ReadSignal<boolean>, context: MediaContext): void;
