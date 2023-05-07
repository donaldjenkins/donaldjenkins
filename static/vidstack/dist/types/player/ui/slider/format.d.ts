export declare const sliderValueFormattersContext: import("maverick.js").Context<SliderValueFormatters>;
interface SliderValueFormatters {
    value?(value: number): string;
    percent?(percent: number, decimalPlaces: number): string;
    time?(value: number, padHours: boolean, padMinutes: boolean, showHours: boolean): string;
}
export {};
