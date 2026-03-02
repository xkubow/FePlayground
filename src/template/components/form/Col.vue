<template>
  <el-col v-bind="{ ...$props, ...$attrs, xs }">
    <slot />
  </el-col>
</template>

<script setup lang="ts">
  export interface Props {
    xs?: number;
  }

  withDefaults(defineProps<Props>(), { xs: 24 });
</script>

<style scoped></style>
