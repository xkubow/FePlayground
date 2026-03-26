<template>
  <k-popover :teleported="false" trigger="click" :width="650">
    <div style="text-align: right; margin: 0">
      <k-descriptions :column="1" border>
        <template #title>
          <span>{{ t('ridiciJednotkaInfo') }}</span>
        </template>
        <k-descriptions-item v-for="(value, name) in filteredData" :key="name" :label="`${t(name)}: `">{{ value }}</k-descriptions-item>
      </k-descriptions>
    </div>
    <template #reference>
      <k-icon class="cursor-p" :size="15" @click="ptbClicked"><info-filled-icon /></k-icon>
    </template>
  </k-popover>
</template>

<script setup lang="ts">
  import { ElDescriptionsItem } from 'element-plus';
  import { InfoFilled as InfoFilledIcon } from '@element-plus/icons-vue';
  import { omit } from 'lodash-es';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { Row as RjInfo } from '../tables/ridiciJednotka';

  export interface Prop {
    rjInfo?: RjInfo;
  }

  const props = defineProps<Prop>();

  const { t } = useI18n();

  const filteredData = computed(() => omit(props.rjInfo, ['rowNumber', 'testId', 'ridiciJednotkaId']));

  function ptbClicked(event: Event) {
    event.stopPropagation();
  }
</script>

<style scoped></style>
