<template>
  <k-col>
    <k-table-frame v-if="zavada" label-key="zadaneZavadyKVozu">
      <zavada-table v-bind="{ rows: zavada.rows, operations: zavada.operations, showSummary: true, loading: zavada.isLoading() }" v-on="{ refresh: refreshVozidloZavadaTable }" />
    </k-table-frame>
  </k-col>
  <k-col>
    <k-table-frame v-if="navrhovane && (neopravene || opravene)" label-key="navrhovaneZavady">
      <NavrhovaneZavadyVue v-bind="{ rows: navrhovane!.rows }" v-on="{ detailRowClicked }" />
    </k-table-frame>
  </k-col>
  <k-col>
    <k-table-frame v-if="sqsZavady" label-key="sqsZavadyKVozu">
      <k-table v-bind="{ columns: sqsZavady.columns, rows: sqsZavady.rows, tableName: sqsZavady.name, rowKey: sqsZavady.rowKey, loading: sqsZavady.isLoading() }">
        <template #status="{ column }">
          <k-table-column v-bind="{ tableName: sqsZavady.name, labelKey: column.i18nKey, column, prop: `${column.id}` }">
            <template #default="{ row }">
              <k-svg-check-box v-model="row.status" disabled class="jc-c" />
            </template>
          </k-table-column>
        </template>
      </k-table>
    </k-table-frame>
  </k-col>
</template>

<script setup lang="ts">
  import type { Table } from '@/template/components/table';
  import { EnumStatusIo } from '@/views/chyby/constants';
  import { computed, toRefs } from 'vue';
  import type { NavrhovaneZavady } from '../zavada/navrhovane/tables/table';
  import ZavadaTable from '../zavada/components/Table.vue';
  import NavrhovaneZavadyVue from '../zavada/navrhovane/components/NavrhovaneZavady.vue';

  export interface Props {
    knr: number | null;
    zavada: Table | null;
    navrhovane: Table<NavrhovaneZavady> | null;
    sqsZavady: Table | null;
    casOpravy?: Table | null;
    statusIoEnum: EnumStatusIo | null;
  }

  const props = defineProps<Props>();
  const propsRef = toRefs(props);

  const emit = defineEmits(['refreshVozidloZavadaTable', 'openVozidloZavada', 'addCasOpravy']);

  function detailRowClicked(filter: Record<string, any>) {
    emit('openVozidloZavada', filter);
  }

  function refreshVozidloZavadaTable() {
    emit('refreshVozidloZavadaTable');
  }

  const neopravene = computed(() => propsRef.statusIoEnum.value === EnumStatusIo.neopraveno);
  const opravene = computed(() => propsRef.statusIoEnum.value === EnumStatusIo.opraveno);
</script>

<style scoped></style>
