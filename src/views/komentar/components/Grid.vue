<template>
  <div class="komentar-grid">
    <grid-item
      v-for="(row, index) in rows"
      :key="row.id"
      :modelValue="row"
      v-bind="{ visibleEdit: index === 0, visibleDelete: index === 0, entita }"
      @update:modelValue="updateRow"
      @save="$emit('update', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Komentar } from '../type';
  import GridItem from './GridItem.vue';

  export interface Props {
    rows?: Komentar[];
    entita: string;
  }
  defineProps<Props>();
  defineEmits(['update', 'delete']);

  function updateRow(val: Komentar) {
    // console.log('updateRow', val);
  }
</script>

<style lang="scss" scoped>
  .komentar-grid {
    margin-block-start: 20px;
  }
</style>
