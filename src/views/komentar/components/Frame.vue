<template>
  <k-row class="k-text_area-label">
    <p class="mb-0">{{ t('NovyKomentar') }}</p>
    <k-rich-text v-model="novyKomentar" v-bind="{ references, baseUrl }" v-on="{ upload }" />
  </k-row>
  <grid-kometarov v-bind="{ rows, entita }" @update="$emit('update', $event)" @delete="$emit('delete', $event)" />
</template>

<script setup lang="ts">
  import type { Row } from '@/template/components/table/@types/table';
  import type { Priloha } from '@/views/prilohy/type';
  import { computed, ref, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NAME as NAME_PRILOHY } from '../../prilohy/constants';
  import type { Komentar } from '../type';
  import GridKometarov from './Grid.vue';
  import { NAME as NAME_VRACENI_ND } from '@/views/vraceniBaterie/constants';

  export interface Props {
    rows: Komentar[];
    references?: Priloha[];
    entita: string;
    parentId?: string | number | null;
  }

  const props = defineProps<Props>(); //--withDefaults(, { references: () => [] as Priloha[] });
  const propsRef = toRefs(props);
  const emits = defineEmits(['addKomentar', 'update', 'delete']);
  const { t } = useI18n();

  const novyKomentar = ref('');
  const isVraceniBaterie = computed(() => propsRef.entita.value === NAME_VRACENI_ND);
  const paramIdName = computed(() => (isVraceniBaterie.value ? 'vraceniBaterieId' : 'knr'));

  function upload() {
    emits('addKomentar', { text: novyKomentar.value });
    novyKomentar.value = '';
  }

  const baseUrl = computed(() => {
    return `${import.meta.env.VITE_APP_API_BASE_URL}/${props.entita}/${NAME_PRILOHY}?${paramIdName.value}=${props.parentId}`;
  });
</script>

<style scoped></style>
