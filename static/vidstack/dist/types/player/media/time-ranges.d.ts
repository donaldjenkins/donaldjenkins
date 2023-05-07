/**
 * Create a `TimeRanges` object
 *
 * @param start - The start of a single range (a number) or an
 * array of ranges (an array of arrays of two numbers each).
 * @param end - The end of a single range. Cannot be used with the array form of the
 * `start` argument.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges}
 */
export declare function createTimeRanges(start?: number | [number, number][], end?: number): TimeRanges;
export declare function getTimeRangesStart(ranges: TimeRanges): number | null;
export declare function getTimeRangesEnd(ranges: TimeRanges): number | null;
