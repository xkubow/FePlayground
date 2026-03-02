<template>
  <div class="w-100">
    <iframe :src="`https://sqs-prohlizecky.skoda.vwgroup.com/ordssqsm/sqsr/ups_viewer.show_results?p_ident=${knr}`" height="99%" width="100%" frameborder="0" />
    <el-button class="float" @click="back" :icon="CloseIcon" />
  </div>
</template>

<script setup lang="ts">
  import { Close as CloseIcon } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';

  export interface Props {
    knr: string;
  }

  defineProps<Props>();

  const router = useRouter();

  function back() {
    router.back();
  }
</script>

<style lang="scss" scoped>
  .float {
    opacity: 0.9;
    position: relative;
    float: left;
    left: 10px;
    bottom: 99%;
    // transition: 0.5s;
  }
</style>
