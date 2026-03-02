<template>
  <el-sub-menu>
    <template #title>
      <slot name="title" />
    </template>
    <slot />
  </el-sub-menu>
</template>

<script setup lang="ts"></script>

<style scoped></style>
