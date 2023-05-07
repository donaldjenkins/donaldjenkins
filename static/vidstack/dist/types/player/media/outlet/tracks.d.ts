import { type ReadSignal } from 'maverick.js';
import type { MediaContext } from '../context';
import { type TextTrackInit } from '../tracks/text/text-track';
export declare function useTextTracks($domTracks: ReadSignal<TextTrackInit[]>, { textTracks, $$props }: MediaContext): void;
