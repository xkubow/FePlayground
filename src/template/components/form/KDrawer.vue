<template>
	<el-drawer>
		<template #title>
			<slot name="title" />
		</template>
		<template #default>
			<slot />
		</template>
		<template #footer>
			<slot name="footer" />
		</template>
	</el-drawer>
</template>

<script setup lang="ts"></script>

<style scoped></style>
