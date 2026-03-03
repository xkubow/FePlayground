<template>
  <k-col :span="24" class="caption_eskalace">
    <span class="d-f ai-c">
      <span class="mr-10">{{ t('eskalace') }}</span>
      <template v-if="!isUzavreta">
        <k-button plain type="success" :icon="CheckIcon" @click="$emit('save')" />
        <k-button plain v-if="keSchvaleni" :disabled="!eskalaceCmd.operationEskalaceSchvaleni" type="success" @click="$emit('schvaleni')"
          >{{ t('schvaleni') }}
        </k-button>
        <k-button plain v-if="keSchvaleni" type="danger" @click="$emit('zamitnuti')">{{ t('zamitnuti') }} </k-button>
        <template v-else>
          <k-button v-if="!schvalena" plain @click="$emit('predajKeSchvaleni')">{{ t('keSchvaleni') }} </k-button>
          <k-button v-if="schvalena && eskalaceCmd.eskalaceStatusEnum === EnumEskalaceStatus.Vyroba" plain @click="$emit('kAnalyze')"
            >{{ t('kAnalyze') }}
          </k-button>
          <k-button
            v-if="schvalena && eskalaceCmd.eskalaceStatusEnum === EnumEskalaceStatus.VReseni"
            :disabled="!eskalaceCmd.operationEskalacePredani"
            plain
            @click="$emit('vraceniKAnalyze')"
            >{{ t('vraceniKAnalyze') }}
          </k-button>
          <k-button
            v-if="eskalaceCmd.eskalaceStatusEnum === EnumEskalaceStatus.Analyza"
            plain
            :disabled="!eskalaceCmd.operationEskalacePredani"
            @click="$emit('doVyroby')"
            >{{ t('predaniDoVyroby') }}
          </k-button>
          <k-button
            v-if="eskalaceCmd.eskalaceStatusEnum === EnumEskalaceStatus.Analyza"
            plain
            :disabled="!eskalaceCmd.operationEskalacePredani"
            @click="$emit('kReseni')"
            >{{ t('predaniKReseni') }}
          </k-button>
          <k-button plain :disabled="!uzavreniEnabled" @click="$emit('uzavreni')">{{ t('uzavreni') }} </k-button>
        </template>
        <k-button plain @click="dialogOpnCheckVisible = true">{{ t('OPN') }}</k-button>
        <k-button plain @click="createVraceniBaterie" v-if="!eskalace.vraceniBaterie">{{ t('VytvorVraceniBaterie') }}</k-button>
        <k-button plain @click="editVraceniBaterie" v-else>{{ t('BaterieVracena') }}</k-button>
      </template>
      <k-button v-else :disabled="!operationEskalaceZnovuotevreni" plain @click="$emit('otvoreniUzavrene')">{{ t('ZnovuOtevreni') }} </k-button>
    </span>
  </k-col>
  <template v-if="!isUzavreta">
    <k-col>
      <k-select
        :span="8"
        label-key="ridiciJednotka"
        show-more
        v-model="eskalaceCmd.ridiciJednotkaId"
        :options="cacheStore.dropDownList.ridiciJednotka"
        filterable
        :clearable="false"
      />
      <k-card row v-if="eskalace.vraceniBaterie" body-class="card_body_p-0" header-class="card_header_p-0" class="card_p-0">
        <template #header>
          {{ t('BaterieVracena') }}
        </template>
        <k-col>
          <k-row></k-row>
          <k-row>
            <k-input v-if="eskalace.vraceniBaterie" label-key="NdNr" :span="4" v-model="eskalace.vraceniBaterie.ndNr" :disabled="true" />
            <k-input label-key="bG" :span="4" v-model="eskalace.vraceniBaterie.bg" :disabled="true" />
            <k-input label-key="fazitId" :span="4" v-model="eskalace.vraceniBaterie.fazitId" :disabled="true" />
          </k-row>
          <k-row>
            <k-input label-key="swVersion" :span="4" v-model="eskalace.vraceniBaterie.swVersion" :disabled="true" />
            <k-input label-key="hwVersion" :span="4" v-model="eskalace.vraceniBaterie.hwVersion" :maxlength="4" :disabled="true" />
          </k-row>
        </k-col>
      </k-card>
    </k-col>
    <k-col> </k-col>
    <k-select
      :span="4"
      label-key="UzivateleSkupina"
      show-more
      v-model="eskalaceCmd.prirazenaSkupinaUzivateluId"
      v-bind="{ optionsValueName: 'id', optionsTextName: 'text' }"
      :options="priradeniSkupinaList"
    />
    <k-select
      :span="20"
      :label="t('uzivatel', 2)"
      v-model="eskalaceCmd.uzivatelPrirazeno"
      multiple
      filterable
      remote
      reserve-keyword
      :remote-method="predaniRemoteMethod"
      :loading="predaniLoading"
      :options="eskalaceCmd.uzivatelPrirazenoDropDownList"
    />
  </template>
  <template v-if="keSchvaleni">
    <k-select
      :span="4"
      label-key="SchvalovateleSkupina"
      show-more
      v-bind="{ optionsValueName: 'id', optionsTextName: 'text' }"
      v-model="eskalaceCmd.schvalujeSkupinaUzivateluId"
      :options="schvalovateleSkupinaList"
    />
    <k-select
      :span="20"
      label-key="schvalovatel"
      v-model="eskalaceCmd.uzivatelSchvaluje"
      multiple
      filterable
      remote
      reserve-keyword
      :remote-method="schvalovateleRemoteMethod"
      :loading="schvalovateleLoading"
      :options="eskalaceCmd.uzivatelSchvalujeDropDownList"
    />
  </template>
  <k-descriptions>
    <k-descriptions-item :span="24" :label="`${t('vytvoril')}:`">{{ eskalace.vstupUzivatelText }}</k-descriptions-item>
    <k-descriptions-item v-if="!keSchvaleni" :span="24" :label="`${t('schvalene')}:`">{{ eskalaceCmd.schvaleniUzivatelText }}</k-descriptions-item>
  </k-descriptions>
  <k-col>{{ `${t('text')}:` }}</k-col>
  <k-rich-text v-model="eskalaceCmd.text" v-bind="{ references: eskalace?.priloha?.rows ?? [], baseUrl, uploadVisible: false, editable: !isUzavreta }" />
  <DialogOpnCheck v-model:visible="dialogOpnCheckVisible" />
