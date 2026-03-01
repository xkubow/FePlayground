import { computed, ref, type ComputedRef, type Ref } from 'vue';
import Keyboard, { SimpleKeyboard } from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { nextTick } from 'vue';
import czLayout from 'simple-keyboard-layouts/build/layouts/czech';
import type { KeyboardOptions } from 'simple-keyboard/build/interfaces';
import { useKeyboardStore } from './store';
import { storeToRefs } from 'pinia';
import type { VirtualKeyboard } from './type';

let keyboardInstance: SimpleKeyboard | null = null;
const keyboardClass = 'simple-keyboard';

const numericLayout = {
	layout: { ...czLayout.layout, default: ['1 2 3', '4 5 6', '7 8 9', '0 {bksp} {enter}'] },
	theme: 'hg-theme-default hg-layout-numeric numeric-theme',
};
const defaultLayout = { layout: czLayout.layout, theme: 'hg-theme-default' };
let options: KeyboardOptions = defaultLayout;

export function useKeyboard(): VirtualKeyboard {
	const keyboardStore = useKeyboardStore();
	const visible = ref(false);
	const keyboardInput: Ref<any> = ref(null);
	const change: Ref<undefined | ((payload: string | number | null) => void)> = ref(undefined);

	function opened() {
		visible.value = false;
		if (!keyboardInstance) {
			keyboardInstance = new Keyboard(keyboardClass, options);
		}
		nextTick(() => {
			keyboardInstance?.setOptions(options);
			visible.value = true;
		});
	}

	function closed() {
		if (keyboardInstance) {
			keyboardInstance.destroy();
			keyboardInstance = null;
		}
		visible.value = false;
	}

	function changeOptions(
		option: {
			onChange: (payload: string | number | null) => void;
			caretPosition: number;
			onKeyReleased: (button: any, keyboardInstance: SimpleKeyboard | null) => void;
		},
		vmodel: ComputedRef<any>,
		layoutType?: 'numeric',
	) {
		const onChange = (payload: string) => {
			keyboardInput.value = payload;
			change.value = option.onChange;
			option.onChange(payload);
		};
		function onKeyReleased(button: string) {
			option.onKeyReleased(button, keyboardInstance);

			if (button === '{shift}' || button === '{lock}') handleShift();
		}
		options = layoutType === 'numeric' ? { ...numericLayout, onChange, onKeyReleased } : { ...defaultLayout, onChange, onKeyReleased };
		keyboardInput.value = vmodel.value;
		keyboardInstance?.clearInput();

		keyboardInstance?.setCaretPosition(option.caretPosition);
		keyboardInput?.value && keyboardInstance?.setInput(vmodel.value);
	}

	function clear() {
		keyboardInput.value = null;
		keyboardInstanceCmp?.value?.clearInput();
		change.value && change.value('');
	}

	function handleShift() {
		const currentLayout = keyboardInstance?.options.layoutName;
		const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

		keyboardInstance?.setOptions({
			layoutName: shiftToggle,
		});
	}

	const keyboardInstanceCmp = computed(() => keyboardInstance);

	const { dialogVisible, selectOption } = storeToRefs(keyboardStore);

	return { clear, change, visible, keyboardInstance, keyboardInstanceCmp, keyboardInput, dialogVisible, selectOption, keyboardClass, opened, closed, changeOptions };
}
