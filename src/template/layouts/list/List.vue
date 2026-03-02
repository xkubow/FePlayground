<template>
  <k-container v-if="!leaving" class="full-content-height-container margin-content">
    <k-aside v-if="!isFilterSlotEmpty" v-show="showFilter">
      <k-container direction="vertical" class="k-filter-aside">
        <k-header>
          <k-row class="w-100 mb-10">
            <k-col>
              <k-button class="search-button w-100" type="warning" plain @click="toggleFilter">
                <el-icon :size="25">
                  <arrow-left-icon />
                </el-icon>
              </k-button>
            </k-col>
          </k-row>

          <k-row class="w-100 mb-10">
            <k-button-group class="w-100">
              <k-button v-if="!autoFilter" type="success" @click="onFilterSubmit" :icon="CheckIcon" class="w-100" />
              <k-button v-if="!autoFilter" type="info" @click="$emit('filterResetClick', $emit)" class="w-100" :icon="CloseIcon" />
            </k-button-group>
          </k-row>
        </k-header>

        <k-main class="k-filter-aside-main">
          <k-form ref="filterFormRef" :model="model" :validate-on-rule-change="false" :rules="validationRules" @submit="onFilterSubmit" label-position="top">
            <k-row>
              <slot name="filter" />
            </k-row>
          </k-form>
        </k-main>

        <k-footer class="k-filter-aside-footer"> </k-footer>
      </k-container>
    </k-aside>
    <span v-if="!isFilterSlotEmpty" class="filtre-colapse-button" @click="toggleFilter">
      <span class="filter-colapse-icons">
        <el-icon>
          <arrow-left-icon v-if="showFilter" />
          <arrow-right-icon v-else />
        </el-icon>
        <el-icon>
          <arrow-left-icon v-if="showFilter" />
          <arrow-right-icon v-else />
        </el-icon>
        <el-icon>
          <arrow-left-icon v-if="showFilter" />
          <arrow-right-icon v-else />
        </el-icon>
      </span>
    </span>
    <k-container direction="vertical">
      <k-header class="f-w" :height="mainHeaderHeight">
        <k-button v-if="canClose" plain @click="$emit('closeClick', $event)" :icon="CloseIcon" />
        <k-button
          v-if="!isFilterSlotEmpty && !showFilter"
          :disabled="false"
          class="btn-toggle-filter btn-toggle-filter--content pull-left"
          type="warning"
          plain
          @click="toggleFilter"
          :icon="SearchIcon"
        />
        <k-divider direction="vertical" style="height: 2em" />
        <span class="title">
          <slot name="title" />
        </span>

        <div class="ml-a d-f ai-c jc-fe f-w">
          <k-table-header v-bind="{ canExport, canCreate }" v-on="{ exportClick, createClick }" />
          <slot name="header" />
        </div>
      </k-header>
      <k-main ref="mainContainerRef" v-loading="loadingContent">
        <slot name="content" />
      </k-main>
    </k-container>
  </k-container>
</template>

<script lang="ts">
  import KTableHeader from '@/template/components/table/TableHeader.vue';
  import { OperationFlags } from '@/template/utils/operationFlags';
  import {
    ArrowLeft as ArrowLeftIcon,
    ArrowRight as ArrowRightIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Search as SearchIcon,
  } from '@element-plus/icons-vue';
  import { computed, defineComponent, provide, ref, toRefs } from 'vue';

  export default defineComponent({
    name: 'k-layout-list',
    inheritAttrs: false,
    props: {
      model: { type: Object, default: () => ({}) },
      validationRules: { type: Object, default: () => ({}) },
      operations: { type: Number, default: 0 },
      canClose: { type: Boolean, default: true },
      useCreate: { type: Boolean, default: true },
      showFiltrInit: { type: Boolean, default: true },
      autoFilter: { type: Boolean, default: false },
      leaving: { type: Boolean, default: false },
      mainHeaderHeight: { type: String, default: '120' },
      loadingContent: { type: Boolean, default: false },
    },
    components: {
      KTableHeader,
      ArrowLeftIcon,
      ArrowRightIcon,
    },
    setup(props, { slots, emit }) {
      const { operations, showFiltrInit } = toRefs(props);
      const showFilter = ref(showFiltrInit.value);
      const isFilterSlotEmpty = ref(!slots.filter);
      const mainContainerRef = ref(null);
      const canCreate = computed(() => {
        return !!(operations.value & OperationFlags.CREATE);
      });
      const canExport = computed(() => !!(operations.value & OperationFlags.EXPORT));
      const exportClick = (event: Event) => {
        emit('exportClick', event);
      };
      const createClick = (event: Event) => {
        emit('createClick', event);
      };
      function toggleFilter() {
        showFilter.value = !showFilter.value;
        emit('toggleFilter', showFilter.value);
      }
      function onFilterSubmit() {
        emit('filterClick');
      }

      provide('filterSubmit', onFilterSubmit);

      return {
        showFilter,
        isFilterSlotEmpty,
        canCreate,
        canExport,
        toggleFilter,
        onFilterSubmit,
        exportClick,
        createClick,
        mainContainerRef,
        CloseIcon,
        SearchIcon,
        CheckIcon,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .half-width {
    width: 50%;
  }
</style>
