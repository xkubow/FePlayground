<template>
  <el-collapse v-model="model">
    <slot />
  </el-collapse>
</template>

<script setup lang="ts">
  import { toRefs, computed } from 'vue';

  interface Props {
    modelValue: string[];
  }

  const props = defineProps<Props>();
  const propsRef = toRefs(props);
  const emits = defineEmits(['update:value']);

  const model = computed({
    get() {
      return propsRef.modelValue.value;
    },
    set(value: string[]) {
      emits('update:value', value);
    },
  });
</script>

<style scoped></style>
