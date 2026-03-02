<template>
  <k-layout-edit v-bind="{ leaving, canDelete: false }" v-on="{ ...layoutListeners }">
    <template #title> {{ t('tiket') }} </template>
  </k-layout-edit>
</template>

<script lang="ts">
  import { Entity } from '@/template/page/@types/page';
  import { editName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/edit';
  import { mapValues } from '@/template/page/providers/store_v2';
  import { useStore as usePageManagerStore } from '@/template/store/pageManager';
  import { defineComponent, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/edit';

  export default defineComponent({
    name: editName(NAME),
    components: {},
    setup() {
      const store = useStore();
      const pageManagerStore = usePageManagerStore();

      const { t } = useI18n();
      const entita = NAME;

      const edit = init(NAME, store);
      const mapedLast = !store.last
        ? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
        : {
            ...mapValues(store.entityDefault.serverData, store, 'serverData'),
            ...mapValues(store.entityDefault.localData, store, 'localData'),
            ...mapValues(store.entityDefault, store),
          };

      return {
        ...mapedLast,
        ...edit,
        t,
        entita,
      };
    },
  });
</script>

<style scoped></style>
