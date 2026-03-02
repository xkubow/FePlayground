<template>
  <el-aside>
    <slot />
  </el-aside>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'k-aside',
    setup() {
      return {};
    },
  });
</script>

<style scoped></style>
