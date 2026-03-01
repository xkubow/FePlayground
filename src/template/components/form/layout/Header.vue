<template>
	<el-header>
		<slot />
	</el-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'k-header',
	setup() {
		return {};
	},
});
</script>

<style scoped></style>
