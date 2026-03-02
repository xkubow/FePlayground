<template>
  <k-row :gutter="10">
    <k-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
      <div class="d-f ai-c">
        <div class="knr-label hidden-sm-and-down">{{ t('knr') }}:</div>
        <div ref="knrRef" :class="knrClasses">{{ maskedKnr }}</div>
        <el-icon class="ml-a mr-10 cursor-p hover-color" size="30px" @click="dialogVisible = true"><InfoFilled /></el-icon>
      </div>
      <div class="d-f ai-c">
        <k-select
          label-key="stitok"
          v-model="vozidloStitekVmodel"
          :options="vozidloStitekDDL"
          multiple
          :disabled="isDisabled || !vozidlo?.operationVozidloStitekUpdate"
          @change="$emit('updateStitky', $event)"
          :showLabel="false"
        />
      </div>
      <div class="d-f ai-c jc-sa" v-if="vozidlo && isElectricCar">
        <k-button v-if="!vozidlo!.zavadaVN" @click="$emit('updateZavadaNV', true)" :span="5" :label="t('HighVoltageWarning')" />
        <el-popconfirm
          v-if="vozidlo!.zavadaVN"
          width="340"
          :title="t('RemoveHightVoltage')"
          :confirm-button-text="t('ano')"
          :cancel-button-text="t('ne')"
          @confirm="$emit('updateZavadaNV', false)"
        >
          <template #reference>
            <k-row :gutter="20" :align="'middle'" :flex-wrap="null">
              <el-icon :size="100">
                <HighVoltageSign />
              </el-icon>
              <k-col :span="16" :style="{ fontWeight: 'bold' }">{{ t('VNWarninig') }}</k-col>
            </k-row>
          </template>
        </el-popconfirm>
        <el-icon :size="100" @click="$emit('updateBaterieVyjmuta')">
          <BaterieVyjmutaSign :baterie-vyjmuta="vozidlo!.baterieVyjmuta ?? false" />
        </el-icon>
      </div>
    </k-col>
    <k-col class="hidden-sm-and-down" :span="12">
      <k-voz-description-vue v-bind="{ vozidlo, stitky: vozidloStitekTexts, hideKnrStitok: true }" />
    </k-col>
    <k-col v-if="eskalace" class="hidden-sm-and-down" :span="5">
      <k-eskalace-description-vue v-bind="{ eskalace, uzivatelSkupinaList }" />
    </k-col>
  </k-row>
  <k-dialog v-model="dialogVisible" v-bind="{ showOk: false, showCancel: false, title: t('vozidloDescription ') }">
    <k-voz-description-vue v-bind="{ vozidlo, stitky: vozidloStitekTexts, hideKnrStitok: false }" />
    <k-eskalace-description-vue v-bind="{ eskalace, uzivatelSkupinaList }" />
  </k-dialog>
</template>

<script lang="ts">
  import { useDisabled } from '@/template/components/base/base';
  import { removeWhiteSpaceToClipboard } from '@/template/utils/dataMapper';
  import { actualLocale } from '@/template/utils/date';
  import { EnumStatusIo } from '@/views/chyby/constants';
  import KEskalaceDescriptionVue from '@/views/eskalace/components/KTableDescription.vue';
  import type { Eskalace, SkupinaDropDown } from '@/views/eskalace/type.d';
  import type { VozidloStitek } from '@/views/vozidloStitek/type';
  import { InfoFilled } from '@element-plus/icons-vue';
  import _ from 'lodash';
  import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRefs, type PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { maskKnr } from '../provider';
  import { SystemPohonu, type Vozidlo } from '../type.d';
  import KVozDescriptionVue from './KTableDescription.vue';
  import HighVoltageSign from './HighVoltageSign.vue';
  import BaterieVyjmutaSign from './BaterieVyjmutaSign.vue';

  export default defineComponent({
    props: {
      vozidlo: { type: Object as PropType<Vozidlo> },
      eskalace: { type: Object as PropType<Eskalace[] | null> },
      highlight: Boolean,
      modelHide: Boolean,
      testHide: Boolean,
      vozidloStitekList: { type: Object as PropType<VozidloStitek[]> },
      vozidloStitek: { type: Array },
      uzivatelSkupinaList: { type: Object as PropType<SkupinaDropDown[] | null> },
    },
    emits: ['updateStitky', 'update:vozidloStitek', 'updateZavadaNV', 'updateBaterieVyjmuta'],
    components: {
      InfoFilled,
      KVozDescriptionVue,
      KEskalaceDescriptionVue,
      HighVoltageSign,
      BaterieVyjmutaSign,
    },
    setup(props, { emit }) {
      const { vozidlo, highlight, vozidloStitekList, vozidloStitek } = toRefs(props);
      const { t } = useI18n();
      const knrRef = ref<HTMLElement | null>(null);
      const { isDisabled } = useDisabled();

      const motorText = computed(() => {
        return '';
      });

      const dateText = computed(() => {
        return '';
      });

      const knrClasses = computed(() => {
        const classes: string[] = [];
        highlight.value && classes.push('first_value');
        vozidlo.value?.statusIoEnum === EnumStatusIo.neopraveno && classes.push('status-no-ok');
        vozidlo.value?.statusIoEnum === EnumStatusIo.opraveno && classes.push('status-ok');
        return classes;
      });

      const maskedKnr = computed(() => maskKnr(vozidlo.value?.knr?.toString()));

      const vozidloStitekDDL = computed(() => vozidloStitekList.value?.map((i) => ({ value: i.id, text: i.text })));
      const vozidloStitekTexts = computed(() => vozidloStitekDDL.value?.filter((i) => vozidloStitek.value?.includes(i.value))?.map((i) => i.text));

      const vozidloStitekVmodel = computed({
        get() {
          return vozidloStitek.value;
        },
        set(val) {
          emit('update:vozidloStitek', val);
        },
      });

      let copyEventListener = (evt: ClipboardEvent) => {
        removeWhiteSpaceToClipboard(evt);
      };

      onMounted(() => {
        knrRef.value && knrRef.value.addEventListener('copy', copyEventListener);
      });

      onBeforeUnmount(() => {
        knrRef.value && knrRef.value.removeEventListener('copy', copyEventListener);
      });

      const dialogVisible = ref(false);

      const isElectricCar = computed(
        () => vozidlo.value && vozidlo.value.systemPohonu !== SystemPohonu.BezAlternativniho && vozidlo.value.systemPohonu !== SystemPohonu.Plynovy,
      );

      return {
        motorText,
        dateText,
        knrClasses,
        maskedKnr,
        t,
        vozidloStitekDDL,
        vozidloStitekVmodel,
        knrRef,
        actualLocale,
        dialogVisible,
        vozidloStitekTexts,
        isDisabled,
        isElectricCar,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .first_value {
    text-align: start;
    font-size: 29pt;
    font-weight: bold;
  }

  .status-no-ok {
    color: red;
  }
  .status-ok {
    color: #9bd1a7;
  }

  .label {
    width: 150px;
  }
  .knr-label {
    width: 50px;
  }
</style>
