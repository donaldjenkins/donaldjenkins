export declare const GROUPED_LOG: unique symbol;
export interface GroupedLog {
    readonly [GROUPED_LOG]?: true;
    readonly title: string;
    readonly logs: ({
        label?: string;
        data: any[];
    } | GroupedLog)[];
    log(...data: any[]): GroupedLog;
    labelledLog(label: string, ...data: any[]): GroupedLog;
    groupStart(title: string): GroupedLog;
    groupEnd(): GroupedLog;
}
export declare function isGroupedLog(data: unknown): data is GroupedLog;
export declare function createGroupedLog(title: string, parent?: GroupedLog): GroupedLog;
