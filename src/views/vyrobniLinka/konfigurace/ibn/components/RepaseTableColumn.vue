<template>
  <k-table-column>
    <template #default="{ row }">
      <k-row class="jc-c ai-c">
        <k-col :span="22">
          <span v-if="!row.editIbn" class="pr-10">{{ row.repaseKontrolniBodIbnNazev }}</span>
          <k-select
            v-else
            v-bind="{ options: kontrolniBodList, labelKey: 'repaseKontrolniBodId', wrapp: false, size: 'small' }"
            v-model="row.repaseKontrolniBodIbnNazev"
            wrappClass="w-100"
            @change="change($event, row)"
          />
        </k-col>
      </k-row>
    </template>
  </k-table-column>
</template>

<script setup lang="ts">
  import type { Row } from '@/template/components/table/@types/table';
  import type { DropdownItem } from '@/template/page/@types/mode';
  import type { RowKonfigurace } from '../../tables';

  export interface Props {
    kontrolniBodList: DropdownItem[];
  }

  const props = defineProps<Props>();

  function change(val: number, row: Row<RowKonfigurace>) {
    const theItem = props.kontrolniBodList.find((i) => i.value === val);
    theItem && (row.repaseKontrolniBodIbnNazev = theItem.text);
  }
</script>

<style scoped></style>
