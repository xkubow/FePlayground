<template>
  <k-input v-model="tableFilterQuery" :placeholder="quickSearchPlaceholder" class="input-with-select filter-input-size" @input="debouncedFastSearch">
    <template v-slot:append>
      <k-button icon="el-icon-search" @click="fastSearch" />
    </template>
  </k-input>
  <k-info-button :text="quickSearchHint" title-key="cmdInfo" />
</template>

<script lang="ts">
  import _ from 'lodash';
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'KFastSearch',
    setup(props, { emit }) {
      const { t } = useI18n();
      const quickSearchHint = t('fastSearch');
      const quickSearchPlaceholder = t('fastSearch');
      const tableFilterQuery = ref(null as string | null);
      const fastSearch = () => {
        emit('tableFilterQuery', tableFilterQuery.value);
      };
      const debouncedFastSearch = _.debounce(fastSearch, 300);

      return { fastSearch, quickSearchHint, quickSearchPlaceholder, debouncedFastSearch, tableFilterQuery };
    },
  });
</script>

<style lang="scss" scoped>
  .filter-input-size {
    width: calc(100% - 70px);
  }
</style>
