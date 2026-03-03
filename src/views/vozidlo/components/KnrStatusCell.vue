<template>
  <k-row class="ac">
    <k-col :span="20">
      <div>
        {{ knr }}
      </div>
      <div>
        <k-icon v-for="(item, index) in status" :key="index" :size="15" :color="statusColor(item.status)">
          <user-icon />
        </k-icon>
      </div>
    </k-col>
    <k-col :span="3">
      <span class="status_count-align">
        2
        <!-- {{ status[1].count }} -->
      </span>
    </k-col>
  </k-row>
</template>
<script setup lang="ts">
  import { type PropType } from 'vue';
  import { User as UserIcon } from '@element-plus/icons-vue';
  import type { StatusColumn } from '../type';

  defineProps({
    knr: Number,
    status: { type: Array as PropType<StatusColumn[]> },
  });

  const statusColor = (status: string): string => {
    if (status === 'OK') return 'green';
    else if (status === 'NOK') return 'red';

    return 'gray';
  };
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
