<template>
  <k-layout-edit v-bind="{ leaving, canDelete: false }" v-on="{ ...layoutListeners }">
    <template #title> {{ t('barva2') }} </template>
    <template #actions />
    <k-card row>
      <k-input v-model="barva2Kod" label-key="barva2Kod" />
      <k-color-picker v-model="hexaColor" label-key="uiBarvaKod" class="jk-editor-width-field" />
      <k-date-picker v-model="vstupDatum" :readonly="true" label-key="vstupDatum" class="jk-editor-width-field" />
      <k-table v-bind="{ columns: tables.label.columns, rows: tables.label.rows, tableName: tables.label.name, rowKey: tables.label.rowKey, loading: tables.label.isLoading() }" />
    </k-card>
  </k-layout-edit>
</template>

<script lang="ts">
  import { Entity } from '@/template/page/@types/page';
  import { editName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/edit';
  import { mapValues } from '@/template/page/providers/store_v2';
  import { computed, defineComponent, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/edit';

  export default defineComponent({
    name: editName(NAME),
    setup() {
      const store = useStore();
      const { t } = useI18n();

      const edit = init(NAME, store);
      const mapedLast = !store.last
        ? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
        : {
            ...mapValues(store.entityDefault.serverData, store, 'serverData'),
            ...mapValues(store.entityDefault.localData, store, 'localData'),
            ...mapValues(store.entityDefault, store),
          };

      const hexaColor = computed({
        get(): string | null {
          const color = mapedLast.uiBarvaKod.value;
          return color ? `#${color.toString(16)}` : null;
        },
        set(val: string | null) {
          mapedLast.uiBarvaKod.value = val ? parseInt(val.substring(1), 16) : null;
        },
      });
      return {
        ...mapedLast,
        ...edit,
        t,
        hexaColor,
      };
    },
  });
</script>

<style scoped>

.jk-editor-width-field {
  --jk-color-editor-width: 220px;
}

.jk-editor-width-field :deep(.el-color-picker) {
  display: block;
  width: var(--jk-color-editor-width);
}
</style>
