<template>
	<k-wrapper ref="wrapper" :show-label="!(isHiddenLabel && !overwriteHiddenLabel) && showLabel"
		v-bind="{ ...base, disabled: isDisabled, validationProperty: validationPropertyCmp, label: labelText, wrapp, class: wrappClass, span, required }">
		<div class="w-100 d-f">
			<el-date-picker :teleported="false" v-bind="{ disabled: isDisabled, placeholder: labelOd, type, format }" v-model="odModel" />
			<el-date-picker :teleported="false"
				v-bind="{ disabled: isDisabled, placeholder: labelDo, type, format, defaultTime: new Date(0, 0, 0, 23, 59, 59) }"
				v-model="doModel" />
		</div>
	</k-wrapper>
</template>

<script lang="ts">
import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
import { actualDateFormat } from '@/template/utils/date';
import { computed, defineComponent, toRefs, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Interval } from '../@types';

export default defineComponent({
	name: 'k-date-picker',
	emits: ['update:modelValue', 'updateOd', 'updateDo'],
	props: {
		...baseInputProps,
		modelValue: { type: Object as PropType<Interval>, required: true },
		type: { type: String },
		format: { type: String, default: actualDateFormat },
	},
	setup(props, ctx) {
		const propsRef = toRefs(props);
		const base = baseInput(propsRef, ctx.emit);
		const { t } = useI18n();

		const odModel = computed<Date | null>({
			get: () => propsRef.modelValue?.value?.od ?? null,
			set: (v) => {
				const cur = propsRef.modelValue?.value ?? { od: null, do: null };
				ctx.emit('update:modelValue', { ...cur, od: v });
				ctx.emit('updateOd', v);
			},
		});

		const doModel = computed<Date | null>({
			get: () => propsRef.modelValue?.value?.do ?? null,
			set: (v) => {
				const cur = propsRef.modelValue?.value ?? { od: null, do: null };
				ctx.emit('update:modelValue', { ...cur, do: v });
				ctx.emit('updateDo', v);
			},
		});

		const labelOd = computed((): string => {
			return base.isHiddenLabel && !propsRef.overwriteHiddenLabel.value ? `${t(props.labelKey as string)} ${t('od')}` : t('od');
		});
		const labelDo = computed((): string => {
			return base.isHiddenLabel && !propsRef.overwriteHiddenLabel.value ? `${t(props.labelKey as string)} ${t('do')}` : t('do');
		});

		return {
			base,
			...base,
			odModel,
			doModel,
			t,
			labelOd,
			labelDo,
		};
	},
});
</script>

<style scoped lang="scss"></style>
