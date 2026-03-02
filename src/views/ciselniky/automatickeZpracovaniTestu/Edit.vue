<template>
  <k-layout-edit v-bind="{ leaving, canDelete: false }" v-on="{ ...layoutListeners }">
    <template #title> {{ t(NAME) }} </template>
    <template #actions />
    <k-card row>
      <k-input label-key="text" :span="8" v-model="text" :disabled="true" />
      <k-select
        :span="3"
        label-key="kategorie"
        v-model="sqsZavadaKategorieId"
        :options="dropDownList.sqsZavadaKategorie"
        @change="sqsZavadaKategorieChange"
        :disabled="isViewMode"
      />
      <k-select
        :span="5"
        label-key="skupina"
        v-model="sqsZavadaSkupinaId"
        filterable
        :options="sqsZavadaSkupinaFiltered"
        @change="sqsZavadaSkupinaChange"
        :disabled="!sqsZavadaKategorieId || isViewMode"
      />
      <k-select
        :span="10"
        label-key="mistoNaVoze"
        v-model="sqsZavadaRadekId"
        :options="sqsZavadaRadekFiltered"
        :disabled="!sqsZavadaSkupinaId || isViewMode"
        filterable
      />
      <!-- <k-select :span="5" label-key="mistoNaVoze" v-model="sqsZavadaRadekId" :options="dropDownList.sqsZavadaRadek" filterable /> -->
      <k-select
        :span="5"
        label-key="typ"
        v-model="sqsZavadaTypId"
        :options="dropDownList.sqsZavadaTyp"
        filterable
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        autocorrect="off"
      />
      <k-select :span="6" label-key="vinik" v-model="sqsZavadaVinikId" :options="dropDownList.sqsZavadaVinik" filterable />
      <k-input label-key="sqsZavadaMistoText" :span="10" v-model="zavadaText" />
      <k-col :span="24">
        <k-table-frame>
          <template #header>
            <span class="pr-10">{{ t('AutomatickeZpracovaniTestuResulty') }}</span>
            <k-button @click="addResult">
              <k-icon><PlusIcon /></k-icon>
            </k-button>
          </template>
          <k-table
            v-bind="{ ...tables.resulty, tableName: tables.resulty.name, objectName: `resulty`, rowKey: tables.resulty.rowKey }"
            @row-delete="rowDelete"
          />
        </k-table-frame>
      </k-col>
    </k-card>
  </k-layout-edit>
</template>

<script lang="ts">
  import { useStore as useCacheStore } from '@/template/cache';
  import { storeToRefs } from 'pinia';
  import { Entity } from '@/template/page/@types/page';
  import { PageMode, editName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/edit';
  import { mapValues } from '@/template/page/providers/store_v2';
  import { computed, defineComponent, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/edit';
  import { apiProvider as ResultyApiProvider } from './resulty/api';
  import type { AutomatickeZpracovaniTestuResulty } from './resulty/type';
  import { openEdit } from '@/template/router/path';
  import { NAME as RESULTY_NAME } from './resulty/constants';
  import { Plus as PlusIcon } from '@element-plus/icons-vue';

  export default defineComponent({
    name: editName(NAME),
    components: { PlusIcon },
    setup() {
      const store = useStore();
      const { t } = useI18n();
      const cacheStore = useCacheStore();
      const cache = storeToRefs(cacheStore);

      const reload = () => {
        store.tableData({ tableName: RESULTY_NAME });
      };

      const edit = init(NAME, store, undefined, { reload, parseId: (id) => Number.parseInt(id as string) });
      const mappedLast = !store.last
        ? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
        : {
            ...mapValues(store.entityDefault.serverData, store, 'serverData'),
            ...mapValues(store.entityDefault.localData, store, 'localData'),
            ...mapValues(store.entityDefault, store),
          };

      async function rowDelete(row: AutomatickeZpracovaniTestuResulty) {
        await ResultyApiProvider.deleteEntity(row.id);
        edit.fetchTableData({ tablesToFetch: [RESULTY_NAME] });
      }

      async function addResult() {
        openEdit(`${RESULTY_NAME}`, PageMode.CREATE, { automatickeZpracovaniTestuEnum: mappedLast.automatickeZpracovaniTestuEnum.value });
      }

      function sqsZavadaKategorieChange() {
        mappedLast.sqsZavadaSkupinaId.value = null;
        mappedLast.sqsZavadaRadekId.value = null;
      }

      const sqsZavadaSkupinaFiltered = computed(() =>
        mappedLast.sqsZavadaKategorieId.value
          ? cache.dropDownList.value.sqsZavadaSkupina.filter((i) => i.sqsZavadaKategorieEnum === mappedLast.sqsZavadaKategorieId.value)
          : cache.dropDownList.value.sqsZavadaSkupina,
      );

      function sqsZavadaSkupinaChange() {
        mappedLast.sqsZavadaRadekId.value = null;
      }

      const sqsZavadaRadekFiltered = computed(() =>
        mappedLast.sqsZavadaSkupinaId.value
          ? cache.dropDownList.value.sqsZavadaRadek.filter((i) => i.sqsZavadaSkupinaId === mappedLast.sqsZavadaSkupinaId.value)
          : cache.dropDownList.value.sqsZavadaRadek,
      );

      return {
        ...mappedLast,
        ...edit,
        ...cache,
        sqsZavadaSkupinaFiltered,
        sqsZavadaKategorieChange,
        sqsZavadaSkupinaChange,
        sqsZavadaRadekFiltered,
        t,
        NAME,
        rowDelete,
        addResult,
      };
    },
  });
</script>

<style scoped></style>
