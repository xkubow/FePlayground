<template>
  <k-dialog v-model="dialogVisible" :title="t('OPN')">
    <k-row>
      <k-check-box :model-value="true" :label="t('EskalaceCheckModel.Baterka')" />
    </k-row>
    <k-row>
      <k-check-box :model-value="true" :label="t('EskalaceCheckModel.Svorkovnice')" />
    </k-row>
    <k-row>
      <k-check-box :model-value="true" :label="t('EskalaceCheckModel.Poistky')" />
    </k-row>
    <k-row>
      <k-check-box :model-value="true" :label="t('EskalaceCheckModel.Kostra')" />
    </k-row>
    <k-row>
      <k-check-box :model-value="true" :label="t('EskalaceCheckModel.Svazky')" />
    </k-row>
    <template #footer>
      <span class="dialog-footer">
        <k-button @click="dialogVisible = false">{{ t('ok') }}</k-button>
      </span>
    </template>
  </k-dialog>
</template>

<script setup lang="ts">
  import { computed, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';

  export interface Props {
    visible: boolean;
  }
  const { t } = useI18n();

  const props = defineProps<Props>();
  const propsRef = toRefs(props);
  const emit = defineEmits(['update:visible']);

  const dialogVisible = computed({
    get() {
      return propsRef.visible.value;
    },
    set(val) {
      emit('update:visible', val);
    },
  });
</script>

<style scoped></style>
