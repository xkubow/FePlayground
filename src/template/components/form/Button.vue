<template>
	<el-tooltip :teleported="false" v-if="tooltip" :content="tooltip">
		<el-button v-bind="{ ...$attrs, ...$props, disabled: isDisabled }">
			<slot>
				{{ labelText }}
			</slot>
		</el-button>
	</el-tooltip>
	<el-button v-else v-bind="{ disabled: isDisabled }">
		<slot>
			{{ labelText }}
		</slot>
	</el-button>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { baseProps, useBase } from '../base/base';

export default defineComponent({
	name: 'k-button',
	props: {
		...baseProps,
		tooltip: String,
	},
	setup(props) {
		const propRefs = toRefs(props);
		const baseInit = useBase(propRefs);

		return { ...baseInit };
	},
});
</script>

<style scoped></style>
