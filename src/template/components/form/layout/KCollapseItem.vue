<template>
  <el-collapse-item v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </el-collapse-item>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });
</script>

<style scoped></style>
