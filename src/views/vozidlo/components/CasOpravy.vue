<template>
  <CasOpravyTable v-if="casOpravy" v-bind="{ casOpravy, showSummary }" v-on="{ addCasOpravy, editCasOpravy, refresh }" />
  <CasOpravyDialog v-model="casOpravyVysible" v-bind="{ knr: knr ?? null, casOpravyId, vozidloZavadaId }" v-on="{ refresh }" />
</template>

<script setup lang="ts">
  import CasOpravyTable from './CasOpravyTable.vue';
  import CasOpravyDialog from './CasOpravyDialog.vue';
  import type { Table } from '@/template/components/table';
  import { ref, toRefs } from 'vue';
  import type { CasOpravy } from '../tables/casOpravy';
  import { CasOpravyVozidla } from '../type.d';
  import _ from 'lodash';

  export interface Props {
    casOpravy?: Table | null;
    knr?: number | null;
    vozidloZavadaId?: number | null;
    showSummary?: boolean;
  }

  const casOpravyVozidla = ref<CasOpravyVozidla>(new CasOpravyVozidla());

  const emit = defineEmits(['refresh']);

  const props = withDefaults(defineProps<Props>(), { showSummary: false });
  const propsRef = toRefs(props);
  const casOpravyId = ref<number | null>(null);

  const casOpravyVysible = ref<boolean>(false);

  function addCasOpravy() {
    _.mapValues(casOpravyVozidla.value, () => null);
    propsRef.knr.value && (casOpravyVozidla.value!.knr = propsRef.knr.value);
    casOpravyId.value = null;
    casOpravyVysible.value = true;
  }

  function refresh() {
    emit('refresh');
  }

  function editCasOpravy(row: CasOpravy) {
    casOpravyId.value = row.id;
    casOpravyVysible.value = true;
  }
</script>

<style scoped></style>
