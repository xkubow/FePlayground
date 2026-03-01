import type { DropdownItem } from '@/template/page/@types/mode';
import type { SimpleKeyboard } from 'simple-keyboard';
import type Keyboard from 'simple-keyboard/build/components/Keyboard';
import type { Ref, ComputedRef } from 'vue';

export type ChangeOptions = (
	option: { onChange: (payload: string) => void; onKeyReleased?: (button: string) => void; caretPosition?: number },
	vmodel: Ref<any>,
	layoutType?: 'numeric',
) => void;

export type VirtualKeyboard = {
	change: Ref<undefined | ((payload: string | number | null) => void)>;
	keyboardClass: string;
	opened: () => void;
	closed: () => void;
	clear: () => void;
	changeOptions: (
		option: {
			onChange: (payload: string | number | null) => void;
			caretPosition: number;
			onKeyReleased: (button: any, keyboardInstance: SimpleKeyboard | null) => void;
		},
		vmodel: ComputedRef<any>,
		layoutType?: 'numeric',
	) => void;
	visible: Ref<boolean>;
	keyboardInstance: Keyboard | null;
	keyboardInstanceCmp: ComputedRef<Keyboard | null | undefined>;
	keyboardInput: Ref<any>;
	dialogVisible: Ref<boolean>;
	selectOption: Ref<DropdownItem<string | number>[] | undefined>;
};
