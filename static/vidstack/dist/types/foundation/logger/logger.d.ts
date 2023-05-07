import { type ReadSignal } from 'maverick.js';
import { type Logger } from './create-logger';
export declare function useLogger($target: ReadSignal<EventTarget | null>): Logger | undefined;
