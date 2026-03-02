<template>
  <k-dialog :title="t('pracoviste')" center draggable @update:modelValue="$emit('update:modelValue', $event)" v-on="{ ok, cancel, open, close }">
    <k-select v-bind="{ options: kontrolniBodList, labelKey: 'kontrolniBod', wrapp: false, span: 4 }" v-model="kontrolniBodId" wrappClass="pr-10" />
    <k-select v-bind="{ options: segmentList, labelKey: 'segment', wrapp: false, span: 4 }" v-model="segmentId" wrappClass="pr-10" />
    <k-input v-bind="{ labelKey: 'upsNazev', wrapp: false, span: 8 }" v-model="upsNazev" wrappClass="pr-10" />
    <k-input v-bind="{ labelKey: 'sqsId', wrapp: false, span: 4 }" v-model="sqsId" wrappClass="pr-10" />
    <k-input v-bind="{ labelKey: 'cislo', wrapp: false, span: 4 }" v-model.number="cislo" />
  </k-dialog>
</template>

<script setup lang="ts">
  import type { DropdownItem } from '@/template/page/@types/mode';
  import { ref, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { apiProvider } from '../api';

  export interface Props {
    verze: number;
    vyrobniLinkaId: number;
    vyrobniLinkaKontrolniBodId?: number;
    vyrobniLinkaSegmentId?: number;
    kontrolniBodList: DropdownItem[];
    segmentList: DropdownItem[];
  }

  const props = defineProps<Props>();
  const propsRef = toRefs(props);

  const emits = defineEmits(['update:modelValue', 'loadRows']);

  const { t } = useI18n();

  const cislo = ref<number | null>(null);
  const upsNazev = ref<string | null>(null);
  const sqsId = ref<number | null>(null);
  const kontrolniBodId = ref<number | null>(null);
  const segmentId = ref<number | null>(null);

  function open() {
    kontrolniBodId.value = propsRef.vyrobniLinkaKontrolniBodId?.value ?? null;
    segmentId.value = propsRef.vyrobniLinkaSegmentId?.value ?? null;
  }

  function close() {
    cislo.value = null;
    upsNazev.value = null;
    kontrolniBodId.value = null;
    segmentId.value = null;
  }

  async function createEntity() {
    await apiProvider.createEntity({
      verze: propsRef.verze.value,
      vyrobniLinkaId: propsRef.vyrobniLinkaId.value,
      upsNazev: upsNazev.value,
      sqsId: sqsId.value,
      vyrobniLinkaKontrolniBodId: kontrolniBodId.value,
      vyrobniLinkaSegmentId: segmentId.value,
      cislo: cislo.value,
    });
    emits('update:modelValue', false);
    emits('loadRows');
  }

  function ok() {
    createEntity();
  }

  function cancel() {
    emits('update:modelValue', false);
  }
</script>

<style scoped></style>
