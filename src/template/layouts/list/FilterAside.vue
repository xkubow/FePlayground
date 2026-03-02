<template>
  <k-container direction="vertical" class="k-filter-aside">
    <k-header>
      <k-row class="w-100">
        <k-col>
          <k-button class="search-button w-100" type="warning" plain @click="$emit('update:show-filter', !showFilter)">
            <el-icon :size="25">
              <arrow-left-icon />
            </el-icon>
          </k-button>
        </k-col>
      </k-row>

      <k-row class="w-100">
        <k-button-group class="w-100">
          <k-button type="success" @click="$emit('filterClick', $emit)" :icon="CheckIcon" class="w-100" />
          <k-button type="info" @click="$emit('filterResetClick', $emit)" class="w-100" :icon="CloseIcon" />
        </k-button-group>
      </k-row>
    </k-header>

    <k-main class="k-filter-aside-main">
      <k-form ref="filterFormRef" :model="model" :validate-on-rule-change="false" :rules="validationRules" @submit="$emit('filterSubmitClick', $emit)">
        <k-row>
          <slot />
        </k-row>
      </k-form>
    </k-main>

    <k-footer class="k-filter-aside-footer"> </k-footer>
  </k-container>
</template>

<script setup lang="ts">
  import type { UnknownObject } from '@/template/@types/kTemplate';
  import { ArrowLeft as ArrowLeftIcon, Check as CheckIcon, Close as CloseIcon } from '@element-plus/icons-vue';

  export interface Props {
    model?: UnknownObject;
    validationRules?: UnknownObject;
    showFilter: boolean;
  }

  defineProps<Props>();
</script>

<style scoped></style>
