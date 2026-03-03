<template>
  <k-dialog
    :title="t('segment')"
    center
    draggable
    v-bind="{ showCancel: false, width: '30%' }"
    @update:modelValue="$emit('update:modelValue', $event)"
    v-on="{ ok, close }"
  >
    <k-input v-bind="{ labelKey: 'vyrobniLinkaSegmentText', wrapp: false, span: 12 }" v-model="vyrobniLinkaSegmentText" />
    <k-input v-bind="{ labelKey: 'upsNazev', wrapp: false, span: 11 }" v-model="upsNazev" />
    <k-icon @click="addSegment" :size="17"><upload-icon /></k-icon>
    <k-table ref="mtable" v-bind="{ showHeader: false, rows: segmentList, columns: table.columns, rowKey: table.rowKey, tableName: table.name }">
      <template #vyrobniLinkaSegmentText="{ column }">
        <nazev-table-column
          v-bind="{ tableName: table.name, labelKey: column.i18nKey, column, prop: `${column.id}`, verze, vyrobniLinkaId, editable }"
          @loadRows="$emit('loadRows')"
        />
      </template>
    </k-table>
  </k-dialog>
</template>

<script setup lang="ts">
  import type { Row } from '@/template/components/table/@types/table';
  import { Upload as UploadIcon } from '@element-plus/icons-vue';
  import { ref, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { apiProvider } from '../api';
  import { table, type RowSegmenty } from '../table';
  import NazevTableColumn from './NazevTableColumn.vue';

  export interface Props {
    verze: number;
    vyrobniLinkaId: number;
    segmentList: Row<RowSegmenty>[];
    editable: boolean;
  }

  const props = defineProps<Props>();
  const propsRef = toRefs(props);

  const emits = defineEmits(['update:modelValue', 'loadRows']);

  const { t } = useI18n();

  const upsNazev = ref<string | null>(null);
  const vyrobniLinkaSegmentText = ref<string | null>(null);

  function close() {
    upsNazev.value = null;
    vyrobniLinkaSegmentText.value = null;
  }

  async function addSegment() {
    await apiProvider.createEntity({
      verze: propsRef.verze.value,
      vyrobniLinkaId: propsRef.vyrobniLinkaId.value,
      text: vyrobniLinkaSegmentText.value,
      upsNazev: upsNazev.value,
    });
    emits('loadRows');
  }

  function ok() {
    emits('update:modelValue', false);
  }
</script>

<style scoped></style>
