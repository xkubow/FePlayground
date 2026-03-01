<template>
	<el-button>
		<slot />
	</el-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'k-info-button',
	setup() {
		return {};
	},
});
</script>

<style scoped></style>
