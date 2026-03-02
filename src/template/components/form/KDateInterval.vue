<template>
	<k-wrapper ref="wrapper" :show-label="!(isHiddenLabel && !overwriteHiddenLabel) && showLabel"
		v-bind="{ ...base, disabled: isDisabled, validationProperty: validationPropertyCmp, label: labelText, wrapp, class: wrappClass, span, required }">
		<div class="w-100 d-f">
			<el-date-picker :teleported="false" v-bind="{ disabled: isDisabled, placeholder: labelOd, type, format }"
				v-model="odModel" />
			<el-date-picker :teleported="false"
				v-bind="{ disabled: isDisabled, placeholder: labelDo, type, format, defaultTime: new Date(0, 0, 0, 23, 59, 59) }"
				v-model="doModel" />
		</div>
	</k-wrapper>
</template>


<script setup lang="ts">
	import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
	import { actualDateFormat } from '@/template/utils/date';
	import { computed, toRefs } from 'vue';
	import { useI18n } from 'vue-i18n';
	import type { Interval } from '../@types';

	const emit = defineEmits(['update:modelValue', 'updateOd', 'updateDo']);
	const props = defineProps({
		...baseInputProps,
		modelValue: { type: Object as () => Interval, required: true },
		type: { type: String },
		format: { type: String, default: actualDateFormat },
	});
	const propsRef = toRefs(props);
	const base = baseInput(propsRef, emit);
	const {
		validationPropertyCmp,
		vmodel,
		placeholderText,
		labelText,
		isDisabled,
		isHiddenLabel,
		isListMode,
	} = base;
	const { showLabel, wrappClass, wrapp, span, required, overwriteHiddenLabel } = propsRef;
	const { t } = useI18n();

	const odModel = computed<Date | null>({
		get: () => propsRef.modelValue?.value?.od ?? null,
		set: (v) => {
			const cur = propsRef.modelValue?.value ?? { od: null, do: null };
			emit('update:modelValue', { ...cur, od: v });
			emit('updateOd', v);
		},
	});

	const doModel = computed<Date | null>({
		get: () => propsRef.modelValue?.value?.do ?? null,
		set: (v) => {
			const cur = propsRef.modelValue?.value ?? { od: null, do: null };
			emit('update:modelValue', { ...cur, do: v });
			emit('updateDo', v);
		},
	});

	const labelOd = computed((): string => {
	return base.isHiddenLabel && !propsRef.overwriteHiddenLabel.value ? `${t(props.labelKey as string)} ${t('od')}` : t('od');
});
const labelDo = computed((): string => {
	return base.isHiddenLabel && !propsRef.overwriteHiddenLabel.value ? `${t(props.labelKey as string)} ${t('do')}` : t('do');
});
</script>

<style scoped lang="scss"></style>
