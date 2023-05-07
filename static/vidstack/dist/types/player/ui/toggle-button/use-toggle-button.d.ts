import { type Signals } from 'maverick.js';
import { type CustomElementHost } from 'maverick.js/element';
import type { MediaToggleButtonElement, ToggleButtonMembers } from './types';
export declare function useToggleButton(host: CustomElementHost<MediaToggleButtonElement>, { $props: { $pressed, $disabled }, ...props }: UseToggleButtonProps): ToggleButtonMembers;
export interface UseToggleButtonProps {
    $props: Signals<Pick<ToggleButtonMembers, 'disabled' | 'pressed'>>;
    onPress?(event: Event): void;
}
