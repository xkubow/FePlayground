<script lang="ts">
import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
import type { DropdownItem } from '@/template/page/@types/mode';
import type { ElSelect } from 'element-plus';
import { useStore as useCacheStore } from '@/template/cache';
import { computed, defineComponent, inject, nextTick, ref, toRefs, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ChangeOptions } from './KVirtualKeyboard/type';
import { useKVirtualKeyboard } from './KVirtualKeyboard';
import { useKeyboardStore } from './KVirtualKeyboard/store';
import { emptyFunc } from '@/template/utils/dataMapper';
import _ from 'lodash';

export default defineComponent({
	name: 'k-select',
	emits: ['update:modelValue', 'change', 'show-more'],
	props: {
		...baseInputProps,
		showMore: Boolean,
		multiple: Boolean,
		filterable: Boolean,
		allowCreate: Boolean,
		defaultFirstOption: Boolean,
		optionsValueName: { type: String, default: 'value' },
		optionsTextName: { type: String, default: 'text' },
		options: Array as PropType<Array<DropdownItem<string | number>>>,
	},
	setup(props, ctx) {
		const propsRef = toRefs(props);
		const base = baseInput(propsRef, ctx.emit);
		const { t } = useI18n();

		const cacheStore = useCacheStore();

		const keyboardStore = useKeyboardStore();
		const changeKeyboardOptions: ChangeOptions | undefined = inject('changeKeyboardOptions');
		const filterSubmit = inject('filterSubmit', emptyFunc);

		const extended = ref(false);

		const optionsExtendedFiltered = computed(() => {
			return optionsDisabledFiltered?.value?.filter((i) => extended.value || !i.extended || base.vmodel.value === i.value);
		});
		const optionsDisabledFiltered = computed(() => {
			return propsRef.options?.value?.filter((i) => !(i.disabled && base.vmodel.value !== i.value));
		});

		const selectOption = computed(() => {
			const items = optionsDisabledFiltered.value as DropdownItem[];
			const isSelected = (value: number | string): boolean => {
				if (propsRef.multiple.value && _.isArray(base.vmodel.value)) return base.vmodel.value?.includes(value);
				else return base.vmodel.value === value;
			};
			return items.map((i) => ({ ...i, selected: isSelected(i.value) }));
		});

		function visibleChange(visible: boolean) {
			if (visible) extended.value = false;
		}

		function clear() {
			const val = Array.isArray(base.vmodel.value) ? [] : null;
			ctx.emit('update:modelValue', val);
		}

		function change(payload: unknown) {
			ctx.emit('change', payload);
		}

		function removeTag(payload: unknown) {
			//
		}
		function onKeyReleased(button: string) {
			if (base.isListMode && button === '{enter}') {
				filterSubmit && filterSubmit();
				keyboardStore.dialogVisible = false;
			}
		}

		const queryStr = ref<null | string>(null);

		if (!changeKeyboardOptions) throw Error('changeKeyboardOptions not injected');
		const keyboard = useKVirtualKeyboard({
			changeKeyboardOptions,
			vmodel: queryStr,
			onChange: () => false,
			selectOption,
			onKeyReleased,
		});

		function focus(e: FocusEvent) {
			if (!cacheStore.nastaveni?.useSwKeyboard) return;
			keyboardStore.selectItem = (item: DropdownItem<string | number> & { selected?: boolean }) => {
				if (propsRef.multiple.value) {
					const selected = base.vmodel.value as [];
					if (item.selected) {
						base.vmodel.value = [...selected, item[propsRef.optionsValueName.value]];
					} else {
						const index = selected.findIndex((i) => i === item.value);
						base.vmodel.value = [...selected.slice(0, index), ...selected.slice(index + 1)];
					}
				} else {
					base.vmodel.value = item[propsRef.optionsValueName.value];
					if (base.isListMode) {
						filterSubmit && filterSubmit();
						keyboardStore.dialogVisible = false;
					}
				}
				ctx.emit('change', item[propsRef.optionsValueName.value]);
			};
			keyboard.focus(e);
			nextTick(() => {
				blur();
			});
		}

		const popOverClassName = computed(() => (cacheStore.nastaveni?.useSwKeyboard ? 'hide-popover' : undefined));

		return {
			...base,
			base,
			optionsFiltered: optionsExtendedFiltered,
			extended,
			visibleChange,
			t,
			clear,
			change,
			removeTag,
			focus,
			blur,
			popOverClassName,
		};
	},
});
</script>

<template>
	<k-wrapper ref="wrapper" :show-label="!isHiddenLabel && showLabel"
		v-bind="{ ...base, disabled: isDisabled, label: labelText, validationProperty: validationPropertyCmp, span, class: wrappClass, wrapp }"
		:class="wrappClass">
		<el-select :teleported="false" class="k-select" v-model="vmodel"
			v-bind="{ ...$props, ...$attrs, ...base, disabled: isDisabled }" :value-key="optionsValueName"
			:placeholder="placeholderText" @change="change" @clear="clear" @remove-tag="removeTag"
			@visible-change="visibleChange" v-on="{ focus, blur }" :popperClass="popOverClassName">
			<slot>
				<el-option v-for="item in optionsFiltered" :key="item[optionsValueName]" :label="item[optionsTextName]"
					:value="item[optionsValueName]" :disabled="item.disabled"></el-option>
				<el-option v-if="!extended && showMore" value="-1" :style="{ padding: '0px' }">
					<div @click.stop="extended = true" :style="{ padding: '0 32px 0 20px' }">
						<span>{{ t('showMore') }}</span>
					</div>
				</el-option>
			</slot>
		</el-select>
		<template #colsuffix>
			<slot name="colsuffix" />
		</template>
	</k-wrapper>
</template>

<style lag="scss" scoped></style>
