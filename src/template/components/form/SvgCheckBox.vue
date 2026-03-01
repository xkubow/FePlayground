<template>
	<div @click="clicked" class="checkbox" :class="{ 'cursor-p': !isDisabled }">
		<!-- <input id="tmp" type="checkbox" v-model="checked" class="promoted-input-checkbox" /> -->
		<svg
			:width="`${size}px`"
			:height="`${size}px`"
			viewBox="0 0 24 24"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
		>
			<checked-box-icon v-if="vmodel" color="green" />
			<un-checked-box-icon v-else color="red" />
		</svg>
		<slot>
			<label> {{ label }} </label>
		</slot>
	</div>
</template>

<script lang="ts">
import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
import { defineComponent, toRefs } from 'vue';
import CheckedBoxIcon from '../svg/CheckedBox.vue';
import UnCheckedBoxIcon from '../svg/UnCheckedBox.vue';

export default defineComponent({
	name: 'k-svg-check-box',
	props: {
		...baseInputProps,
		value: Boolean,
		label: String,
		size: { type: Number, default: 32 },
	},
	emits: ['update:modelValue'],
	components: {
		CheckedBoxIcon,
		UnCheckedBoxIcon,
	},
	setup(props, ctx) {
		const propsRef = toRefs(props);
		const base = baseInput(propsRef, ctx.emit);

		function clicked() {
			if (base.isDisabled.value) return;
			base.vmodel.value = !base.vmodel.value;
		}
		return { ...base, clicked };
	},
});
</script>

<style scoped lang="scss">
.checkbox {
	display: flex;
	align-items: center;
}
</style>
