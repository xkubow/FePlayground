<template>
  <el-dialog v-bind="$attrs">
    <k-row class="ai-c jc-sb">
      <slot />
    </k-row>
    <template #footer>
      <slot name="footer">
        <k-row class="jc-fe">
          <k-button v-if="showCancel" @click="$emit('cancel')">{{ t('zrusit') }}</k-button>
          <k-button v-if="showOk" type="primary" @click="$emit('ok')">{{ t('ok') }}</k-button>
        </k-row>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  export interface Props {
    showOk?: boolean;
    showCancel?: boolean;
  }
  export default {
    name: 'k-dialog',
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  withDefaults(defineProps<Props>(), { showOk: true, showCancel: true });

  defineEmits(['ok', 'cancel']);
</script>

<style scoped></style>
