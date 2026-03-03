<template>
  <k-row class="jc-c">
    <!-- <k-col :span="23"> -->
    <!-- {{ status }} -->
    <k-icon :size="20" :color="statusColor(status)">
      <select-icon v-if="statusOk" />
      <warning-filled v-else />
    </k-icon>
    <!-- </k-col> -->
  </k-row>
</template>
<script lang="ts">
  import { Select as SelectIcon, WarningFilled } from '@element-plus/icons-vue';
  import { computed, defineComponent, toRefs } from 'vue';

  export default defineComponent({
    props: {
      status: String,
    },
    components: {
      WarningFilled,
      SelectIcon,
    },
    setup(props) {
      const { status } = toRefs(props);
      const statusOk = computed(() => !!status.value);
      const statusColor = (status: string): string => (status ? 'green' : 'red');

      return { statusColor, statusOk };
    },
  });
</script>

<style scoped>
  .status_count-align {
    font-size: 30pt;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ac {
    align-items: center;
  }
</style>
