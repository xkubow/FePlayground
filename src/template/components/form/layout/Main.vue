<template>
  <el-main>
    <slot />
  </el-main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'k-main',
    setup() {
      return {};
    },
  });
</script>

<style scoped></style>
