<template>
	<el-container>
		<slot />
	</el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { ElContainer } from 'element-plus';

export default defineComponent({
	name: 'k-container',
	setup() {
		return {};
	},
});
</script>

<style scoped></style>
