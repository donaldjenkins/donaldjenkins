import { type ReadSignal } from 'maverick.js';
import { type LogLevel } from './log-level';
export declare function createLogPrinter($target: ReadSignal<EventTarget | null>): LogPrinter;
export interface LogPrinter {
    /**
     * The current log level.
     */
    logLevel: LogLevel;
}
