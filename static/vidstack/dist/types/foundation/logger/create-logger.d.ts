import { GROUPED_LOG, type GroupedLog } from './create-grouped-log';
export interface Logger {
    error(...data: any[]): boolean;
    warn(...data: any[]): boolean;
    info(...data: any[]): boolean;
    debug(...data: any[]): boolean;
    errorGroup(title: string): GroupedLogger;
    warnGroup(title: string): GroupedLogger;
    infoGroup(title: string): GroupedLogger;
    debugGroup(title: string): GroupedLogger;
    setTarget(newTarget: EventTarget | null): void;
}
export interface GroupedLogger {
    readonly [GROUPED_LOG]?: true;
    readonly title: string;
    readonly logs: ({
        label?: string;
        data: any[];
    } | GroupedLog)[];
    log(...data: any[]): GroupedLogger;
    labelledLog(label: string, ...data: any[]): GroupedLogger;
    groupStart(title: string): GroupedLogger;
    groupEnd(): GroupedLogger;
    dispatch(): boolean;
}
/**
 * Create a simple facade that simplifies dispatching log events from a given `host` target.
 */
export declare function createLogger(): Logger;
