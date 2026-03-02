<template>
  <div class="action_envelop">
    <!-- <k-button @click="clickEvent('openTestyUps')" :type="aktualnyStatusBg">{{ t('testyUPS') }}</k-button> -->
    <k-button data-testid="zadat-zavadu" @click="clickEvent('openPuvodniUps')" :disabled="false">{{ t('upsPuvodni') }}</k-button>
    <k-button @click="clickEvent('openCarRfid')" :disabled="false">{{ t('carRfid') }}</k-button>
    <k-button @click="clickEvent('openPuvodniSqs')" :disabled="false">{{ t('sqsPuvodni') }}</k-button>
    <k-button id="create-zavadu-action-button" @click="clickEvent('createZavadu')">{{ t('zadatZavadu') }}</k-button>
    <k-button :disabled="!operationEskalaceCreate" @click="clickEvent('createEskalaci')">{{ t('createEskalaci') }}</k-button>
    <k-button @click="clickEvent('openElsa')">{{ t('Elsa') }}</k-button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  export interface Props {
    aktualnyStatusBg: 'success' | 'danger';
    eskalaceExists: boolean;
    operationEskalaceCreate: boolean | null;
  }
  type Emits = 'createZavadu' | 'createEskalaci' | 'openTestyUps' | 'openPuvodniUps' | 'openCarRfid' | 'openPuvodniSqs' | 'openElsa';
  const { t } = useI18n();

  defineProps<Props>();
  const emit = defineEmits([
    'update:modelValue',
    'createZavadu',
    'createEskalaci',
    'openTestyUps',
    'openPuvodniUps',
    'openCarRfid',
    'openPuvodniSqs',
    'openElsa',
  ]);

  function clickEvent(emitName: Emits) {
    emit('update:modelValue', false);
    emit(emitName);
  }
</script>

<style lang="scss" scoped>
  .action_envelop {
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: 1px;

    button {
      margin: 0px;
    }
  }

  @media only screen and (max-width: 992px) {
    .action_envelop {
      align-items: stretch;
      flex-direction: column;
    }
  }
</style>
