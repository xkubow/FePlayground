<template>
	<el-button-group v-bind="{ disabled: isDisabled }" class="d-f">
		<slot />
	</el-button-group>
</template>


<script setup lang="ts">
	import { baseProps, useBase } from '../base/base';
	import { toRefs } from 'vue';

	const props = defineProps({
		...baseProps,
	});
	const propRefs = toRefs(props);
	const { isDisabled } = useBase(propRefs);
</script>

<style scoped></style>
