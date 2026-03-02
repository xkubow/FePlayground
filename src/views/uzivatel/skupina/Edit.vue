<template>
  <k-layout-edit v-bind="{ leaving }" v-on="{ ...layoutListeners }">
    <template #title> {{ t('skupina') }} </template>
    <template #actions />
    <k-card row>
      <k-input :span="6" v-model="text" label-key="text" />
      <k-select :span="6" label-key="skupinaUzivateluTyp" v-model="skupinaUzivateluTypEnum" :options="dropDownList.skupinaTyp" />
      <k-select :span="6" label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" />
      <k-col :span="24">
        <k-table-frame v-bind="{ totalCount: tables.uzivatel.totalCount }">
          <template #header>
            <span class="pr-10">{{ t('priradeniUzivatele') }}</span>
            <k-button @click="selectUzivatel">
              <k-icon><PlusIcon /></k-icon>
            </k-button>
          </template>
          <k-table v-bind="{ ...tables.uzivatel, objectName: NAME_SKUPINA_UZIVATEL, tableName: tables.uzivatel.name }" @row-delete="rowDelete" />
        </k-table-frame>
      </k-col>
    </k-card>
  </k-layout-edit>
</template>

<script lang="ts">
  import { useStore as useCacheStore } from '@/template/cache';
  import type { Row } from '@/template/components/table/@types/table';
  import { showAlert } from '@/template/mixins/notifications';
  import { Entity } from '@/template/page/@types/page';
  import { editName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/edit';
  import { mapValues } from '@/template/page/providers/store_v2';
  import { openSelectList } from '@/template/router/path';
  import { Plus as PlusIcon } from '@element-plus/icons-vue';
  import { storeToRefs } from 'pinia';
  import { defineComponent, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { apiProvider as SkupinaUzivatelu_UzivatelProvider } from './api/skupinaUzivateluUzivatel';
  import { NAME as UZIVATEL_NAME, NAME_SKUPINA_UZIVATEL } from '../constants';
  import type { Uzivatel } from '../type';
  import { NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/edit';

  export default defineComponent({
    name: editName(NAME),
    components: { PlusIcon },
    setup() {
      const store = useStore();
      const cacheStore = useCacheStore();
      const cache = storeToRefs(cacheStore);
      const { t } = useI18n();

      const edit = init(NAME, store, undefined, { reload });
      const mapedLast = !store.last
        ? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
        : {
            ...mapValues(store.entityDefault.serverData, store, 'serverData'),
            ...mapValues(store.entityDefault.localData, store, 'localData'),
            ...mapValues(store.entityDefault, store),
          };

      async function selectUzivatel() {
        if (!mapedLast.skupinaUzivateluTypEnum.value) {
          showAlert({ message: t('nelzeUlozit') });
          return;
        }
        if (!edit.entityId.value) {
          await edit.changeToEdit();
        }
        openSelectList(UZIVATEL_NAME, { skupinaUzivateluId: mapedLast.id.value });
      }

      async function rowDelete(row: Row<Uzivatel>) {
        mapedLast.id.value && (await SkupinaUzivatelu_UzivatelProvider.deleteCrossEntity(mapedLast.id.value?.toString(), row.id));
        reload();
      }
      function reload() {
        edit.loadRows({ tableName: tables.uzivatel.name });
      }

      return {
        ...mapedLast,
        ...edit,
        ...cache,
        t,
        selectUzivatel,
        NAME_SKUPINA_UZIVATEL,
        rowDelete,
      };
    },
  });
</script>

<style scoped></style>
