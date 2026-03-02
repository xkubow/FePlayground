<template>
  <el-tooltip :teleported="false" v-if="tooltip" :content="tooltip">
    <el-button v-bind="{ ...$attrs, ...$props, disabled: isDisabled }">
      <slot>
        {{ labelText }}
      </slot>
    </el-button>
  </el-tooltip>
  <el-button v-else v-bind="{ disabled: isDisabled }">
    <slot>
      {{ labelText }}
    </slot>
  </el-button>
</template>

<script setup lang="ts">
  import { toRefs } from 'vue';
  import { baseProps, useBase } from '../base/base';

  const props = defineProps({
    ...baseProps,
    tooltip: String,
  });
  const propRefs = toRefs(props);
  const base = useBase(propRefs);
  const { isDisabled, labelText } = base;
</script>

<style scoped></style>
