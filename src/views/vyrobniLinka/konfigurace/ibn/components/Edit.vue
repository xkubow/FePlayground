<template>
  <k-dialog :title="t('ibn')" center draggable @update:modelValue="$emit('update:modelValue', $event)" v-on="{ ok, cancel, close }">
    <k-input v-bind="{ labelKey: 'poradi', wrapp: false, span: 3 }" v-model.number="poradi" />
    <k-input v-bind="{ labelKey: 'ibnNazev', wrapp: false, span: 7 }" v-model="ibnNazev" />
    <k-select
      v-bind="{ options: kontrolniBodList, labelKey: 'repaseKontrolniBodId', wrapp: false, span: 7 }"
      v-model="repaseKontrolniBodId"
      wrappClass="pr-10"
    />
    <k-check-box v-bind="{ labelKey: 'zobrazitNaSemaforu', wrapp: false, span: 7 }" v-model="zobrazitNaSemaforu" />
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
    kontrolniBodList: DropdownItem[];
  }

  const props = defineProps<Props>();
  const propsRef = toRefs(props);

  const emits = defineEmits(['update:modelValue', 'loadRows']);

  const { t } = useI18n();

  const poradi = ref<number | null>(null);
  const ibnNazev = ref<string | null>(null);
  const repaseKontrolniBodId = ref<number | null>(null);
  const zobrazitNaSemaforu = ref(false);

  function close() {
    poradi.value = null;
    ibnNazev.value = null;
    repaseKontrolniBodId.value = null;
    zobrazitNaSemaforu.value = false;
  }

  async function addIbnBod() {
    await apiProvider.createEntity({
      verze: propsRef.verze.value,
      vyrobniLinkaId: propsRef.vyrobniLinkaId.value,
      poradi: poradi.value,
      ibnNazev: ibnNazev.value,
      repaseKontrolniBodId: repaseKontrolniBodId.value,
      zobrazitNaSemaforu: zobrazitNaSemaforu.value,
    });
    emits('update:modelValue', false);
    emits('loadRows');
  }

  function ok() {
    addIbnBod();
  }

  function cancel() {
    emits('update:modelValue', false);
  }
</script>

<style scoped></style>
