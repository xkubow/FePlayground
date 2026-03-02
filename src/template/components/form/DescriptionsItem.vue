<template>
  <el-descriptions-item>
    <template #label>
      <slot name="label" />
    </template>
    <template #default>
      <slot />
    </template>
  </el-descriptions-item>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
