<template>
  <k-layout-edit v-bind="{ leaving, canDelete: false }" v-on="{ ...layoutListeners }"> </k-layout-edit>
</template>

<script lang="ts">
  import { useStore as useCacheStore } from '@/template/cache';
  import { Entity } from '@/template/page/@types/page';
  import { editName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/edit';
  import { generateComputed } from '@/template/page/providers/store';
  import { useStore as usePageManagerStore } from '@/template/store/pageManager';
  import { storeToRefs } from 'pinia';
  import { defineComponent, toRefs } from 'vue';
  // import EskalaceTab from '../eskalace/components/EskalaceTab.vue';
  // import TableTests from '@/views/testy/components/tableTests.vue';
  import { useRoute } from 'vue-router';
  import { NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/edit';

  export default defineComponent({
    name: editName(NAME),
    components: {},
    setup() {
      const route = useRoute();
      const store = useStore();
      const cacheStore = useCacheStore();
      const pageManagerStore = usePageManagerStore();

      const cache = storeToRefs(cacheStore);

      const edit = init(NAME, store);
      const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

      return {
        ...mapedLast,
        ...edit,
      };
    },
  });
</script>

<style scoped></style>
