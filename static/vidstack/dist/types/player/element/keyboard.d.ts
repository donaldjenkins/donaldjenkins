import { type Signals } from 'maverick.js';
import { type CustomElementHost } from 'maverick.js/element';
import { type MediaContext } from '../media/context';
import type { MediaKeyShortcuts } from '../media/types';
import type { MediaPlayerProps } from './types';
export declare const MEDIA_KEY_SHORTCUTS: MediaKeyShortcuts;
export declare function useKeyboard({ $player, $store: $media, ariaKeys, remote }: MediaContext, { $keyShortcuts, $keyDisabled, $keyTarget }: Signals<MediaPlayerProps>): void;
export declare function useARIAKeyShortcuts(host: CustomElementHost, shortcut: keyof MediaKeyShortcuts): void;
