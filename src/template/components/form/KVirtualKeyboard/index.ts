import { useStore as useAuthStore } from '@/template/account/authorization/store';
import type { DropdownItem } from '@/template/page/@types/mode';
import { emptyFunc } from '@/template/utils/dataMapper';
import { computed, type ComputedRef, type Ref } from 'vue';
import { useKeyboardStore } from './store';
import { useStore as useCacheStore } from '@/template/cache';
import type { ChangeOptions } from './type';

export function useKVirtualKeyboard(options: {
	changeKeyboardOptions: ChangeOptions;
	vmodel?: Ref<any>;
	layoutType?: 'numeric';
	onKeyReleased?: (button: string) => void;
	onChange?: (payload: string) => boolean;
	selectOption?: ComputedRef<(DropdownItem<string | number> & { selected?: boolean })[] | undefined>;
}) {
	const authStore = useAuthStore();
	const keyboardStore = useKeyboardStore();
	const cacheStore = useCacheStore();

	const onChange = (payload: string) => {
		const doContinue = options.onChange ? options.onChange(payload) : true;
		if (!doContinue || !options.vmodel) return;
		if (payload.length === 0) {
			options.vmodel.value = null;
			return;
		}
		if (options.layoutType === 'numeric') {
			options.vmodel.value = parseInt(payload);
			return;
		}
		options.vmodel.value = payload;
	};

	const inputCmp = computed(() => options.vmodel?.value);
	const isPanel = computed(() => authStore.isPanel);

	function focus(element: FocusEvent) {
		if (!cacheStore.nastaveni?.useSwKeyboard) return;
		const inputElement = element.target as HTMLInputElement;
		inputElement.blur();

		options.changeKeyboardOptions(
			{ onChange, caretPosition: inputElement?.selectionStart ?? 0, onKeyReleased: options.onKeyReleased ?? emptyFunc },
			inputCmp,
			options.layoutType,
		);

		keyboardStore.selectOption = options.selectOption?.value;
		keyboardStore.dialogVisible = true;
	}

	return { focus, isPanel };
}
