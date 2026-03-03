<template>
  <k-dialog :title="t('CasOpravy')" @close="$emit('update:modelValue', false)" @open="open">
    <div v-loading="loading" element-loading-text="Loading...">
      <k-row>
        <k-input-number label-key="dobaOpravyMinuty" v-model="dobaOpravyMinutyCmp" :span="4" />
        <k-date-interval
          v-model="interval"
          label-key="Od-Do"
          v-bind="{ type: 'datetime', format: 'DD.MM.YYYY HH:mm' }"
          isHiddenLabel
          overwriteHiddenLabel
          :span="16"
        />
      </k-row>
      <k-row>
        <k-input label-key="text" v-model="casOpravyVozidla.text" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
      </k-row>
      <k-descriptions v-if="casOpravyVozidla.id">
        <k-descriptions-item :span="24" :label="`${t('Zavada')}:`"
          >{{ casOpravyVozidla.sqsZavadaMistoText }} - {{ casOpravyVozidla.sqsZavadaTypText }} - {{ casOpravyVozidla.sqsZavadaVinikText }}</k-descriptions-item
        >
        <k-descriptions-item :span="24" :label="`${t('vytvoril')}:`"
          >{{ casOpravyVozidla.vstupUzivatelZobrazeneJmeno }} -
          {{ casOpravyVozidla.vstupDatum ? toLocale(casOpravyVozidla.vstupDatum) : '' }}</k-descriptions-item
        >
        <k-descriptions-item :span="24" :label="`${t('Editoval')}:`"
          >{{ casOpravyVozidla.editUzivatelZobrazeneJmeno }} - {{ casOpravyVozidla.editDatum ? toLocale(casOpravyVozidla.editDatum) : '' }}</k-descriptions-item
        >
      </k-descriptions>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <k-button type="success" @click="save">{{ t('ok') }}</k-button>
      </span>
    </template>
  </k-dialog>
</template>

<script setup lang="ts">
  import { computed, toRefs, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Interval } from '@/template/components/@types';
  import dayjs from 'dayjs';
  import { apiProviderCasOpravy } from '../api';
  import { useStore as useAuthorizationStore } from '@/template/account/authorization/store';
  import { CasOpravyVozidla } from '../type.d';
  import { toLocale } from '@/template/utils/date';

  export interface Props {
    knr?: number | null;
    vozidloZavadaId?: number | null;
    casOpravyId: number | null;
  }
  const { t } = useI18n();

  const props = defineProps<Props>();
  const propsRef = toRefs(props);
  const emit = defineEmits(['update:modelValue', 'refresh']);
  const authorizationStore = useAuthorizationStore();

  const casOpravyVozidla = ref<CasOpravyVozidla>(new CasOpravyVozidla());
  const interval = ref<Interval<Date | null>>(new Interval());
  const loading = ref<boolean>(true);

  const dobaOpravyMinutyCmp = computed({
    get() {
      return casOpravyVozidla.value.dobaOpravyMinuty;
    },
    set(val) {
      casOpravyVozidla.value.dobaOpravyMinuty = val;
      interval.value.od = dayjs(interval.value.do)
        .subtract(val ?? 0, 'minute')
        .toDate();
      casOpravyVozidla.value.casZacatek = interval.value.od;
    },
  });

  watch(
    interval,
    (val) => {
      casOpravyVozidla.value.dobaOpravyMinuty = dayjs(val.do).diff(dayjs(val.od), 'minute');
    },
    { deep: true, immediate: true },
  );

  async function open() {
    loading.value = true;
    interval.value.od = new Date();
    interval.value.do = new Date();
    casOpravyVozidla.value.dobaOpravyMinuty = 0;
    casOpravyVozidla.value.text = null;
    casOpravyVozidla.value.knr = propsRef.knr.value ?? null;
    casOpravyVozidla.value.vozidloZavadaId = propsRef.vozidloZavadaId.value ?? null;
    casOpravyVozidla.value.id = null;
    if (!!propsRef.casOpravyId.value) {
      const response = await apiProviderCasOpravy.loadEntity<CasOpravyVozidla>(propsRef.casOpravyId.value);
      if (response?.data) {
        casOpravyVozidla.value = response?.data!;
        interval.value.od = casOpravyVozidla.value.casZacatek;
        interval.value.do = dayjs(interval.value.od)
          .add(casOpravyVozidla.value.dobaOpravyMinuty ?? 0, 'minute')
          .toDate();
      }
    }
    loading.value = false;
  }

  async function save() {
    loading.value = true;
    const entity = { ...casOpravyVozidla.value, uzivatelId: authorizationStore.user?.uzivatelId };
    if (!!propsRef.casOpravyId.value && entity.id) await apiProviderCasOpravy.updateEntity(entity.id, entity);
    else await apiProviderCasOpravy.createEntity(entity);

    emit('update:modelValue', false);
    emit('refresh');
  }
</script>

<style scoped></style>