</template>

<script setup lang="ts">
  import { EnumStatusIo } from '@/views/chyby/constants';
  import { prilohyUrl } from '@/views/vozidlo/constants';
  import { Check as CheckIcon } from '@element-plus/icons-vue';
  import { computed, toRefs, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { EnumEskalaceStatus } from '../constants';
  import { useEskalace } from '../provider';
  import type { Eskalace, SkupinaDropDown } from '../type';
  import { useStore as useCacheStore } from '@/template/cache';
  import DialogOpnCheck from './DialogOpnCheck.vue';
  import { openPage } from '@/template/router/path';
  import { createName, editName, PageMode } from '@/template/page/constants';
  import { NAME as VRACENI_ND_NAME } from '@/views/vraceniBaterie/constants';
  import { NAME } from '../constants';
  import { template } from 'lodash';

  export interface Props {
    type?: string;
    eskalace: Eskalace;
    statusIoEnum?: EnumStatusIo | null;
    operationEskalaceCreate: boolean | null;
    operationEskalaceZnovuotevreni: boolean | null;
    uzivatelSkupinaList: SkupinaDropDown[];
  }

  const props = withDefaults(defineProps<Props>(), { type: 'vozidlo' });
  const propsRef = toRefs(props);
  const { t } = useI18n();

  const cacheStore = useCacheStore();

  const emit = defineEmits([
    'update:visible',
    'closed',
    'close',
    'update:eskalace',
    'save',
    'schvaleni',
    'zamitnuti',
    'uzavreni',
    'doVyroby',
    'kAnalyze',
    'predajKeSchvaleni',
    'kReseni',
    'vraceniKAnalyze',
    'otvoreniUzavrene',
  ]);

  const eskalaceCmd = computed({
    get() {
      return propsRef.eskalace.value;
    },
    set(val: Eskalace) {
      emit('update:eskalace', val);
    },
  });

  const baseUrl = computed(() => {
    return `${prilohyUrl}${props.eskalace.knr}`;
  });

  const isUzavreta = computed(() => eskalaceCmd.value.eskalaceStatusEnum === EnumEskalaceStatus.Uzavrena);

  const {
    predaniLoading,
    predaniRemoteMethod,
    schvalovateleLoading,
    schvalovateleRemoteMethod,
    keSchvaleni,
    priradeniSkupinaList,
    schvalovateleSkupinaList,
    schvalena,
  } = useEskalace(eskalaceCmd, propsRef.uzivatelSkupinaList);

  const uzavreniEnabled = computed(
    () =>
      propsRef.statusIoEnum?.value === EnumStatusIo.bezChyb ||
      propsRef.statusIoEnum?.value === EnumStatusIo.opraveno ||
      eskalaceCmd.value.operationEskalaceCloseNiO,
  );

  const dialogOpnCheckVisible = ref(false);

  const createVraceniBaterie = () => {
    openPage(createName(`${VRACENI_ND_NAME}From${NAME}`), PageMode.CREATE, { eskalaceId: eskalaceCmd.value.id });
  };

  const editVraceniBaterie = () => {
    openPage(editName(`${VRACENI_ND_NAME}`), PageMode.EDIT, { id: eskalaceCmd.value.vraceniBaterie!.id!.toString() });
  };
</script>

<style scoped></style>
