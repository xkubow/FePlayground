<template>
  <k-table-column>
    <template #default="{ row }">
      <span v-if="!row.editSegment" class="pr-10">{{ row.vyrobniLinkaSegmentUpsNazev }}</span>
      <k-input v-else v-bind="{ labelKey: 'upsNazev', wrapp: false }" size="small" v-model="row.vyrobniLinkaSegmentUpsNazev" wrappClass="w-100" />
    </template>
  </k-table-column>
</template>

<script setup lang="ts"></script>

<style scoped></style>
