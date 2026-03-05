<template>
  <el-tab-pane label="Hlavni udaje" name="HlavniUdaje"> <slot /> </el-tab-pane>
</template>

<script setup lang="ts">
  interface Props {
    label: string;
    name: string;
  }
</script>

<style scoped></style>
