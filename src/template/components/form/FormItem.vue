<template>
	<el-form-item v-bind="{ ...$props, ...$attrs }">
		<slot />
	</el-form-item>
</template>


<script setup lang="ts">
// No props or logic needed for this simple wrapper
</script>

<style scoped></style>
