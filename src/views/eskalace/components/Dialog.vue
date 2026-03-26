<template>
  <k-dialog v-model="dialogVisible" :title="title" @closed="$emit('closed')" @close="$emit('close')" v-on="{ open }">
    <k-steps v-if="isVytvoreni" style="max-width: 600px" :space="200" :active="allMandatoryDone ? 1 : 0" finish-status="success" class="jc-c">
      <k-step :title="t('odis/opn')" />
      <k-step :title="t('eskalace')" />
    </k-steps>
    <DialogMandatoryFrame v-show="!allMandatoryDone" ref="mandatoryFrame" v-model:allMandatoryDone="allMandatoryDone" :eskalace-id="newEskalaceId" />
    <DialogEskalaceFrame
      v-show="allMandatoryDone"
      v-bind="props"
      v-model:eskalace="eskalaceCmd"
      v-model:references="propsRef.references.value"
      v-model:prirazenaSkupinaUzivateluId="prirazenaSkupinaUzivateluId"
      v-model:uzivatelPrirazeno="uzivatelPrirazeno"
      :uzivatelSkupinaList="uzivatelSkupinaList"
    />
    <template #footer>
      <span class="dialog-footer">
        <k-button v-show="allMandatoryDone" @click="dialogVisible = false">{{ t('zrusit') }}</k-button>
        <k-button v-show="allMandatoryDone" type="primary" @click="okClick">{{ t('ulozit') }}</k-button>
      </span>
    </template>
  </k-dialog>
</template>

<script setup lang="ts">
  import type { Priloha } from '@/views/prilohy/type';
  import { computed, ref, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { EnumEskalaceDialogType } from '../constants';
  import { eskalace, useEskalace } from '../provider';
  import type { Eskalace, SkupinaDropDown } from '../type';
  import { cloneDeep } from 'lodash-es';
  import DialogEskalaceFrame from './DialogEskalaceFrame.vue';
  import DialogMandatoryFrame from './DialogMandatoryFrame.vue';
  import { useLogger } from '@/template/logger';

  export interface Props {
    visible: boolean;
    vozidloId: number;
    eskalace?: Eskalace;
    references: Priloha[];
    eskalaceEditDatum: Date | null;
    type: EnumEskalaceDialogType;
    uzivatelSkupinaList: SkupinaDropDown[];
  }

  const mandatoryFrame = ref<InstanceType<typeof DialogMandatoryFrame> | null>(null);
  const allMandatoryDone = ref(false);
  const props = defineProps<Props>();
  const propsRef = toRefs(props);
  const { t } = useI18n();
  const logger = useLogger();
  const emit = defineEmits(['update:eskalace', 'update:visible', 'closed', 'close', 'update:eskalaceEditDatum']);

  const eskalaceCmd = ref<Eskalace>(cloneDeep(eskalace));
  const newEskalaceId = ref<number | null>(null);
  function open() {
    allMandatoryDone.value = true;
    mandatoryFrame.value?.clear();
    if (propsRef.type.value === EnumEskalaceDialogType.Vytvoreni) {
      eskalaceCmd.value = cloneDeep(eskalace);
      allMandatoryDone.value = false;
    } else if (propsRef.eskalace.value) eskalaceCmd.value = propsRef.eskalace.value;

    eskalaceCmd.value.knr = propsRef.vozidloId.value;
    if (propsRef.type.value === EnumEskalaceDialogType.KSchvaleni || propsRef.type.value === EnumEskalaceDialogType.KZamietnutiu) {
      prirazenaSkupinaUzivateluId.value = eskalaceCmd.value.prirazenaSkupinaUzivateluId;
      uzivatelPrirazeno.value = eskalaceCmd.value.uzivatelPrirazeno;
    }
  }

  const prirazenaSkupinaUzivateluId = ref<number | null>(null);
  const uzivatelPrirazeno = ref<string[]>([]);

  const options = computed(() => ({ type: propsRef.type.value }));

  const { title, save } = useEskalace(eskalaceCmd, propsRef.uzivatelSkupinaList, options);

  const dialogVisible = computed({
    get() {
      return propsRef.visible.value;
    },
    set(val) {
      emit('update:visible', val);
    },
  });

  const isVytvoreni = computed(() => propsRef.type.value === EnumEskalaceDialogType.Vytvoreni);

  const okClick = async () => {
    if (!propsRef.vozidloId?.value) throw Error('no vozidloId');
    if (!eskalaceCmd.value.ridiciJednotkaId) {
      logger.log(t('errorMessages.eskalace.noRJ'));
      return;
    }
    eskalaceCmd.value = {
      ...eskalaceCmd.value,
      prirazenaSkupinaUzivateluId: prirazenaSkupinaUzivateluId.value,
      uzivatelPrirazeno: uzivatelPrirazeno.value,
    };
    const result = await save();
    newEskalaceId.value = result as number;
    mandatoryFrame.value?.upload();
    emit('update:eskalaceEditDatum', new Date());
    prirazenaSkupinaUzivateluId.value = null;
    uzivatelPrirazeno.value = [];
    dialogVisible.value = false;
  };
</script>

<style scoped></style>
