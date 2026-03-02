<template>
  <k-layout-edit v-bind="{ leaving }" v-on="{ ...layoutListeners }">
    <template #title> {{ t('uzivatel') }} </template>
    <template #actions />
    <k-card row>
      <k-input v-model="zobrazeneJmeno" label-key="zobrazeneJmeno" />
      <k-input v-model="jmeno" label-key="jmeno" />
      <k-input v-model="prijmeni" label-key="prijmeni" />
      <k-input v-model="dzc" label-key="dzc" disabled />
      <k-input v-model="email" label-key="email" disabled />
      <k-checkbox v-model="station" label-key="station" disabled />
      <k-input v-model="oddeleni" label-key="oddeleni" />
      <k-select :span="6" label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" />
      <k-checkbox v-model="neovereno" label-key="neovereno" :disabled="!station" />
      <k-input-number v-model="zkusenost" label-key="zkusenost" @update:modelValue="updateZkusenost" />
    </k-card>
  </k-layout-edit>
</template>

<script lang="ts">
  import { useStore as useCacheStore } from '@/template/cache';
  import { Entity } from '@/template/page/@types/page';
  import { editName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/edit';
  import { mapValues } from '@/template/page/providers/store_v2';
  import { storeToRefs } from 'pinia';
  import { defineComponent, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/edit';
  export default defineComponent({
    name: editName(NAME),
    setup() {
      const store = useStore();
      const cacheStore = useCacheStore();
      const cache = storeToRefs(cacheStore);
      const { t } = useI18n();

      const edit = init(NAME, store);
      const mapedLast = !store.last
        ? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
        : {
            ...mapValues(store.entityDefault.serverData, store, 'serverData'),
            ...mapValues(store.entityDefault.localData, store, 'localData'),
            ...mapValues(store.entityDefault, store),
          };

      function updateZkusenost(val: number) {
        mapedLast.zkusenost.value = val > 255 ? 255 : val;
      }

      return {
        ...mapedLast,
        ...edit,
        ...cache,
        t,
        updateZkusenost,
      };
    },
  });
</script>

<style scoped></style>
