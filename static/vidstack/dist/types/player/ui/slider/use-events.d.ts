import { type Signals } from 'maverick.js';
import type { CustomElementHost } from 'maverick.js/element';
import type { SliderDragEndEvent, SliderDragStartEvent, SliderDragValueChangeEvent, SliderValueChangeEvent } from './events';
import type { SliderStore } from './store';
import type { MediaSliderElement, SliderProps } from './types';
export declare function useSliderEvents(host: CustomElementHost<MediaSliderElement>, { $disabled, $step, $keyStep, $shiftKeyMultiplier }: Signals<SliderProps>, { onValueChange, onDragStart, onDragValueChange, onDragEnd }: SliderEventCallbacks, $store: SliderStore): void;
export interface SliderEventCallbacks {
    onValueChange?(event: SliderValueChangeEvent): void;
    onDragStart?(event: SliderDragStartEvent): void;
    onDragValueChange?(event: SliderDragValueChangeEvent): void;
    onDragEnd?(event: SliderDragEndEvent): void;
}
