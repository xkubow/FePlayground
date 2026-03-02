<script lang="ts">
  export default {
    name: 'k-table-frame',
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  import { Search as SearchIcon, Setting as SettingIcon, Download as DownloadIcon } from '@element-plus/icons-vue';
  import { toRefs, useSlots } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { Paging } from './@types/table';
  import { usePaging } from './paging';

  export interface Props {
    label?: string;
    labelKey?: string;
    paging?: Paging;
    totalCount?: number;
    showFilter?: boolean;
    filterEnabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), { totalCount: 0, filterEnabled: false });
  const { paging, totalCount } = toRefs(props);
  const { t } = useI18n();

  const slots = useSlots();

  const emits = defineEmits(['load-rows', 'update:paging', 'update:showFilter', 'exportRows']);

  const { vModelPaging, updateCurrentPage } = usePaging({ paging, totalCount }, emits);
</script>

<template>
  <k-container>
    <k-aside :span="5" v-show="showFilter">
      <slot name="aside"></slot>
    </k-aside>
    <k-container direction="vertical" :class="{ 'k-table-container': vModelPaging }">
      <k-header v-if="slots.header || labelKey || label">
        <slot name="header">
          {{ labelKey ? t(labelKey) : label }}
        </slot>
      </k-header>
      <k-main>
        <slot>
          <k-table v-bind="{ ...$props, ...$attrs }" />
        </slot>
      </k-main>
      <k-footer class="spaceBetween k-footer">
        <el-pagination
          v-if="vModelPaging"
          v-model:currentPage="vModelPaging.currentPage"
          @update:current-page="updateCurrentPage"
          :page-size="vModelPaging.pageSize"
          :small="false"
          layout="total, prev, pager, next"
          :total="totalCount"
        />
        <span v-else></span>
        <span class="tableIcons">
          <el-icon :size="20" @click="$emit('exportRows')"><DownloadIcon /></el-icon>
          <el-icon :size="20" v-if="filterEnabled" @click="$emit('update:showFilter', !showFilter)"><search-icon /></el-icon>
        </span>
      </k-footer>
    </k-container>
  </k-container>
</template>

<style scoped>
  .tableIcons i {
    margin: 0 5px;
    cursor: pointer;
  }
  .tableIcons i:hover {
    margin: 0 5px;
    cursor: pointer;
    color: var(--el-color-primary);
  }
</style>
