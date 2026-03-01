<template>
	<el-button-group v-bind="{ disabled: isDisabled }" class="d-f">
		<slot />
	</el-button-group>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { baseProps, useBase } from '../base/base';

export default defineComponent({
	name: 'k-button-group',
	props: {
		...baseProps,
	},
	setup(props) {
		const propRefs = toRefs(props);
		const baseInit = useBase(propRefs);
		return { ...baseInit };
	},
});
</script>

<style scoped></style>
