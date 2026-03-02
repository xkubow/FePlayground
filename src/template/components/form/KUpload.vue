<template>
  <el-upload ref="uploadRef" :disabled="isDisabled" v-model:file-list="fileList">
    <slot />
    <template v-if="tip || slots.tip" #tip>
      <slot name="tip">
        <div class="el-upload__tip">{{ tip }}</div>
      </slot>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
  import { toRefs, ref, useSlots } from 'vue';
  import { useDisabled } from '../base/base';
  import type { UploadInstance, UploadUserFile } from 'element-plus';

  export interface Props {
    tip?: string;
    disabled?: boolean;
  }
  const fileList = ref<UploadUserFile[]>([]);
  const props = withDefaults(defineProps<Props>(), { disabled: undefined });
  const propsRef = toRefs(props);
  const slots = useSlots();
  const { isDisabled } = useDisabled(propsRef.disabled);
  const uploadRef = ref<UploadInstance>();

  defineExpose({
    open,
    fileList,
  });
</script>

<style scoped></style>
