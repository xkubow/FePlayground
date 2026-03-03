<template>
  <k-layout-edit v-bind="{ leaving, canDelete: false }" v-on="{ ...layoutListeners }"> </k-layout-edit>
</template>

<script lang="ts">
  import { Entity } from '@/template/page/@types/page';
  import { editName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/edit';
  import { generateComputed } from '@/template/page/providers/store';
  import { defineComponent, toRefs } from 'vue';
  import { NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/edit';

  export default defineComponent({
    name: editName(NAME),
    components: {},
    setup() {
      const store = useStore();

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
